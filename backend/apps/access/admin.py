from django.contrib import admin
from .models import AccessToken

@admin.register(AccessToken)
class AccessTokenAdmin(admin.ModelAdmin):
    list_display = ("token", "user_id", "access_type", "status", "expires_at", "created_at")
    list_filter = ("status", "access_type", "created_at")
    search_fields = ("token", "user_id")
    readonly_fields = ("id", "token", "created_at")
