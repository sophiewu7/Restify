from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import PropertyComment, UserComment
# from ..accounts.models import User
from properties import models
from .serializers import PropertyCommentSerializer, UserCommentSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import authentication, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication

# /comments/property/<property_id>/ [get]: List all comments of a property.
# /comments/property/<property_id>/ [post]: For a user to add a new comment on a property that he or she just stayed at.
class PropertyComments(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('property_id')
        property_object = get_object_or_404(models.Property, pk=pk)
        
        comments = property_object.propertycomment_set.all()
        serializer = PropertyCommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        
        pk = self.kwargs.get('property_id')
        property_object = get_object_or_404(models.Property, pk=pk)
        print("PK:"+ str(request.user.pk))
        
        data = {
            'text': request.data.get('text'), 
            'property': pk,
            'user': request.user.pk
        }

        serializer = PropertyCommentSerializer(data=data)
        
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# /comments/property/<property_id>/<comment_id>/ [get]: To view a property comments.
# /comments/property/<property_id>/<comment_id>/ [post]: To reply a property comments.
class PropertyReply(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request, *args, **kwargs):
        property_id = self.kwargs.get('property_id')
        comment_id = self.kwargs.get('comment_id')
        
        property_object = get_object_or_404(models.Property, pk=property_id)
        comment_object = get_object_or_404(PropertyComment, pk=comment_id)
        
        serializer = PropertyCommentSerializer(comment_object)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        property_id = self.kwargs.get('property_id')
        comment_id = self.kwargs.get('comment_id')
        property_object = get_object_or_404(models.Property, pk=property_id)
        comment_object = get_object_or_404(PropertyComment, pk=comment_id)
        
        data = {
            'text': request.data.get('text'), 
            'property': property_id,
            'parent_comment': comment_id,
            'user': request.user.pk
        }

        serializer = PropertyCommentSerializer(data=data)
        
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# /comments/user/<user_id>/ [get]: To view comments on a user
# /comments/user/<user_id>/ [post]: For host to add a comment on a user
from accounts import models

class UserComment(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request, *args, **kwargs):
        user_id = self.kwargs.get('user_id')        
        user_object = get_object_or_404(models.User, pk=user_id)
        comments = user_object.host_comment.all()

        serializer = UserCommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        user_id = self.kwargs.get('user_id')        
        user_object = get_object_or_404(models.User, pk=user_id)
        
        data = {
            'text': request.data.get('text'), 
            'user': user_id,
            'host': request.user.pk
        }

        serializer = UserCommentSerializer(data=data)
        
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

