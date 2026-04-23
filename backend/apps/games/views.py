from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Game
from .serializers import GameSerializer, GamePublicSerializer
from apps.access.services import verify_access


class GameListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        games = Game.objects.all()

        # Check access: JWT user or token query param
        user_id = getattr(request.user, "supabase_id", None)
        token = request.query_params.get("token", None)

        has_access = verify_access(user_id=user_id, token=token)

        if has_access:
            serializer = GameSerializer(games, many=True)
        else:
            # Only free games, no premium fields
            free_games = games.filter(is_premium=False)
            serializer = GamePublicSerializer(free_games, many=True)

        return Response(serializer.data)


class GameDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            game = Game.objects.get(pk=pk)
        except Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=404)

        user_id = getattr(request.user, "supabase_id", None)
        token = request.query_params.get("token", None)
        has_access = verify_access(user_id=user_id, token=token)

        if game.is_premium and not has_access:
            return Response({"error": "Premium content. Subscribe to access."}, status=403)

        return Response(GameSerializer(game).data)
