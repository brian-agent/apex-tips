from rest_framework import serializers
from .models import AccessToken


class AccessTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessToken
        fields = ["token", "access_type", "expires_at", "status"]
