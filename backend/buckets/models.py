from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Bucket(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='buckets/media', blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='buckets')
    is_completed = models.BooleanField(default=False)
    upvotes = models.ManyToManyField(User, related_name='upvoted_buckets', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def status(self):
        return "completed" if self.is_completed else "active"

    @property
    def upvotes_count(self):
        return self.upvotes.count()