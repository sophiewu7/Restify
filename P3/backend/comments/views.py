from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import PropertyComment, UserComment
from properties import models
from .serializers import PropertyCommentSerializer, UserCommentSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import authentication, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.pagination import PageNumberPagination

# /comments/property/<property_id>/ [get]: List all comments of a property.
# /comments/property/<property_id>/ [post]: For a user to add a new comment on a property that he or she just stayed at.
class PropertyComments(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request, *args, **kwargs):
        paginator = PageNumberPagination()
        pk = self.kwargs.get('property_id')
        property_object = get_object_or_404(models.Property, pk=pk)
        
        comments = paginator.paginate_queryset(property_object.propertycomment_set.all(), request)
        serializer = PropertyCommentSerializer(comments, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    def post(self, request, *args, **kwargs):
        
        pk = self.kwargs.get('property_id')
        property_object = get_object_or_404(models.Property, pk=pk)
        
        data = {
            'text': request.data.get('text'), 
            'property': pk,
            'user': request.user.pk
        }

        serializer = PropertyCommentSerializer(data=data, context={'request': request})

        # also check if the user reserved this property before 
        print(request.user.reservation_set.all())
        if serializer.is_valid(raise_exception=True) and request.user.reservation_set.filter(reserve_property=property_object).exists():
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
        
        serializer = PropertyCommentSerializer(comment_object, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        property_id = self.kwargs.get('property_id')
        comment_id = self.kwargs.get('comment_id')
        property_object = get_object_or_404(models.Property, pk=property_id)
        comment_object = get_object_or_404(PropertyComment, pk=comment_id)
        print("Larry:",request.user.pk)
        data = {
            'text': request.data.get('text'), 
            'property': property_id,
            'parent_comment': comment_id,
            'user': request.user.pk
        }

        serializer = PropertyCommentSerializer(data=data, context={'request': request})
        
        if serializer.is_valid(raise_exception=True) and property_object in request.user.property_set.all():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# /comments/user/<user_id>/ [get]: To view comments on a user
# /comments/user/<user_id>/ [post]: For host to add a comment on a user

class UserComment(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request, *args, **kwargs):
        paginator = PageNumberPagination()
        user_id = self.kwargs.get('user_id')    
        from accounts import models    
        user_object = get_object_or_404(models.User, pk=user_id)
        comments = paginator.paginate_queryset(user_object.host_comment.all(), request)
        serializer = UserCommentSerializer(comments, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    def post(self, request, *args, **kwargs):
        user_id = self.kwargs.get('user_id')    
        from accounts import models    
        user_object = get_object_or_404(models.User, pk=user_id)
        
        data = {
            'text': request.data.get('text'), 
            'user': user_id,
            'host': request.user.pk
        }

        serializer = UserCommentSerializer(data=data, context={'request': request})
        
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

