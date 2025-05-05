from django.db import models
from django.contrib.auth.models import User


class CollectionItem(models.Model):
        TYPE_CHOICES = [
            ("book", "Book"),
            ("movie", "Movie"),
        ]
        user = models.ForeignKey(User, on_delete=models.CASCADE)
        item_id = models.CharField(max_length=20)
        title = models.CharField(max_length=255)
        thumbnail = models.CharField()
        rating = models.FloatField(blank=True, null=True)
        type = models.CharField(choices=TYPE_CHOICES)
        collection = models.CharField(max_length=20)
        created_at = models.DateTimeField(auto_now_add=True)

        class Meta:
            unique_together = ('user', 'collection', 'item_id')
            ordering = ['-created_at']
