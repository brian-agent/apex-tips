import uuid
from django.db import models


class AccessToken(models.Model):
    ACCESS_TYPE_CHOICES = [
        ("one_time", "One Time"),
        ("daily", "Daily"),
        ("weekly", "Weekly"),
    ]

    STATUS_CHOICES = [
        ("active", "Active"),
        ("expired", "Expired"),
        ("revoked", "Revoked"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    token = models.CharField(max_length=255, unique=True)
    # supabase user id (nullable for guest users)
    user_id = models.CharField(max_length=255, blank=True, null=True)
    transaction = models.ForeignKey(
        "payments.Transaction",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="access_tokens",
    )
    access_type = models.CharField(max_length=20, choices=ACCESS_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"{self.token[:12]}... ({self.access_type})"
