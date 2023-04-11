from rest_framework import serializers
from .models import PropertyComment, UserComment

# class PropertyComment(models.Model):
#     # the comment 
#     text = models.TextField()
#     # the property that the comment is created for 
#     property = models.ForeignKey('Property')
#     # if null then this is a comment 
#     # if set then this is a reply 
#     parent_comment = models.ForeignKey('Comment', null=True, blank=True)

    
# class UserComment(models.Model):
#     # the user that the comment is directed to 
#     user = models.ForeignKey(User)
#     # the host that created the comment
#     host = models.ForeignKey(User)
#     # the comment 
#     text = models.TextField()
    
class UserNameField(serializers.StringRelatedField):
    # Use StringRelatedField instead of RelatedField
    # to automatically represent the related object as a string
    # In this case, it will return the user's username as a string
    # without requiring a queryset
        
    class Meta:
        model = 'User'
        # fields = ['pk']
        # fields = ['first_name']
    
class PropertyCommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()  # Use SerializerMethodField to define custom serialization for user field
    
    def get_user(self, obj):
        # Return only the user's name when performing a GET request
        if self.context['request'].method == 'GET':
            return self.context['request'].user.first_name
        else:
            return self.context['request'].user.first_name  # Return user's primary key for other HTTP methods
        
    class Meta:
        model = PropertyComment
        fields = ["text", "property", "parent_comment", "user", "id"]
        extra_kwargs = {
            'property': {'required': False, 'allow_null': True},
            'parent_comment': {'required': False, 'allow_null': True},
            'user': {'required': False, 'allow_null': True}
        }

class UserCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserComment
        fields = ["text", "host", "user"]
        