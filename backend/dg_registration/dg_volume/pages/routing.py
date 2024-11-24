from django.urls import path
from . import consumers
from django.urls import re_path

# Define WebSocket URL patterns
websocket_urlpatterns = [
    path('ws/chat/<str:room_name>/', consumers.chat.as_asgi()),
    path('ws/prvchat/<str:room_name>/', consumers.PrivateChat.as_asgi()),
    #new_route
    path('ws/friend_req/<str:accepter_name>/', consumers.PrivateChat.as_asgi()),
    re_path(r'ws/pong/', consumers.PongConsumer.as_asgi())
]