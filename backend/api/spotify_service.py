import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from django.conf import settings
from datetime import timedelta

class SpotifyService:
    def __init__(self):
        client_credentials_manager = SpotifyClientCredentials(
            client_id=settings.SPOTIFY_CLIENT_ID,
            client_secret=settings.SPOTIFY_CLIENT_SECRET
        )
        self.spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    
    def search_artists(self, query, limit=10):
        results = self.spotify.search(q=query, type='artist', limit=limit)
        return results['artists']['items']
    
    def get_artist(self, artist_id):
        return self.spotify.artist(artist_id)
    
    def get_artist_albums(self, artist_id, limit=10):
        albums = self.spotify.artist_albums(artist_id, album_type='album', limit=limit)
        return albums['items']
    
    def get_album(self, album_id):
        return self.spotify.album(album_id)
    
    def get_album_tracks(self, album_id):
        tracks = self.spotify.album_tracks(album_id)
        return tracks['items']
    
    def get_track(self, track_id):
        return self.spotify.track(track_id)
    
    def format_duration(self, ms):
        seconds = ms // 1000
        return timedelta(seconds=seconds)