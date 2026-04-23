from django.contrib import admin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ("user_id", "plan", "status", "start_date", "end_date")
    list_filter = ("status", "plan", "start_date")
    search_fields = ("user_id",)
    readonly_fields = ("created_at", "start_date")
