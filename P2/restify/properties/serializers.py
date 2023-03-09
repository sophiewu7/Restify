
from .models import Property
from rest_framework import serializers
from .models import Property, Availability

class PropertySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = Property
        fields = [
            'id',
            'owner',
            'property_name',
            'country',
            'city',
            'detailed_address',
            'zip_postcode',
            'phone_number',
            'email',
            'property_type',
            'bedrooms',
            'washrooms',
            'livingrooms',
            'guests',
            'place_type',
            'property_description',
            'last_modified',
            'swimpool',
            'WIFI',
            'TV',
            'Gym',
            'Fire_extinguisher',
            'aircondition',
            'parking',
            'Bathtub',
            'image1',
            'image2',
            'image3',
            'image4',
            'image5',
            'image6',
            'image7',
            'image8'
        ]

class AvailabilitySerializer(serializers.ModelSerializer):
    property_id = serializers.ReadOnlyField(source='property.id')
    class Meta:
        model = Availability
        fields = [
            'id',
            'start_date',
            'end_date',
            'price',
            'property_id'
        ]