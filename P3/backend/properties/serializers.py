
from .models import Property, Pricetag
from rest_framework import serializers
from datetime import date, datetime


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
            'wifi',
            'tv',
            'gym',
            'fire_extinguisher',
            'aircondition',
            'parking',
            'bathtub',
            'status',
            'price',
            'image1',
            'image2',
            'image3',
            'image4',
            'image5',
            'image6',
            'image7',
            'image8'
        ]
        read_only_fields = ['last_modified']

    def validate(self, data):
        price = data.get('price')
        if price and price < 0:
            raise serializers.ValidationError({'price': 'Price cannot negative.'})
        return super().validate(data)


class PricetagSerializer(serializers.ModelSerializer):
    property_id = serializers.ReadOnlyField(source='property.id')
    class Meta:
        model = Pricetag
        fields = [
            'id',
            'start_date',
            'end_date',
            'price',
            'property_id'
        ]


class SearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'property_name',
            'city',
            'country',
            'guests',
            'bedrooms',
            'washrooms',
            'swimpool',
            'wifi',
            'tv',
            'gym',
            'fire_extinguisher',
            'aircondition',
            'parking',
            'bathtub',
            'price',
            'image1',
            'property_description',
        ]
