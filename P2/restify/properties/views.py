from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.db.models import Q
from datetime import datetime, date

# Create your views here.
from .models import Property, Pricetag
from .serializers import PropertySerializer, AvailabilitySerializer, SearchSerializer

from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

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
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [JWTAuthentication]
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    lookup_field = 'id'



class PropertyDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsPropertyOwner]
    authentication_classes = [JWTAuthentication]

    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        message = "Property deleted."
        return Response({'message': message}, status=status.HTTP_200_OK)
    
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

    queryset = Pricetag.objects.all()
    serializer_class = AvailabilitySerializer

    def get_queryset(self):
        property_id = self.kwargs['id']
        item = get_object_or_404(Property, id=property_id)
        return Pricetag.objects.filter(property=item)


class IsAvailabilityOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.property.owner == request.user


class AvailabilityDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsAvailabilityOwner]
    authentication_classes = [JWTAuthentication]

    queryset = Pricetag.objects.all()
    serializer_class = AvailabilitySerializer
    lookup_field = 'id'

    def perform_destroy(self, instance):
        # instance 
        super().perform_destroy(instance)


class PropertySearchView(generics.ListAPIView):
    serializer_class = SearchSerializer

    def get_queryset(self):
        queryset = Property.objects.filter(status=True)

        # Get search keyword from URL parameters
        search_keyword = self.request.query_params.get('search', None)
        if search_keyword is not None:
            # Filter by location
            queryset = queryset.filter(Q(city__icontains=search_keyword) | Q(country__icontains=search_keyword) | Q(detailed_address__icontains=search_keyword) | Q(zip_postcode__icontains=search_keyword))

        guests = self.request.query_params.get('guests', None)
        if guests is not None:
            queryset = queryset.filter(guests__gte=int(guests))

        bedrooms = self.request.query_params.get('bedrooms', None)
        if bedrooms is not None:
            queryset = queryset.filter(bedrooms__gte=int(bedrooms))

        washrooms = self.request.query_params.get('washrooms', None)
        if washrooms is not None:
            queryset = queryset.filter(washrooms__gte=int(washrooms))

        # Filter by amenities
        swimpool = self.request.query_params.get('swimpool', None)
        if swimpool is not None:
            queryset = queryset.filter(swimpool=bool(swimpool))

        wifi = self.request.query_params.get('wifi', None)
        if wifi is not None:
            queryset = queryset.filter(wifi=bool(wifi))

        tv = self.request.query_params.get('tv', None)
        if tv is not None:
            queryset = queryset.filter(tv=bool(tv))

        gym = self.request.query_params.get('gym', None)
        if gym is not None:
            queryset = queryset.filter(gym=bool(gym))

        fire_extinguisher = self.request.query_params.get('fire_extinguisher', None)
        if fire_extinguisher is not None:
            queryset = queryset.filter(fire_extinguisher=bool(fire_extinguisher))

        aircondition = self.request.query_params.get('aircondition', None)
        if aircondition is not None:
            queryset = queryset.filter(aircondition=bool(aircondition))

        parking = self.request.query_params.get('parking', None)
        if parking is not None:
            queryset = queryset.filter(parking=bool(parking))

        bathtub = self.request.query_params.get('bathtub', None)
        if bathtub is not None:
            queryset = queryset.filter(bathtub=bool(bathtub))

        order_by = self.request.query_params.get('order_by', None)
        if order_by == 'highest_price':
            queryset = queryset.order_by('-price')
        elif order_by == 'lowest_price':
            queryset = queryset.order_by('price')
        elif order_by == 'bedrooms':
            queryset = queryset.order_by('-bedrooms')
        elif order_by == 'washrooms':
            queryset = queryset.order_by('-washrooms')

        return queryset

