from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

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