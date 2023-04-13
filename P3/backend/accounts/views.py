from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import SignUpSerializer, ChangePasswordSerializer, ProfileSerializer, UpdateUserSerializer


class SignUpAPIView(CreateAPIView):

    serializer_class = SignUpSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            user_data = serializer.data.copy()
            del user_data['password']
            return Response({
                'Message': "User created successfully",
                'User': user_data},
                status=status.HTTP_201_CREATED)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        return Response({'message': 'This is the signup page'})
    
class LoginAPIView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token_pair = serializer.validated_data
        refresh_token = RefreshToken(token_pair['refresh'])
        response.set_cookie(key='access_token', value=str(token_pair['access']), httponly=True, max_age=3600, expires=refresh_token['exp'])
        return response
    
    def get(self, request, *args, **kwargs):
        message = "Please login using your username and password:"
        return Response({'message': message})
        
    def handle_exception(self, exc):
        if isinstance(exc, AuthenticationFailed):
            return Response({'error': 'Incorrect username or password.'}, status=400)
        return super().handle_exception(exc)

class LogoutAPIView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        if request.user.is_authenticated:
            username = request.user.username
            response = Response({'message': f'{username.capitalize()}, you have been logged out.'})
            response.delete_cookie(key='access_token')
            return response
        else:
            auth_header = request.headers.get('Authorization')
            if auth_header is None or not auth_header.startswith('Bearer '):
                return Response({'message': 'You have not logged in.'}, status=status.HTTP_401_UNAUTHORIZED)

class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        message = "Please enter you current password, new password and confirm your new password to change your password:"
        return Response({'message': message})
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        user = authenticate(request=request, username=request.user.username, password=serializer.validated_data['password'])
        if not user:
            return Response({'password': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)
        if serializer.validated_data['new_password'] != serializer.validated_data['confirm_password']:
            return Response({'confirm_password': 'New password and confirm password must match'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        update_last_login(None, user)

        return Response({'status': 'Password changed successfully'})
    
class ViewProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user
        serializer = ProfileSerializer(user)
        return Response(serializer.data)
    
class EditProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user
        serializer = UpdateUserSerializer(user)
        return Response(serializer.data)

    def post(self, request):
        serializer = UpdateUserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
