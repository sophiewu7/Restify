from .models import Reservation
from rest_framework import serializers
from datetime import date, datetime
from properties.models import Property
from django.shortcuts import render, get_object_or_404


class ReservationSerializer(serializers.ModelSerializer):
    reserve_guest = serializers.ReadOnlyField(source='reserve_guest.username')
    reserve_guest_id = serializers.ReadOnlyField(source='reserve_guest.id')
    reserve_guest_firstname = serializers.ReadOnlyField(source='reserve_guest.first_name')
    reserve_guest_lastname = serializers.ReadOnlyField(source='reserve_guest.last_name')
    reserve_property = serializers.ReadOnlyField(source='reserve_property.property_name')
    reserve_host = serializers.ReadOnlyField(source='reserve_property.owner.id')
    reserve_host_firstname = serializers.ReadOnlyField(source='reserve_property.owner.first_name')
    reserve_host_lastname = serializers.ReadOnlyField(source='reserve_property.owner.last_name')
    city = serializers.ReadOnlyField(source='reserve_property.city')
    country = serializers.ReadOnlyField(source='reserve_property.country')
    current_user = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = [
            'id',
            'reserve_guest',
            'reserve_guest_id',
            'reserve_guest_firstname',
            'reserve_guest_lastname',
            'reserve_host',
            'reserve_host_firstname',
            'reserve_host_lastname',
            'reserve_property',
            'city',
            'country',
            'check_in',
            'check_out',
            'last_modified',
            'status',
            'current_user',
        ]

        read_only_fields = ['last_modified']

    def get_current_user(self, obj):
        return self.context['request'].user.id

    def validate(self, data):
        check_in = data.get('check_in')
        check_out = data.get('check_out')
        today = date.today()
        if check_in > check_out or check_in < today:
            raise serializers.ValidationError({'check_in': 'Start date cannot be in the past.'})
        return super().validate(data)

