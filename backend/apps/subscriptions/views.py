from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Subscription
from .serializers import SubscriptionSerializer


class MySubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.supabase_id

        subscription = Subscription.objects.filter(
            user_id=user_id,
            status="active",
            end_date__gt=timezone.now(),
        ).first()

        if not subscription:
            return Response({"active": False, "subscription": None})

        return Response({
            "active": True,
            "subscription": SubscriptionSerializer(subscription).data,
        })
