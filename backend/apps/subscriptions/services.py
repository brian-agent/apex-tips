from datetime import timedelta
from django.utils import timezone
from .models import Subscription


PLAN_DURATIONS = {
    "weekly": timedelta(weeks=1),
    "monthly": timedelta(days=30),
    "vip": timedelta(days=90),
}


def create_subscription(transaction, plan: str) -> Subscription:
    """
    Called by webhook after payment confirmed.
    Creates or renews a subscription for the user.
    """
    user_id = transaction.user_id

    if not user_id:
        raise ValueError("Subscriptions require a logged-in user.")

    duration = PLAN_DURATIONS.get(plan)
    if not duration:
        raise ValueError(f"Unknown plan: {plan}")

    # If user already has active subscription, extend it
    existing = Subscription.objects.filter(
        user_id=user_id,
        status="active",
        end_date__gt=timezone.now(),
    ).first()

    if existing:
        existing.end_date += duration
        existing.transaction = transaction
        existing.save(update_fields=["end_date", "transaction"])
        return existing

    # Otherwise create fresh subscription
    subscription = Subscription.objects.create(
        user_id=user_id,
        plan=plan,
        status="active",
        end_date=timezone.now() + duration,
        transaction=transaction,
    )

    return subscription


def expire_subscriptions():
    """
    Mark expired subscriptions. Call this via a cron job or
    management command periodically.
    """
    Subscription.objects.filter(
        status="active",
        end_date__lte=timezone.now(),
    ).update(status="expired")
