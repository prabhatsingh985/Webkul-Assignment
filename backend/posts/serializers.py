from rest_framework import serializers
from .models import Post
from users.serializers import UserProfileSerializer

class PostSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    dislikes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_disliked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'user', 'image', 'description', 'created_at', 'likes_count', 'dislikes_count', 'is_liked', 'is_disliked')
        read_only_fields = ('user', 'created_at', 'likes', 'dislikes')

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_dislikes_count(self, obj):
        return obj.dislikes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_is_disliked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.dislikes.filter(id=request.user.id).exists()
        return False
