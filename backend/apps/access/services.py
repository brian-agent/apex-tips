import secrets
from datetime import timedelta
from django.utils import timezone
from .models import AccessToken


def verify_access(user_id=None, token=None) -> bool:
    """
    Core access gate. Returns True if user has valid access via:
    - Active subscription (checks subscriptions table)
    - Valid access token (checks access_tokens table)

    Either user_id or token must be provided.
    """

    if user_id:
        if _check_subscription(user_id):
            return True
        if _check_user_token(user_id):
            return True

    if token:
        if _check_token(token):
            return True

    return False


def _check_subscription(user_id: str) -> bool:
    """Check if user has an active, non-expired subscription"""
    from apps.subscriptions.models import Subscription

    return Subscription.objects.filter(
        user_id=user_id,
        status="active",
        end_date__gt=timezone.now(),
    ).exists()


def _check_user_token(user_id: str) -> bool:
    """Check if user has a valid access token"""
    return AccessToken.objects.filter(
        user_id=user_id,
        status="active",
        expires_at__gt=timezone.now(),
    ).exists()


def _check_token(token: str) -> bool:
    """Check a raw token string (guest users)"""
    return AccessToken.objects.filter(
        token=token,
        status="active",
        expires_at__gt=timezone.now(),
    ).exists()


def generate_access_token(
    transaction,
    user_id=None,
    access_type="one_time",
) -> AccessToken:
    """
    Generate a new access token after payment confirmation.
    access_type options: one_time | daily | weekly
    """

    expiry_map = {
        "one_time": timedelta(hours=24),
        "daily": timedelta(days=1),
        "weekly": timedelta(weeks=1),
    }

    token_str = secrets.token_urlsafe(32)
    expires_at = timezone.now() + expiry_map.get(access_type, timedelta(hours=24))

    access_token = AccessToken.objects.create(
        token=token_str,
        user_id=user_id,
        transaction=transaction,
        access_type=access_type,
        expires_at=expires_at,
    )

    return access_token
