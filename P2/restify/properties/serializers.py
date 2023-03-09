
from .models import Property, Availability
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
        read_only_fields = ['last_modified']

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

# class SearchSerializer(serializers.Serializer):
#     location = serializers.CharField(max_length=128)
#     check_in = serializers.DateField(format='%Y-%m-%d')
#     check_out = serializers.DateField(format='%Y-%m-%d')
#     guests = serializers.IntegerField(min_value=1, required=False)
#     min_price = serializers.IntegerField(min_value=0, required=False)
#     max_price = serializers.IntegerField(min_value=0, required=False)
#     bedrooms = serializers.IntegerField(min_value=1, required=False)
#     washrooms = serializers.IntegerField(min_value=1, required=False)

#     def validate_check_in(self, value):
#         today = date.today()
#         if value < today:
#             raise serializers.ValidationError("Check-in date cannot be in the past")
#         return value

#     def validate_check_out(self, value):
#         today = date.today()
#         if value < today:
#             raise serializers.ValidationError("Check-out date cannot be in the past")
#         if self.initial_data.get('check_in') and value <= datetime.strptime(self.initial_data['check_in'], "%Y-%m-%d").date():
#             raise serializers.ValidationError("Check-out date must be later than check-in date")
#         return value

#     def validate_max_price(self, value):
#         if 'min_price' in self.initial_data and value < self.initial_data['min_price']:
#             raise serializers.ValidationError("Max price must be greater than min price")
#         return value
