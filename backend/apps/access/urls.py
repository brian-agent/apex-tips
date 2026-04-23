from django.urls import path
from .views import VerifyAccessView

urlpatterns = [
    path("verify/", VerifyAccessView.as_view(), name="verify-access"),
]
