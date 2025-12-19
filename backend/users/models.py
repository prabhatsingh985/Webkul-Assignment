# Import Django's AbstractUser to extend the default user model
from django.contrib.auth.models import AbstractUser
from django.db import models

# Custom User Model
# We extend AbstractUser to add extra fields like date_of_birth and profile_picture
class User(AbstractUser):
    # Enforce unique email addresses
    email = models.EmailField(unique=True)
    # Optional field for birthday
    date_of_birth = models.DateField(null=True, blank=True)
    # Optional field for profile picture (requires Pillow library)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    # Tell Django to use 'email' as the unique identifier for login instead of 'username'
    USERNAME_FIELD = 'email'
    # 'username' is still required by AbstractUser logic, so we keep it here
    REQUIRED_FIELDS = ['username']

    # String representation of the user (e.g. when printing the object)
    def __str__(self):
        return self.email
