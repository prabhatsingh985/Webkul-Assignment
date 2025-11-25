from django.db import models
from django.conf import settings

class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
    dislikes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='disliked_posts', blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.created_at}"
