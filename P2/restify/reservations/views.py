from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status, filters
from .models import Reservation
from .serializers import ReservationSerializer
from properties.models import Property
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.decorators import api_view

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
        check_in = serializer.validated_data.get('check_in')
        check_out = serializer.validated_data.get('check_out')

        reserved_property_ids = Reservation.objects.filter(
                                Q(status=Reservation.APPROVED) &
                                Q(check_in__lt=check_out, check_out__gt=check_in)
                               ).values_list('reserve_property_id')
        

        if property_id in [t[0] for t in reserved_property_ids]:
            return Response({'error': 'Cannot book, this property is already booked'})

        
        serializer.is_valid(raise_exception=True)
        if reserve_property.status is False:
            return Response({'error': 'Cannot book, this property is currently unavailable.'})
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

class ReservationCancelListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_queryset(self):
        return Reservation.objects.filter(Q(reserve_host=self.request.user.id, status=Reservation.CANCELED)|
                                            Q(reserve_guest=self.request.user.id, status=Reservation.CANCELED) )

class ReservationApproveListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_queryset(self):
        return Reservation.objects.filter(Q(reserve_host=self.request.user.id, status=Reservation.APPROVED)|
                                            Q(reserve_guest=self.request.user.id, status=Reservation.APPROVED) )


class ReservationDenyListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_queryset(self):
        return Reservation.objects.filter(Q(reserve_host=self.request.user.id, status=Reservation.DENIED)|
                                            Q(reserve_guest=self.request.user.id, status=Reservation.DENIED) )



class ReservationPendingListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_queryset(self):
        return Reservation.objects.filter(Q(reserve_host=self.request.user.id, status=Reservation.PENDING)|
                                            Q(reserve_guest=self.request.user.id, status=Reservation.PENDING) )

class ReservationTerminatedListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_queryset(self):
        return Reservation.objects.filter(Q(reserve_host=self.request.user.id, status=Reservation.TERMINATED)|
                                            Q(reserve_guest=self.request.user.id, status=Reservation.TERMINATED) )

class ReservationCompletedListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_queryset(self):
        return Reservation.objects.filter(Q(reserve_host=self.request.user.id, status=Reservation.COMPLETED)|
                                            Q(reserve_guest=self.request.user.id, status=Reservation.COMPLETED) )

class ReservationExpiredListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_queryset(self):
        return Reservation.objects.filter(Q(reserve_host=self.request.user.id, status=Reservation.EXPIRED)|
                                            Q(reserve_guest=self.request.user.id, status=Reservation.EXPIRED) )

class ReservationPendingcancelListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_queryset(self):
        return Reservation.objects.filter(Q(reserve_host=self.request.user.id, status=Reservation.PENDING_CANCELED)|
                                            Q(reserve_guest=self.request.user.id, status=Reservation.PENDING_CANCELED) )


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
            instance.status = Reservation.PENDING_CANCELED
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

    def put(self, request, *args, **kwargs):
        return Response({'error': 'You should use PATCH'})

    def get(self, request, *args, **kwargs):
        obj = self.get_object()
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        status_keyword = self.request.query_params.get('status', None)
        if status_keyword == 'approve':
            instance = self.get_object()
            if instance.status != Reservation.PENDING and instance.status != Reservation.PENDING_CANCELED:
                return Response({'error': 'You can only approve an pending reservation'})
            instance.status = Reservation.APPROVED
            instance.save()

            serializer = self.serializer_class(instance)
            return Response(serializer.data)
        elif status_keyword == 'deny':
            instance = self.get_object()
            if instance.status != Reservation.PENDING and instance.status != Reservation.PENDING_CANCELED:
                return Response({'error': 'You can only deny an pending reservation'})
            instance.status = Reservation.DENIED
            instance.save()

            serializer = self.serializer_class(instance)
            return Response(serializer.data)
        elif status_keyword == 'terminate':
            instance = self.get_object()
            if instance.status != Reservation.APPROVED:
                return Response({'error': 'You can only terminate an approved reservation'})
            
            instance.status = Reservation.TERMINATED
            instance.save()

            serializer = self.serializer_class(instance)
            return Response(serializer.data)
        else:
            return Response({'error': 'You don\'t have the permission'})