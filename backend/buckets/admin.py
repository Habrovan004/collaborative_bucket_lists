from django.contrib import admin
from .models import Bucket

@admin.register(Bucket)
class BucketAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'status', 'is_completed', 'upvotes_count', 'created_at')
    list_filter = ('is_completed', 'created_at')
    search_fields = ('title', 'owner__username')