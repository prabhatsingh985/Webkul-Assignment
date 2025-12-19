from django.db import models
from django.conf import settings

# Post Model representing a user's upload
class Post(models.Model):
    # Foreign Key to User: If user is deleted, delete their posts (CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    # Optional Image for the post
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)
    # Text content
    description = models.TextField(blank=True)
    # Automatically set timestamp when created
    created_at = models.DateTimeField(auto_now_add=True)
    
    # ManyToMany Field for Likes: A post can be liked by MANY users, and a user can like MANY posts
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
    # ManyToMany Field for Dislikes
    dislikes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='disliked_posts', blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.created_at}"
