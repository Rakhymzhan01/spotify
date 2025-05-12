from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Artist, Album, Track, Playlist


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class TrackDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=100)
    artist_name = serializers.SerializerMethodField()
    album_title = serializers.SerializerMethodField()
    duration = serializers.DurationField()
    audio_file = serializers.URLField()
    
    def get_artist_name(self, obj):
        return obj.artist.name
    
    def get_album_title(self, obj):
        return obj.album.title

# ModelSerializers
class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'

class AlbumSerializer(serializers.ModelSerializer):
    artist_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'artist_name', 'cover_image_url', 'release_date']
    
    def get_artist_name(self, obj):
        return obj.artist.name

class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ['id', 'title', 'artist', 'album', 'audio_file', 'duration', 'track_number']

class PlaylistSerializer(serializers.ModelSerializer):
    tracks_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Playlist
        fields = ['id', 'title', 'description', 'user', 'tracks_count', 'created_at', 'updated_at']
        read_only_fields = ['user']
    
    description = serializers.CharField(allow_null=True, required=False)
    
    def get_tracks_count(self, obj):
        return obj.tracks.count()

class PlaylistDetailSerializer(serializers.ModelSerializer):
    tracks = TrackSerializer(many=True, read_only=True)
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = Playlist
        fields = ['id', 'title', 'description', 'user', 'username', 'tracks', 'created_at', 'updated_at']
    
    def get_username(self, obj):
        return obj.user.username