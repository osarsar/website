from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
import random
import string


# Game start
class GameResult(models.Model):
    winner = models.CharField(max_length=10)
    user1_score = models.IntegerField()
    user2_score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    fit_u1 = models.IntegerField()
    fit_u2 = models.IntegerField()

    def __str__(self):
        return f"Game {self.id}: {self.winner} won ({self.user1_score}-{self.user2_score}); ({self.fit_u1}-{self.fit_u2}); at {self.created_at}"
# Game end

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    level = models.IntegerField(default=0)
    percent = models.IntegerField(default=0.0)
    is_online = models.BooleanField(default=False)
    profile_image = models.ImageField(upload_to='profile_images/', default='profile_images/default_profile_image.jpg', null=True, blank=True)
    friends = models.ManyToManyField(User, related_name='friends', blank=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} Profile"

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    instance.profile.save()

@receiver(pre_save, sender=User)
def check_unique_email(sender, instance, **kwargs):
    if User.objects.filter(email=instance.email).exclude(pk=instance.pk).exists():
        raise ValidationError("Email already exists.")



class FriendRequestModel(models.Model):
    requester = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='sent_request')
    accepter = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_request', null=True, blank=True)
    status = models.CharField(max_length=10)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.requester.username

#-----------------------------idryab---------------------------------------------

class ChatMessage(models.Model):
    sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_messages', null=True, blank=True)
    room = models.CharField(max_length=255, null=True, blank=True)  # for group chat or room-based chat
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender.username}: {self.content[:20]}'

class Chatgroups(models.Model):
    name = models.CharField(max_length=50)
    message = models.ForeignKey(ChatMessage, on_delete=models.CASCADE, related_name="g_message")


    def __str__(self):
        return f'{self.message.sender}'

class PrivateMessageModel(models.Model):
    sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='sent_prv_messages')
    receiver = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_prv_messages', null=True, blank=True)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender.username}: {self.content[:30]}'
        
#-----------------------------End of idryab---------------------------------------------