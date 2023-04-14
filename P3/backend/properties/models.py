from django.db import models
from accounts.models import User
from django.core.validators import MinLengthValidator
# Create your models here.

class Property(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    property_name = models.CharField(max_length=120, blank=False, null=False)
    country = models.CharField(max_length=120, blank=False, null=False)
    city = models.CharField(max_length=120, blank=False, null=False)
    detailed_address = models.CharField(max_length=120, blank=False, null=False)
    zip_postcode = models.CharField(max_length=10, )
    phone_number = models.CharField(max_length=20, blank=True, null=True, validators=[MinLengthValidator(8)])
    email = models.EmailField(blank=True, null=True, error_messages={'invalid': 'Enter a valid email address'})

    property_type = models.CharField(max_length=128, blank=False, null=False)
    bedrooms = models.PositiveIntegerField(blank=False, null=False)
    washrooms = models.PositiveIntegerField(blank=False, null=False)
    livingrooms = models.PositiveIntegerField(blank=False, null=False)
    guests = models.PositiveIntegerField(blank=False, null=False)
    place_type = models.CharField(max_length=120, blank=True, null=True)
    property_description = models.TextField(blank=True, null=True)
    last_modified = models.DateTimeField(auto_now=True)

    swimpool = models.BooleanField('pool', default=False)
    wifi = models.BooleanField('wifi', default=False)
    tv = models.BooleanField('tv', default=False)
    gym = models.BooleanField('gym', default=False)
    fire_extinguisher = models.BooleanField('fire extinguisher', default=False)
    aircondition = models.BooleanField('air Condition', default=False)
    parking = models.BooleanField('parking', default=False)
    bathtub = models.BooleanField('bathtub', default=False)

    status = models.BooleanField('status', default=True)
    price = models.FloatField(default=100)

    image1 = models.ImageField(upload_to='property_image/', blank=True, null=True)
    image2 = models.ImageField(upload_to='property_image/', blank=True, null=True)
    image3 = models.ImageField(upload_to='property_image/', blank=True, null=True)
    # image4 = models.ImageField(upload_to='property_image/', blank=True, null=True)
    # image5 = models.ImageField(upload_to='property_image/', blank=True, null=True)
    # image6 = models.ImageField(upload_to='property_image/', blank=True, null=True)
    # image7 = models.ImageField(upload_to='property_image/', blank=True, null=True)
    # image8 = models.ImageField(upload_to='property_image/', blank=True, null=True)

class Pricetag(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    start_date = models.DateField(blank=False, null=False)
    end_date = models.DateField(blank=False, null=False)
    price = models.FloatField(blank=False, null=False, default=100)
   

