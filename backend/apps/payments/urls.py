from django.urls import path
from .views import CreatePaymentView, WebhookView

urlpatterns = [
    path("create/", CreatePaymentView.as_view(), name="create-payment"),
    path("webhook/", WebhookView.as_view(), name="payment-webhook"),
]
