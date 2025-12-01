from rest_framework import serializers
from .models import Bucket,Comment



class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at']
        read_only_fields = ['user', 'created_at']



class BucketSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    status = serializers.CharField(read_only=True)
    upvotes_count = serializers.IntegerField(read_only=True)
    is_owner = serializers.SerializerMethodField()
    has_upvoted = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)


    class Meta:
        model = Bucket
        fields = [
            'id', 'title', 'description', 'image',
            'is_completed', 'status', 'upvotes_count',
            'owner', 'is_owner', 'has_upvoted',
            'created_at', 'updated_at','comments'
        ]
        read_only_fields = ['owner', 'status', 'upvotes_count']

    def get_is_owner(self, obj):
        request = self.context.get('request')
        return request.user == obj.owner if request and request.user.is_authenticated else False

    def get_has_upvoted(self, obj):
        request = self.context.get('request')
        return request.user in obj.upvotes.all() if request and request.user.is_authenticated else False
    

