from django.urls import path
from .views import (
    bucket_list_create,
    bucket_detail,
    toggle_complete,
    upvote_bucket,
)

urlpatterns = [
    path('buckets/', bucket_list_create, name='bucket-list-create'),
    path('buckets/<int:pk>/', bucket_detail, name='bucket-detail'),
    path('buckets/<int:pk>/toggle-complete/', toggle_complete, name='toggle-complete'),
    path('buckets/<int:pk>/upvote/', upvote_bucket, name='upvote'),
]

