import json
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Transaction
from .services import create_nowpayments_invoice, verify_webhook_signature
from apps.subscriptions.services import create_subscription
from apps.access.services import generate_access_token


class CreatePaymentView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        product_id = request.data.get("product_id")
        currency = request.data.get("currency", "BTC")
        user_id = getattr(request.user, "supabase_id", None)

        if not product_id:
            return Response({"error": "product_id is required"}, status=400)

        try:
            invoice = create_nowpayments_invoice(
                product_id=product_id,
                currency=currency,
                user_id=user_id,
            )
            return Response(invoice, status=201)
        except ValueError as e:
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            return Response({"error": "Payment gateway error."}, status=502)


@method_decorator(csrf_exempt, name="dispatch")
class WebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        sig = request.headers.get("x-nowpayments-sig", "")
        body = request.body

        if not verify_webhook_signature(body, sig):
            return Response({"error": "Invalid signature"}, status=400)

        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON"}, status=400)

        payment_status = payload.get("payment_status")
        order_id = payload.get("order_id")
        tx_hash = payload.get("outcome_hash", "")

        if not order_id:
            return Response({"error": "Missing order_id"}, status=400)

        try:
            transaction = Transaction.objects.get(id=order_id)
        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=404)

        # Only process confirmed payments
        if payment_status == "finished":
            transaction.status = "confirmed"
            transaction.tx_hash = tx_hash or None
            transaction.confirmed_at = timezone.now()
            transaction.save()

            # Route to correct fulfillment
            product_id = transaction.product_id

            if product_id.startswith("subscription_"):
                plan = product_id.replace("subscription_", "")
                create_subscription(transaction=transaction, plan=plan)

            elif product_id.startswith("token_"):
                access_type = product_id.replace("token_", "")
                generate_access_token(
                    transaction=transaction,
                    user_id=transaction.user_id,
                    access_type=access_type,
                )

        elif payment_status in ("failed", "expired", "refunded"):
            transaction.status = "failed"
            transaction.save(update_fields=["status"])

        return Response({"status": "ok"})
