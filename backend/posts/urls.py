from django.urls import path
from .views import PostListCreateView, PostDetailView, LikePostView, DislikePostView

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list-create'),
    path('<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('<int:pk>/like/', LikePostView.as_view(), name='like-post'),
    path('<int:pk>/dislike/', DislikePostView.as_view(), name='dislike-post'),
]
