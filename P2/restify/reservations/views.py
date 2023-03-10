from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
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