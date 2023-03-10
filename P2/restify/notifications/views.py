from django.shortcuts import render

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from properties import models
from .models import Notification
from .serializers import NotificationSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import authentication, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication

# /notifications/ [get]: List bot user and host notifications for a user
# /notifications/ [post]: create a user or host notification for a user
class AllNotifications(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request, *args, **kwargs):
        notifications = request.user.notifications.all()
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        data = {
            'type': request.data.get('type'), 
            'user': request.data.get('user_id'),
            'property': request.data.get('property_id'),
        }
        
        serializer = NotificationSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# /notifications/<notification_id> [get]: return the notification and delete it 
class ReadNotification(APIView):
    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('notification_id')
        notification_object = get_object_or_404(Notification, pk=pk)
        serializer = NotificationSerializer(notification_object)
        # delete the notification
        notification_object.delete()
        return Response(serializer.data, status=status.HTTP_200_OK)