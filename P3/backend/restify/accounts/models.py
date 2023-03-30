from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MinLengthValidator

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    email = models.EmailField(blank=False, null=False, error_messages={'invalid': 'Enter a valid email address'})
    first_name = models.CharField(max_length=128, blank=False, null=False)
    last_name = models.CharField(max_length=128, blank=False, null=False)
    phone_number = models.CharField(max_length=15, validators=[MinLengthValidator(8)])
    address_1 = models.CharField(max_length=128, blank=True, null=True)
    address_2 = models.CharField(max_length=128, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    zip_postcode = models.CharField(max_length=10, blank=True, null=True)
    state_province = models.CharField(max_length=50, blank=True, null=True)
    country = models.CharField(max_length=50, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    objects = CustomUserManager()

    def __str__(self):
        return self.username
