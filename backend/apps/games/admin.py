from django.contrib import admin
from .models import Game

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ("home_team", "away_team", "status", "is_premium", "created_at")
    list_filter = ("status", "is_premium", "league", "created_at")
    search_fields = ("home_team", "away_team", "league")
    ordering = ("-created_at",)
