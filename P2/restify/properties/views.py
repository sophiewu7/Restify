from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.db.models import Q
from datetime import datetime, date

# Create your views here.
from .models import Property, Availability
from .serializers import PropertySerializer, AvailabilitySerializer
# , SearchSerializer

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

# class PropertySearchView(generics.ListAPIView):
#     serializer_class = PropertySerializer

#     def get_queryset(self):
#         queryset = Property.objects.all()

#         search_serializer = SearchSerializer(data=self.request.query_params)
#         search_serializer.is_valid(raise_exception=True)
#         search_data = search_serializer.validated_data

#         location = search_data.get('location')
#         check_in = search_data.get('check_in')
#         check_out = search_data.get('check_out')
#         guests = search_data.get('guests')
#         min_price = search_data.get('min_price')
#         max_price = search_data.get('max_price')
#         bedrooms = search_data.get('bedrooms')
#         washrooms = search_data.get('washrooms')

#         if location:
#             queryset = queryset.filter(Q(city__icontains=location) | Q(country__icontains=location) | Q(detailed_address__icontains=location) | Q(zip_postcode__icontains=location))

#         if check_in and check_out:
#             availability_queryset = Availability.objects.filter(Q(start_date__lte=check_in, end_date__gte=check_out) | Q(start_date__gte=check_in, end_date__lte=check_out) | Q(start_date__lte=check_in, end_date__gte=check_in) | Q(start_date__lte=check_out, end_date__gte=check_out))
#             if guests:
#                 availability_queryset = availability_queryset.filter(property__max_guests__gte=guests)
#             if min_price:
#                 availability_queryset = availability_queryset.filter(price__gte=min_price)
#             if max_price:
#                 availability_queryset = availability_queryset.filter(price__lte=max_price)
#             if bedrooms:
#                 availability_queryset = availability_queryset.filter(property__num_bedrooms=bedrooms)
#             if washrooms:
#                 availability_queryset = availability_queryset.filter(property__num_washrooms=washrooms)
#             property_ids = [availability.property.id for availability in availability_queryset]
#             queryset = queryset.filter(id__in=property_ids)

#         return queryset