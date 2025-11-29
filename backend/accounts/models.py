# accounts/models.py
from django.db import models
from django.contrib.auth.models import User
from buckets.models import Bucket

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    location = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)

    def total_buckets(self):
        return self.user.buckets.count()  # related_name='buckets' in Bucket

    def completed_buckets(self):
        return self.user.buckets.filter(is_completed=True).count()

    def active_buckets(self):
        return self.user.buckets.filter(is_completed=False).count()

    def __str__(self):
        return f"{self.user.username}'s Profile"
