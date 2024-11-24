from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "email"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
        

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    friends = UserSerializer(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'level', 'percent', 'is_online', 'profile_image', 'friends']


#-----------idryab--------------------------------------
from .models import PrivateMessageModel

class MessageSerializer(serializers.ModelSerializer):
    senderName = serializers.SerializerMethodField()
    receiverName = serializers.SerializerMethodField()

    class Meta:
        model = PrivateMessageModel
        fields = ['id', 'sender', 'receiver', 'content', 'timestamp', 'senderName', 'receiverName']  # Adjust fields as necessary
    def get_senderName(self, obj):
        return obj.sender.user.username

    def get_receiverName(self, obj):
        return obj.receiver.user.username
#-----------End of idryab--------------------------------------