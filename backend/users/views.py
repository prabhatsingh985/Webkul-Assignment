# Import necessary modules from Django REST Framework
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
# Import our custom serializers and models
from .serializers import UserSerializer, UserProfileSerializer
from .models import User

# View for User Signup
# Inherits from CreateAPIView which handles POST requests automatically
class SignupView(generics.CreateAPIView):
    # # Define the queryset (collection of all users) - required by generics
    # queryset = User.objects.all()
    # Allow ANYONE to access this view (even if not logged in)
    permission_classes = (permissions.AllowAny,)
    # Use UserSerializer to validate and save the data
    serializer_class = UserSerializer

# View for User Profile (Retrieve and Update)
# Inherits from RetrieveUpdateAPIView (handles GET and PUT/PATCH)
class ProfileView(generics.RetrieveUpdateAPIView):
    # Only allow Logged In users to access this view
    permission_classes = (permissions.IsAuthenticated,)
    # Use UserProfileSerializer to format the data (hides password)
    serializer_class = UserProfileSerializer

    # Override get_object to return the CURRENT user
    # Instead of looking for an ID in the URL, we get the request.user
    def get_object(self):
        return self.request.user
