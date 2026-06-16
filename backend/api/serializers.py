from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Event, Registration

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'created_at')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('name', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class EventSerializer(serializers.ModelSerializer):
    registered_count = serializers.SerializerMethodField()
    is_registered = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'date', 'location', 'created_at', 'registered_count', 'is_registered')

    def get_registered_count(self, obj):
        return obj.registrations.count()

    def get_is_registered(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.registrations.filter(user=request.user).exists()
        return False

class RegistrationSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)

    class Meta:
        model = Registration
        fields = ('id', 'event', 'registered_at')
