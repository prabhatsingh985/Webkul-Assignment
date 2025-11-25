from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'date_of_birth', 'profile_picture', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            date_of_birth=validated_data.get('date_of_birth'),
            profile_picture=validated_data.get('profile_picture')
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'date_of_birth', 'profile_picture')
        read_only_fields = ('email',)
