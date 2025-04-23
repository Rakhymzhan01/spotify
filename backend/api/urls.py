from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Authentication endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.UserRegisterView.as_view(), name='register'),
    
    # Artists
    path('artists/', views.get_artists, name='artists'),
    path('artists/<int:pk>/', views.get_artist_detail, name='artist-detail'),
    
    # Albums
    path('albums/', views.get_albums, name='albums'),
    path('albums/<int:pk>/', views.get_album_detail, name='album-detail'),
    
    # Playlists
    path('playlists/', views.PlaylistView.as_view(), name='playlists'),
    path('playlists/<int:pk>/', views.PlaylistDetailView.as_view(), name='playlist-detail'),
    path('playlists/<int:playlist_id>/tracks/', views.AddTrackToPlaylistView.as_view(), name='playlist-tracks'),
]