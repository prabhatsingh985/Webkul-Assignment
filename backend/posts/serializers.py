from rest_framework import serializers
from .models import Post
from users.serializers import UserProfileSerializer

# Serializer to convert Post models to JSON
class PostSerializer(serializers.ModelSerializer):
    # Nested Serializer: Instead of just returning the User ID, return the full User Profile (name, pic, etc.)
    user = UserProfileSerializer(read_only=True)
    
    # Custom Fields: These don't exist in the database directly, we calculate them on the fly
    likes_count = serializers.SerializerMethodField()
    dislikes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField() # Did the current user like this?
    is_disliked = serializers.SerializerMethodField() # Did the current user dislike this?

    class Meta:
        model = Post
        fields = ('id', 'user', 'image', 'description', 'created_at', 'likes_count', 'dislikes_count', 'is_liked', 'is_disliked')
        read_only_fields = ('user', 'created_at', 'likes', 'dislikes')

    # Calculate total likes
    def get_likes_count(self, obj):
        return obj.likes.count()

    # Calculate total dislikes
    def get_dislikes_count(self, obj):
        return obj.dislikes.count()

    # Check if the Requesting User has liked this post
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    # Check if the Requesting User has disliked this post
    def get_is_disliked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.dislikes.filter(id=request.user.id).exists()
        return False
