from rest_framework import serializers
from rest_framework.widgets import PasswordInput

from .models import User

class SignUpSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(
                        write_only=True,
                        required=True,
                        error_messages={
                            'required': 'Please confirm your password',
                        },
                        widget=PasswordInput(render_value=True)
                    )

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 
                  'phone_number', 'password', 'confirm_password']

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
