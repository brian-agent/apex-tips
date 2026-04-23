import hashlib
import hmac
import json
import requests
from django.conf import settings
from django.utils import timezone
from .models import Transaction


PRODUCT_PRICES = {
    "subscription_weekly": 5.00,
    "subscription_monthly": 15.00,
    "subscription_vip": 40.00,
    "token_one_time": 2.00,
    "token_daily": 3.00,
    "token_weekly": 8.00,
}


def create_nowpayments_invoice(product_id: str, currency: str, user_id=None) -> dict:
    """Create a payment invoice via NowPayments API"""

    amount = PRODUCT_PRICES.get(product_id)
    if not amount:
        raise ValueError(f"Unknown product: {product_id}")

    # Create transaction record (pending)
    transaction = Transaction.objects.create(
        user_id=user_id,
        currency=currency,
        amount=amount,
        product_id=product_id,
        status="pending",
    )

    payload = {
        "price_amount": amount,
        "price_currency": "usd",
        "pay_currency": currency.lower(),
        "order_id": str(transaction.id),
        "order_description": product_id,
        "ipn_callback_url": f"{settings.BACKEND_URL}/api/payments/webhook/",
    }

    headers = {
        "x-api-key": settings.NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json",
    }

    response = requests.post(
        f"{settings.NOWPAYMENTS_BASE_URL}/payment",
        json=payload,
        headers=headers,
        timeout=15,
    )
    response.raise_for_status()
    data = response.json()

    # Save nowpayments payment id
    transaction.nowpayments_id = str(data.get("payment_id", ""))
    transaction.save(update_fields=["nowpayments_id"])

    return {
        "transaction_id": str(transaction.id),
        "payment_id": data.get("payment_id"),
        "pay_address": data.get("pay_address"),
        "pay_amount": data.get("pay_amount"),
        "pay_currency": data.get("pay_currency"),
        "status": data.get("payment_status"),
    }


def verify_webhook_signature(request_body: bytes, sig_header: str) -> bool:
    """Verify NowPayments IPN signature"""
    secret = settings.NOWPAYMENTS_IPN_SECRET.encode()
    expected = hmac.new(secret, request_body, hashlib.sha512).hexdigest()
    return hmac.compare_digest(expected, sig_header)
