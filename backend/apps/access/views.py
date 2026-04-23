from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .services import verify_access


class VerifyAccessView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = getattr(request.user, "supabase_id", None)
        token = request.query_params.get("token", None)

        has_access = verify_access(user_id=user_id, token=token)

        return Response({
            "has_access": has_access,
            "user_id": user_id,
        })
