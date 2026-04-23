import uuid
from django.db import models


class Transaction(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("failed", "Failed"),
    ]

    PRODUCT_CHOICES = [
        ("subscription_weekly", "Weekly Subscription"),
        ("subscription_monthly", "Monthly Subscription"),
        ("subscription_vip", "VIP Subscription"),
        ("token_one_time", "One Time Access"),
        ("token_daily", "Daily Access"),
        ("token_weekly", "Weekly Token"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # supabase user id (nullable for guest payments)
    user_id = models.CharField(max_length=255, blank=True, null=True)
    provider = models.CharField(max_length=50, default="nowpayments")
    currency = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=12, decimal_places=6)
    tx_hash = models.CharField(max_length=255, unique=True, blank=True, null=True)
    nowpayments_id = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    product_id = models.CharField(max_length=50, choices=PRODUCT_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.product_id} - {self.status} ({self.currency})"
