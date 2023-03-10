from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.db.models import Q
from datetime import datetime, date
from django.utils import timezone
from rest_framework.exceptions import ValidationError

# Create your views here.
from .models import Property, Pricetag
from reservations.models import Reservation
from .serializers import PropertySerializer, PricetagSerializer, SearchSerializer

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


class PriceListCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    serializer_class = PricetagSerializer

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        property_id = self.kwargs['id']
        item = get_object_or_404(Property, id=property_id)
        if item.owner != request.user :
            return Response({'error': 'You don\'t have the permission'})

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(property=item)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PriceListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = Pricetag.objects.all()
    serializer_class = PricetagSerializer

    def get_queryset(self):
        property_id = self.kwargs['id']
        item = get_object_or_404(Property, id=property_id)
        return Pricetag.objects.filter(property=item)


class IsPriceTagOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.property.owner == request.user


class PriceDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsPriceTagOwner]
    authentication_classes = [JWTAuthentication]

    queryset = Pricetag.objects.all()
    serializer_class = PricetagSerializer
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

        check_in_str = self.request.query_params.get('check_in', None)
        check_out_str = self.request.query_params.get('check_out', None)

        if check_in_str is None:
            raise ValidationError('Please enter your check in date.')
        if check_out_str is None:
            raise ValidationError('Please enter your check out date.')
        
        if check_in_str is not None:
            try:
                check_in = datetime.strptime(check_in_str, '%Y-%m-%d').date()
                if check_in < timezone.now().date():
                    raise ValidationError('Check-in date cannot be in the past.')
            except ValueError:
                raise ValidationError('Check-in date must be in the format YYYY-MM-DD.')
        
        if check_out_str is not None:
            try:
                check_out = datetime.strptime(check_out_str, '%Y-%m-%d').date()
                if check_out < timezone.now().date():
                    raise ValidationError('Check-out date cannot be in the past.')
                if check_out < check_in:
                    raise ValidationError('Check-out date cannot be prior to check-in date.')
            except ValueError:
                raise ValidationError('Check-out date must be in the format YYYY-MM-DD.')

        reserved_property_ids = Reservation.objects.filter(
                                Q(status=Reservation.APPROVED) &
                                Q(check_in__lt=check_out, check_out__gt=check_in)
                               ).values_list('reserve_property_id')
                                
        queryset = queryset.exclude(id__in=reserved_property_ids)

        min_price_str = self.request.query_params.get('min_price', None)
        if min_price_str is not None:
            try:
                min_price = float(min_price_str)
                if min_price < 0:
                    raise ValidationError('Minimum price cannot be negative.')
                cheap_property_ids = Pricetag.objects.filter(
                                        Q(start_date__lt=check_out, end_date__gt=check_in) &
                                        Q(price__lte=float(min_price))
                                      ).values_list('property_id')
                queryset = queryset.exclude(id__in=cheap_property_ids)
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                raise ValidationError('Minimum price must be a positive integer.')

        max_price_str = self.request.query_params.get('max_price', None)
        if max_price_str is not None:
            try:
                max_price = float(max_price_str)
                if max_price < 0:
                    raise ValidationError('Maximum price cannot be negative.')
                if min_price is not None and max_price < min_price:
                    raise ValidationError('Maximum price cannot be less than minimum price.')
                expansive_property_ids = Pricetag.objects.filter(
                                        Q(start_date__lt=check_out, end_date__gt=check_in) &
                                        Q(price__gte=float(max_price))
                                      ).values_list('property_id')
                queryset = queryset.exclude(id__in=expansive_property_ids)
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                raise ValidationError('Maximum price must be a positive integer.')

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

