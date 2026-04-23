from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "user_id", "product_id", "status", "amount", "created_at")
    list_filter = ("status", "product_id", "created_at")
    search_fields = ("id", "user_id", "nowpayments_id")
    readonly_fields = ("id", "created_at")
