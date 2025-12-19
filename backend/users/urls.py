# Import Django path handler
from django.urls import path
# Import JWT views for Login and Token Refresh
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
# Import our custom views
from .views import SignupView, ProfileView

urlpatterns = [
    # Route for User Signup
    path('signup/', SignupView.as_view(), name='signup'),
    
    # Route for User Login (Returns Access + Refresh Tokens)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Route to get a NEW Access Token using a Refresh Token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Route to retrieve or update User Profile
    path('profile/', ProfileView.as_view(), name='profile'),
]
