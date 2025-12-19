from django.urls import path
from .views import PostListCreateView, PostDetailView, LikePostView, DislikePostView

urlpatterns = [
    # Route for Listing all posts AND Creating a new post
    path('', PostListCreateView.as_view(), name='post-list-create'),
    
    # Route for Retrieving, Updating, or Deleting a SINGLE post by ID (pk)
    path('<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    
    # Route to Like a specific post
    path('<int:pk>/like/', LikePostView.as_view(), name='like-post'),
    
    # Route to Dislike a specific post
    path('<int:pk>/dislike/', DislikePostView.as_view(), name='dislike-post'),
]
