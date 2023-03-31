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
            'check_in',
            'check_out',
            'last_modified',
            'status'
        ]

        read_only_fields = ['last_modified']

    def validate(self, data):
        check_in = data.get('check_in')
        check_out = data.get('check_out')
        today = date.today()
        if check_in > check_out or check_in < today:
            raise serializers.ValidationError({'check_in': 'Start date cannot be in the past.'})
        return super().validate(data)

