from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status, filters
from .models import Reservation
from .serializers import ReservationSerializer
from properties.models import Property
from rest_framework.response import Response
# Create your views here.

class ReservationCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    serializer_class = ReservationSerializer

    # def perform_create(self, serializer):
    def create(self, request, *args, **kwargs):
        property_id = self.kwargs['id']
        reserve_property = get_object_or_404(Property, id=property_id)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        reservation = serializer.save(
            reserve_guest=self.request.user,
            reserve_property=reserve_property,
            reserve_host=reserve_property.owner.id
        )

        reservation.status = Reservation.PENDING
        reservation.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReservationGuestListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_queryset(self):
        return Reservation.objects.filter(reserve_guest=self.request.user)


class ReservationHostListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_queryset(self):
        return Reservation.objects.filter(reserve_host=self.request.user.id)

class IsReservationGuest(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.reserve_guest == request.user

class IsReservationHost(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.reserve_host == request.user.id

class ReservationGuestUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsReservationGuest]
    authentication_classes = [JWTAuthentication]

    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        obj = self.get_object()
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        status_keyword = self.request.query_params.get('status', None)
        if status_keyword == 'cancel':
            instance = self.get_object()
            instance.status = Reservation.CANCELED
            instance.save()

            serializer = self.serializer_class(instance)
            return Response(serializer.data)
        else:
            return Response({'error': 'You don\'t have the permission'})


class ReservationHostUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsReservationHost]
    authentication_classes = [JWTAuthentication]

    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        obj = self.get_object()
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        status_keyword = self.request.query_params.get('status', None)
        if status_keyword == 'approve':
            instance = self.get_object()
            instance.status = Reservation.APPROVED
            instance.save()

            serializer = self.serializer_class(instance)
            return Response(serializer.data)
        elif status_keyword == 'deny':
            instance = self.get_object()
            instance.status = Reservation.DENIED
            instance.save()

            serializer = self.serializer_class(instance)
            return Response(serializer.data)
        elif status_keyword == 'terminate':
            instance = self.get_object()
            instance.status = Reservation.TERMINATED
            instance.save()

            serializer = self.serializer_class(instance)
            return Response(serializer.data)
        else:
            return Response({'error': 'You don\'t have the permission'})