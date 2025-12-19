# Standard imports
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Post
from .serializers import PostSerializer

# View to List all posts and Create a new post
# Inherits from ListCreateAPIView which handles GET (list) and POST (create)
class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    # Allow reading by anyone, but creation only by authenticated users
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    # Custom queryset logic
    def get_queryset(self):
        # Start with all posts, newest first
        queryset = Post.objects.all().order_by('-created_at')
        # Check if URL has ?user_id=123
        user_id = self.request.query_params.get('user_id')
        if user_id:
            # Filter posts to show only that user's posts
            queryset = queryset.filter(user__id=user_id)
        return queryset

    # Custom create logic to attach the current user as the author
    def perform_create(self, serializer):
        # serializer.save() accepts kwargs that override the validated data
        serializer.save(user=self.request.user)

# View to Retrieve, Delete (and optionally Update) a single post
class PostDetailView(generics.RetrieveDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    # Custom delete logic to enforce ownership
    def delete(self, request, *args, **kwargs):
        post = self.get_object() # Find the post by ID
        # Check: Is the person trying to delete the same as the author?
        if post.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        # If yes, delete it
        return super().delete(request, *args, **kwargs)

# Custom View for Liking a Post
class LikePostView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        # If already liked, unlike it (Toggle)
        if post.likes.filter(id=request.user.id).exists():
            post.likes.remove(request.user)
        else:
            # Add like
            post.likes.add(request.user)
            # Remove dislike if it exists (Cannot like and dislike same time)
            post.dislikes.remove(request.user) 
        return Response(status=status.HTTP_200_OK)

# Custom View for Disliking a Post
class DislikePostView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        # If already disliked, undislike it (Toggle)
        if post.dislikes.filter(id=request.user.id).exists():
            post.dislikes.remove(request.user)
        else:
            # Add dislike
            post.dislikes.add(request.user)
            # Remove like if it exists
            post.likes.remove(request.user) 
        return Response(status=status.HTTP_200_OK)
