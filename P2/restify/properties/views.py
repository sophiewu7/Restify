from django.shortcuts import render
from rest_framework import generics
# Create your views here.
from .models import Property, Availability
from .serializers import PropertySerializer, AvailabilitySerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from rest_framework import status
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

class IsPropertyOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class PropertyListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    serializer_class = PropertySerializer

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)
    
    # def get(self, request, *args, **kwargs):
    #     message = "Please enter information about your property to create a new listing:"
    #     return Response({'message': message})

    def perform_create(self, serializer):
        if not serializer.validated_data.get('email'):
            serializer.validated_data['email'] = self.request.user.email
        if not serializer.validated_data.get('phone_number'):
            serializer.validated_data['phone_number'] = self.request.user.phone_number
        serializer.save(owner=self.request.user)


class PropertyListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = Property.objects.all()
    serializer_class = PropertySerializer

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)


class PropertyDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    lookup_field = 'id'



class PropertyDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsPropertyOwner]
    authentication_classes = [JWTAuthentication]

    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    lookup_field = 'id'

    def perform_destroy(self, instance):
        # instance 
        super().perform_destroy(instance)


class PropertyUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsPropertyOwner]
    authentication_classes = [JWTAuthentication]

    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        obj = self.get_object()
        serializer = self.get_serializer(obj)
        return Response(serializer.data)
    
    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)

    def perform_update(self, serializer):
        super().perform_update(serializer)


class AvailListCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    serializer_class = AvailabilitySerializer

    def create(self, request, *args, **kwargs):
        property_id = self.kwargs['id']
        item = get_object_or_404(Property, id=property_id)
        if item.owner != request.user :
            return Response({'error': 'You don\'t have the permission'})

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(property=item)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AvailabilityListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer

    def get_queryset(self):
        property_id = self.kwargs['id']
        item = get_object_or_404(Property, id=property_id)
        return Availability.objects.filter(property=item)


class IsAvailabilityOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.property.owner == request.user


class AvailabilityDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsAvailabilityOwner]
    authentication_classes = [JWTAuthentication]

    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    lookup_field = 'id'

    def perform_destroy(self, instance):
        # instance 
        super().perform_destroy(instance)
