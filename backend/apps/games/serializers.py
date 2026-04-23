from rest_framework import serializers
from .models import Game


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = "__all__"


class GamePublicSerializer(serializers.ModelSerializer):
    """Strips premium fields for non-paying users"""
    class Meta:
        model = Game
        fields = [
            "id", "home_team", "away_team", "league",
            "country", "match_date", "status",
            "home_score", "away_score", "is_premium",
        ]
