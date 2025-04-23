from django.db import models
from django.contrib.auth.models import User

class Artist(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True, null=True)
    image_url = models.URLField(blank=True)
    
    def __str__(self):
        return self.name

class Album(models.Model):
    title = models.CharField(max_length=100)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='albums')
    cover_image_url = models.URLField(blank=True)
    release_date = models.DateField()
    
    def __str__(self):
        return f"{self.title} - {self.artist.name}"

class Track(models.Model):
    title = models.CharField(max_length=100)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='tracks')
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='tracks')
    audio_file = models.URLField()  # URL to audio file
    duration = models.DurationField()
    track_number = models.IntegerField()
    
    def __str__(self):
        return f"{self.title} - {self.artist.name}"

class PlaylistManager(models.Manager):
    def get_user_playlists(self, user):
        return self.filter(user=user)
    
    def create_playlist(self, user, title, description=''):
        playlist = self.create(user=user, title=title, description=description)
        return playlist

class Playlist(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playlists')
    tracks = models.ManyToManyField(Track, related_name='playlists', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = PlaylistManager()
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    def add_track(self, track):
        self.tracks.add(track)
        
    def remove_track(self, track):
        self.tracks.remove(track)