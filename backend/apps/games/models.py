import uuid
from django.db import models


class Game(models.Model):
    STATUS_CHOICES = [
        ("upcoming", "Upcoming"),
        ("live", "Live"),
        ("finished", "Finished"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    home_team = models.CharField(max_length=100)
    away_team = models.CharField(max_length=100)
    league = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    match_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="upcoming")
    home_score = models.IntegerField(default=0)
    away_score = models.IntegerField(default=0)
    prediction = models.TextField(blank=True, null=True)
    confidence = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    odds = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    analysis = models.TextField(blank=True, null=True)
    tip_category = models.CharField(max_length=100, blank=True, null=True)
    is_premium = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-match_date"]

    def __str__(self):
        return f"{self.home_team} vs {self.away_team}"
