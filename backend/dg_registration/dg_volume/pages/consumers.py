# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json

from .models import ChatMessage, PrivateMessageModel
from django.contrib.auth import get_user_model

from asgiref.sync import sync_to_async
from .models import UserProfile


# --------------------------------------->> Game start
import random
import asyncio
from .models import GameResult

class PongConsumer(AsyncWebsocketConsumer):
    rooms = {}
    
    async def connect(self):
        await self.accept()
        
        # Look for an available room with one player
        available_room = None
        for room_name, room in self.rooms.items():
            if len(room['players']) == 1:
                available_room = room_name
                break
        
        if available_room:
            self.room_name = available_room
        else:
            # Create a new room
            self.room_name = f'pong_room_{len(self.rooms) + 1}'
            self.rooms[self.room_name] = self.create_new_room()

        room = self.rooms[self.room_name]

        self.room_group_name = f'game_{self.room_name}'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        if len(room['players']) < 2:
            self.user_role = 'user1' if 'user1' not in room['players'] else 'user2'
            room['players'][self.user_role] = self
            print(f"WebSocket connection accepted for {self.channel_name} as {self.user_role} in room {self.room_name}")

            if len(room['players']) == 2:
                room['game_state'] = self.create_new_game_state()
                room['game_loop_task'] = asyncio.create_task(self.game_loop())
                print(f"Game loop task created for room {self.room_name}")
            else:
                room['game_state']['waiting'] = True
        else:
            # This shouldn't happen, but just in case
            await self.close()
            return

        await self.send_game_state()

    def create_new_room(self):
        return {
            'players': {},
            'game_loop_task': None,
            'game_state': self.create_new_game_state()
        }

    def create_new_game_state(self):
        return {
            'canvas': {'width': 800, 'height': 500},
            'ball': {
                'x': 400, 'y': 250, 'dx': 5, 'dy': 5, 'radius': 10,
                'velocityX': 5, 'velocityY': 5, 'speed': 5, 'fit_u1' : 0, 'fit_u2' : 0
            },
            'paddles': {
                'user1': {'x': 0, 'y': 200, 'width': 10, 'height': 100},
                'user2': {'x': 790, 'y': 200, 'width': 10, 'height': 100}
            },
            'scores': {'user1': 0, 'user2': 0},
            'winner': 'none',
            'score_max': 5,
            'waiting': True
        }

    async def disconnect(self, close_code):
        print(f"WebSocket disconnected. Close code: {close_code}")
        if hasattr(self, 'room_name'):
            room = self.rooms[self.room_name]
            if self.user_role in room['players']:
                del room['players'][self.user_role]
            if room['game_loop_task']:
                room['game_loop_task'].cancel()
                room['game_loop_task'] = None
            room['game_state'] = self.create_new_game_state()
            if len(room['players']) == 0:
                del self.rooms[self.room_name]
            else:
                await self.send_game_state()
        
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        room = self.rooms[self.room_name]
        data = json.loads(text_data)
        # print(f"Received message: {data}")

        if data['type'] == 'score_max':
            room['game_state']['score_max'] = data['score_max']

        if data['type'] == 'paddle_move' and not room['game_state']['waiting']:
            direction = data['direction']
            
            old_y = room['game_state']['paddles'][self.user_role]['y']
            move_amount = 20
            if direction == 'up':
                room['game_state']['paddles'][self.user_role]['y'] = max(0, old_y - move_amount)
            else:
                room['game_state']['paddles'][self.user_role]['y'] = min(
                    room['game_state']['canvas']['height'] - room['game_state']['paddles'][self.user_role]['height'],
                    old_y + move_amount
                )
            
            await self.send_game_state()

    async def send_game_state(self):
        room = self.rooms[self.room_name]
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_update',
                'game_state': room['game_state']
            }
        )

    async def game_update(self, event):
        await self.send(text_data=json.dumps(event['game_state']))

    def reset_ball(self):
        room = self.rooms[self.room_name]
        ball = room['game_state']['ball']
        canvas = room['game_state']['canvas']
        paddles = room['game_state']['paddles']
        ball['x'] = canvas['width'] / 2
        ball['y'] = canvas['height'] / 2
        ball['speed'] = 5
        ball['velocityX'] = 5 if random.random() > 0.5 else -5
        ball['velocityY'] = 5 if random.random() > 0.5 else -5

        paddles['user1']['y'] = canvas['height'] / 2 - paddles['user1']['height'] / 2
        paddles['user2']['y'] = canvas['height'] / 2 - paddles['user2']['height'] / 2

    def collision(self, ball, paddle):
        return (
            ball['x'] + ball['radius'] > paddle['x'] and
            ball['x'] - ball['radius'] < paddle['x'] + paddle['width'] and
            ball['y'] + ball['radius'] > paddle['y'] and
            ball['y'] - ball['radius'] < paddle['y'] + paddle['height']
        )

    @sync_to_async
    def save_game_result(self, winner, user1_score, user2_score, fit_u1, fit_u2):
        GameResult.objects.create(
            winner=winner,
            user1_score=user1_score,
            user2_score=user2_score,
            fit_u1=fit_u1,
            fit_u2=fit_u2
        )

    async def game_loop(self):
        print(f"Game loop started for room {self.room_name}")
        try:
            room = self.rooms[self.room_name]
            room['game_state']['waiting'] = False
            await self.send_game_state()

            while True:
                room = self.rooms[self.room_name]
                if len(room['players']) < 2:
                    room['game_state']['waiting'] = True
                    await self.send_game_state()
                    return

                if room['game_state']['scores']['user2'] == room['game_state']['score_max']:
                    room['game_state']['winner'] = 'W2' 
                    room['game_state']['waiting'] = True
                    await self.send_game_state()
                    await self.save_game_result('user2', room['game_state']['scores']['user1'], room['game_state']['scores']['user2'], room['game_state']['ball']['fit_u1'], room['game_state']['ball']['fit_u2'])
                    return
                if room['game_state']['scores']['user1'] == room['game_state']['score_max']:
                    room['game_state']['winner'] = 'W1'
                    room['game_state']['waiting'] = True
                    await self.send_game_state()
                    await self.save_game_result('user1', room['game_state']['scores']['user1'], room['game_state']['scores']['user2'], room['game_state']['ball']['fit_u1'], room['game_state']['ball']['fit_u2'])
                    return

                ball = room['game_state']['ball']
                canvas = room['game_state']['canvas']
                paddles = room['game_state']['paddles']

                # Ball collision with top and bottom
                if ball['y'] + ball['radius'] > canvas['height'] or ball['y'] - ball['radius'] < 0:
                    ball['velocityY'] = -ball['velocityY']

                # Update ball position
                ball['x'] += ball['velocityX']
                ball['y'] += ball['velocityY']

                # Determine which user's paddle to check
                user = 'user1' if ball['x'] + ball['radius'] < canvas['width'] / 2 else 'user2'
                paddle = paddles[user]

                # Ball collision with paddles or scoring
                if ball['x'] + ball['radius'] > canvas['width'] - paddles['user1']['width'] or ball['x'] - ball['radius'] < paddles['user1']['width']:
                    if self.collision(ball, paddle):
                        ball['velocityX'] = -ball['velocityX']
                        if user == 'user1':
                            ball['fit_u1'] += 1
                        else:
                            ball['fit_u2'] += 1
                    else:
                        if ball['x'] - ball['radius'] < 0:
                            room['game_state']['scores']['user2'] += 1
                            self.reset_ball()
                            await self.send_game_state()
                        elif ball['x'] + ball['radius'] > canvas['width']:
                            room['game_state']['scores']['user1'] += 1
                            self.reset_ball()
                            await self.send_game_state()

                await self.send_game_state()
                await asyncio.sleep(1/60)  # 60 FPS
        except asyncio.CancelledError:
            print(f"Game loop was cancelled for room {self.room_name}")
        except Exception as e:
            print(f"Error in game loop for room {self.room_name}: {e}")
# --------------------------------------->> Game end

#-----------------------------idryab---------------------------------------------
class chat(AsyncWebsocketConsumer):
    async def connect(self):
        # This could be based on the user or room name
        # self.room_name = 'default_room'  # You might use a dynamic room name
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        print(self.room_name)
        print(self.room_group_name)

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        # Send a message to the user indicating that they are connected
        msg_data = json.dumps({'message': "You're connected to the server", 'username': "Server"})
        await self.send(text_data=msg_data)

        #Load last 50 messages from the database
        #Django's ORM (Object-Relational Mapping) is synchronous by nature, use Django's sync_to_async utility to run the synchronous code in a thread-safe manner.
        #sync_to_async is used to run synchronous code (like a database query) in an asynchronous context.
        #using list function ensures that the evaluation of the queryset happens inside a thread-safe environment.
        messages = await sync_to_async(list)(
            ChatMessage.objects.filter(room=self.room_name).select_related('sender').order_by('-timestamp')[:50]
        )
        for message in reversed(messages):
            # print("Receiver: ", message.receiver)
            # print("Sender: ", message.sender)
            # print("Room: ", message.room)
            # print("Message", message.content)
            # print("date: ", message.timestamp.strftime('%Y-%m-%d %H:%M:%S'))
            await self.send(text_data=json.dumps({
                'message': message.content,
                'username': message.sender.username,
                'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            }))


    async def disconnect(self, close_code):
        #Leave the group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        username = data['sender']
        receiver = data['receiver']
        print(username + ": " + message + " to: " + receiver)

        #Get sender object from databse
        try:
            sender = await sync_to_async(UserProfile.objects.get)(username=username)
        except:
            print("This user does not exist")
            self.disconnect(1003)
        #Save message into the database
        save_message = await sync_to_async(ChatMessage.objects.create)(
            sender=sender,
            room=self.room_name,
            content=message
        )

        #Broadcast message to the room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
                'timestamp': save_message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'channel_name': self.channel_name  #Optionally include the sender's channel_name, I'm gonna remove it later
            }
        )
    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        timestamp = event['timestamp']
        channelname = event.get('channel_name')
        # Send the message to WebSocket
        if channelname != self.channel_name:
            await self.send(text_data=json.dumps({
                'message': message,
                'username': username,
                'timestamp': timestamp
            }))

from channels.db import database_sync_to_async
from django.core.cache import cache

# Here I'm using Django ORM with Redis Cache.(Django's caching framework)

from django.db.models import Q

from datetime import datetime

def get_current_time():
    now = datetime.now()
    return now.strftime("%Y-%m-%d %H:%M:%S")

@sync_to_async
def get_user_obj(username):
    return UserProfile.objects.get(user__username=username)
@sync_to_async
def get_private_messages(receiver_obj, sender_obj):
    return list(PrivateMessageModel.objects.filter(
        Q(receiver=receiver_obj, sender=sender_obj) | Q(receiver=sender_obj, sender=receiver_obj)
    ).select_related('receiver', 'sender').order_by('-timestamp'))

@sync_to_async
def store_private_messages(sender_obj, receiver_obj, message):
    if message:
        return PrivateMessageModel.objects.create(
            sender=sender_obj,
            receiver=receiver_obj,
            content=message
        )
def get_sender_username(msg):
    return msg.sender.user.username

@sync_to_async
def stupid_shit(user_obj1):
    if user_obj1.user.is_authenticated:
        return True
    return False

class PrivateChat(AsyncWebsocketConsumer):
    async def connect(self):
        # print("mel-yous method: ", self.scope['user']) ==>  mel-yous method:  AnonymousUser
        print(self.scope)
        self.username = self.scope['url_route']['kwargs']['room_name']

        user_obj1 = await get_user_obj(username=self.username)
        status = await stupid_shit(user_obj1)
        if not status:
            await self.close()
            return
        self.room_group_name = f"prv_chat_{self.username}_channel"
        print("User     : ", self.username)
        print("His Group: ", self.room_group_name)
        print("ChannelID: ", self.channel_name)
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        #Leave the group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        sender = data['sender']
        receiver = data['receiver']
        message = data['message']
        typeofmsg = data['typeofmsg']


        #implement a friend_request Model for storing panding requests.
        #then every req I will store it in this table
        if typeofmsg == "friend_request":
            pass
            #store it in datbase
        else:
            # store messages into the database.
            receiver_obj = await get_user_obj(username=receiver)
            sender_obj = await get_user_obj(username=sender)
            if receiver_obj:
                await store_private_messages(sender_obj, receiver_obj, message)
            else:
                print("User does not exist in database")

        to_group_name = f"prv_chat_{receiver}_channel"
        timestamp = get_current_time()
        await self.channel_layer.group_send(
            to_group_name,
            {
                    'type': 'prv_message',
                    'message': message,
                    'sender': sender,
                    'receiver': receiver,
                    'timestamp': timestamp,
                    'typeofmsg': typeofmsg
            }
        )
        if typeofmsg != "friend_request":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                        'type': 'prv_message',
                        'message': message,
                        'sender': sender,
                        'receiver': receiver,
                        'timestamp': timestamp,
                        'typeofmsg': typeofmsg
                }
            )

    async def prv_message(self, event):
        message = event['message']
        typeofmsg = event['typeofmsg']
        sender = event['sender']
        typeofmsg = event['typeofmsg']
        
        await self.send(text_data=json.dumps({
            'content': message,
            'senderName':sender,
            'receiverName': event['receiver'],
            'timestamp': event['timestamp'],
            'typeofmsg': typeofmsg,
        }))
#-----------------------------End of idryab---------------------------------------------    