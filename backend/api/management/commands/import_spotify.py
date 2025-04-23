from django.core.management.base import BaseCommand
from api.models import Artist, Album, Track
from api.spotify_service import SpotifyService
from django.utils import timezone
import datetime

class Command(BaseCommand):
    help = 'Import data from Spotify API'

    def add_arguments(self, parser):
        parser.add_argument('--artist', type=str, help='Artist to search for')

    def handle(self, *args, **kwargs):
        artist_query = kwargs.get('artist', 'The Beatles')
        self.stdout.write(f'Searching Spotify for artist: {artist_query}')
        
        spotify = SpotifyService()
        
        # Search for artist
        artists = spotify.search_artists(artist_query, limit=1)
        if not artists:
            self.stdout.write(self.style.ERROR(f'No artists found for query: {artist_query}'))
            return
        
        spotify_artist = artists[0]
        
        # Create or update artist
        artist, created = Artist.objects.update_or_create(
            name=spotify_artist['name'],
            defaults={
                'bio': f"Artist imported from Spotify, genres: {', '.join(spotify_artist.get('genres', []))}",
                'image_url': spotify_artist.get('images', [{}])[0].get('url', '') if spotify_artist.get('images') else ''
            }
        )
        
        status = 'Created' if created else 'Updated'
        self.stdout.write(f'{status} artist: {artist.name}')
        
        # Get albums for this artist
        albums = spotify.get_artist_albums(spotify_artist['id'], limit=5)
        
        for spotify_album in albums:
            # Get full album info
            album_detail = spotify.get_album(spotify_album['id'])
            
            # Create or update album
            album, created = Album.objects.update_or_create(
                title=album_detail['name'],
                artist=artist,
                defaults={
                    'cover_image_url': album_detail.get('images', [{}])[0].get('url', '') if album_detail.get('images') else '',
                    'release_date': datetime.datetime.strptime(
                        album_detail.get('release_date', '1970-01-01'), 
                        '%Y-%m-%d' if len(album_detail.get('release_date', '1970-01-01')) == 10 else '%Y'
                    ).date()
                }
            )
            
            status = 'Created' if created else 'Updated'
            self.stdout.write(f'{status} album: {album.title}')
            
            # Get tracks for this album
            tracks = spotify.get_album_tracks(album_detail['id'])
            
            for i, spotify_track in enumerate(tracks, 1):
                track_detail = spotify.get_track(spotify_track['id'])
                
                # Duration from milliseconds to timedelta
                duration = spotify.format_duration(track_detail.get('duration_ms', 0))
                
                # Create or update track
                track, created = Track.objects.update_or_create(
                    title=track_detail['name'],
                    album=album,
                    artist=artist,
                    defaults={
                        'audio_file': track_detail.get('preview_url', '') or '',  # Handle None values
                        'duration': duration,
                        'track_number': i
                    }
                )
                
                status = 'Created' if created else 'Updated'
                self.stdout.write(f'{status} track: {track.title}')
        
        self.stdout.write(self.style.SUCCESS('Successfully imported data from Spotify!'))