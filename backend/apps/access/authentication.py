import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


class SupabaseUser:
    """Minimal user object built from Supabase JWT claims"""

    def __init__(self, payload):
        self.supabase_id = payload.get("sub")
        self.email = payload.get("email", "")
        self.role = payload.get("role", "authenticated")
        self.is_authenticated = True
        self.is_anonymous = False

    def __str__(self):
        return self.email


class SupabaseJWTAuthentication(BaseAuthentication):
    """
    Validates Supabase JWT tokens sent as:
    Authorization: Bearer <token>
    """

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return None  # No token — anonymous request

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired.")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token.")

        user = SupabaseUser(payload)
        return (user, token)

    def authenticate_header(self, request):
        return "Bearer"
