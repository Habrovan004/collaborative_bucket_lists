from django.urls import path
from .views import (
    bucket_list_create,
    bucket_detail,
    toggle_complete,
    upvote_bucket,
    bucket_comments,
    delete_comment

)

urlpatterns = [
    path('buckets/', bucket_list_create, name='bucket-list-create'),
    path('buckets/<int:pk>/', bucket_detail, name='bucket-detail'),
    path('buckets/<int:pk>/toggle-complete/', toggle_complete, name='toggle-complete'),
    path('buckets/<int:pk>/upvote/', upvote_bucket, name='upvote'),
    path('buckets/<int:pk>/comments/', bucket_comments, name='bucket-comments'),
    path('comments/<int:comment_id>/delete/', delete_comment, name='delete-comment'),

]

