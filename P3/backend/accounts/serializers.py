from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import User

class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=120, min_length=8, style={'input_type': 'password'})
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        error_messages={
            'required': 'Please confirm your password',
        },
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 
                  'phone_number', 'password', 'confirm_password']
        extra_kwargs = {'first_name': {'required': True, 'allow_blank': False},
                        'last_name': {'required': True, 'allow_blank': False},
                        'email': {'required': True, 'allow_blank': False},
                        'phone_number': {'required': True, 'allow_blank': False},
                        'password': {'required': True, 'allow_blank': False},
                        'confirm_password': {'required': True, 'allow_blank': False}
                        }

    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({'username': 'A user with that username already exists'})
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'A user with that email already exists'})
        password = data.get('password')
        confirm_password = data.pop('confirm_password')
        if password != confirm_password:
            raise serializers.ValidationError({'password': 'The two password fields didn\'t match'})
        return super().validate(data)

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=120, min_length=8, style={'input_type': 'password'})
    new_password = serializers.CharField(max_length=120, min_length=8, style={'input_type': 'password'})
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        error_messages={
            'required': 'Please confirm your password',
        },
        style={'input_type': 'password'}
    )

    def validate(self, data):
        user = self.context['request'].user
        password = data.get('password')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')
        if not authenticate(username=user.username, password=password):
            raise serializers.ValidationError({'password': 'Your current password is incorrect'})
        if new_password != confirm_password:
            raise serializers.ValidationError({'new_password': 'The two password fields didn\'t match'})
        return super().validate(data)
    
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username', 
            'first_name', 
            'last_name', 
            'email', 
            'phone_number', 
            'address_1', 
            'address_2', 
            'city', 
            'zip_postcode', 
            'state_province', 
            'country', 
            'avatar',
        ]

class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username', 
            'first_name', 
            'last_name', 
            'email', 
            'phone_number', 
            'address_1', 
            'address_2', 
            'city', 
            'zip_postcode', 
            'state_province', 
            'country', 
            'avatar',
        ]
        read_only_fields = ['username']

    def validate_email(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError('This email is already in use.')
        return value
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if value != '':
                setattr(instance, attr, value)
        instance.save()
        return instance