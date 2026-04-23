from django.urls import path
from .views import GameListView, GameDetailView

urlpatterns = [
    path("", GameListView.as_view(), name="game-list"),
    path("<uuid:pk>/", GameDetailView.as_view(), name="game-detail"),
]
