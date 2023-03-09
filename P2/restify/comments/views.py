from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import PropertyComment, UserComment
from ..accounts.models import User
from .serializers import PropertyCommentSerializer, UserCommentSerializer
from django.shortcuts import get_object_or_404

# /comments/property/<property_id>/ [get]: List all comments of a property.
# /comments/property/<property_id>/ [post]: For a user to add a new comment on a property that he or she just stayed at.
class PropertyComment(APIView):
    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('property_id')
        property_object = get_object_or_404('Property', pk=pk)
        
        comments = property_object.propertycomment_set.objects.all()
        serializer = PropertyCommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        pk = self.kwargs.get('property_id')
        property_object = get_object_or_404('Property', pk=pk)

        data = {
            'text': request.data.get('text'), 
            'property': property_object,
            'user': request.user,
        }

        serializer = PropertyCommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PropertyReply(APIView):
    pass


class UserComment(APIView):
    pass

