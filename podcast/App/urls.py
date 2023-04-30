from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('podcast', views.podcast, name='podcast'),
    path('getSongData', views.getSongData, name='getSongData'),
]
