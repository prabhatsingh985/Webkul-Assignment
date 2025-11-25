from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, UserProfileSerializer
from .models import User

class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user
