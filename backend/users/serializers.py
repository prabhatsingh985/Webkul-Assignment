# Import serializers from DRF
from rest_framework import serializers
from .models import User
import re

# Serializer for creating new users (Signup)
class UserSerializer(serializers.ModelSerializer):
    # Make password write-only so it is NEVER sent back in the API response
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'date_of_birth', 'profile_picture', 'password')

    # Custom create method to hash the password
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'], # Use email as username
            email=validated_data['email'],
            password=validated_data['password'], # This will be hashed automatically by create_user
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            date_of_birth=validated_data.get('date_of_birth'),
            profile_picture=validated_data.get('profile_picture')
        )
        return user

    # Custom validation for password complexity
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not re.search(r'[!@#$%^&*]', value):
            raise serializers.ValidationError("Password must contain at least one special character (!@#$%^&*).")
        return value

# Serializer for viewing User Profiles
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Exclude password from fields
        fields = ('id', 'email', 'first_name', 'last_name', 'date_of_birth', 'profile_picture')
        read_only_fields = ('email',)
