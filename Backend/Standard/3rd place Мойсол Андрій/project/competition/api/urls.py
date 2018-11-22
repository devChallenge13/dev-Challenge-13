from django.urls import path
from .views import TournamentAPIView, ScheduleAPIView, MatchesAPIView, docs

urlpatterns = [
    path('create/', TournamentAPIView.as_view(), name='create-tournament'),
    path('get/<str:tournament_name>/<str:show>/', ScheduleAPIView.as_view(), name='get-tournament'),
    path('get/<str:tournament_name>/', ScheduleAPIView.as_view()),
    path('score/', MatchesAPIView.as_view(), name='save-score'),
    path('docs/', docs)
]
