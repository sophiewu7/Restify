from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from .serializers import SignUpSerializer


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
        return Response({'Errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        return Response({'message': 'This is the signup page'})
    
class LoginAPIView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return response

    def get(self, request, *args, **kwargs):
        message = "Please login using your username and password:"
        return Response({'message': message})

class LogoutAPIView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        return Response({'message': 'You have been logged out.'})