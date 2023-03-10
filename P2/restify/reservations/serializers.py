from .models import Reservation
from rest_framework import serializers
from datetime import date, datetime
from properties.models import Property
from django.shortcuts import render, get_object_or_404


class ReservationSerializer(serializers.ModelSerializer):
    reserve_guest = serializers.ReadOnlyField(source='reserve_guest.username')
    reserve_property = serializers.ReadOnlyField(source='reserve_property.property_name')
    reserve_host = serializers.ReadOnlyField(source='reserve_property.owner.id')

    class Meta:
        model = Reservation
        fields = [
            'id',
            'reserve_guest',
            'reserve_host',
            'reserve_property',
            'start_date',
            'end_date',
            'last_modified',
            'status'
        ]

        read_only_fields = ['last_modified']

    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        today = date.today()
        if start_date > end_date or start_date < today:
            raise serializers.ValidationError({'start_date': 'Start date cannot be in the past.'})
        return super().validate(data)

