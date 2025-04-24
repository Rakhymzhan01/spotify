from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User

from .models import Artist, Album, Track, Playlist
from .serializers import (
    UserSerializer, ArtistSerializer, AlbumSerializer, 
    TrackSerializer, TrackDetailSerializer, 
    PlaylistSerializer, PlaylistDetailSerializer
)

# Function-Based Views (FBV)
@api_view(['GET'])
def get_artists(request):
    artists = Artist.objects.all()
    serializer = ArtistSerializer(artists, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_artist_detail(request, pk):
    try:
        artist = Artist.objects.get(pk=pk)
    except Artist.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = ArtistSerializer(artist)
    return Response(serializer.data)

@api_view(['GET'])
def get_albums(request):
    albums = Album.objects.all()
    serializer = AlbumSerializer(albums, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_album_detail(request, pk):
    try:
        album = Album.objects.get(pk=pk)
    except Album.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = AlbumSerializer(album)
    tracks = Track.objects.filter(album=album)
    track_serializer = TrackSerializer(tracks, many=True)
    
    return Response({
        'album': serializer.data,
        'tracks': track_serializer.data
    })

# Class-Based Views (CBV)
class PlaylistView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        playlists = Playlist.objects.get_user_playlists(request.user)
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        print("Incoming data:", request.data)  # Debug what's being received
        serializer = PlaylistSerializer(data=request.data)
        print("Serializer initial data:", serializer.initial_data)  # Debug
        
        if serializer.is_valid():
            print("Valid data:", serializer.validated_data)  # Debug
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        
        print("Serializer errors:", serializer.errors)  # Critical for debugging
        return Response(serializer.errors, status=400)

class PlaylistDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk, user):
        try:
            return Playlist.objects.get(pk=pk, user=user)
        except Playlist.DoesNotExist:
            return None
    
    def get(self, request, pk):
        playlist = self.get_object(pk, request.user)
        if playlist is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = PlaylistDetailSerializer(playlist)
        return Response(serializer.data)
    
    def put(self, request, pk):
        playlist = self.get_object(pk, request.user)
        if playlist is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = PlaylistSerializer(playlist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        playlist = self.get_object(pk, request.user)
        if playlist is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        playlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserRegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"username": user.username, "email": user.email}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddTrackToPlaylistView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, playlist_id):
        try:
            playlist = Playlist.objects.get(id=playlist_id, user=request.user)
        except Playlist.DoesNotExist:
            return Response({"detail": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND)
        
        track_id = request.data.get('track_id')
        try:
            track = Track.objects.get(id=track_id)
        except Track.DoesNotExist:
            return Response({"detail": "Track not found"}, status=status.HTTP_404_NOT_FOUND)
        
        playlist.tracks.add(track)
        return Response({"detail": "Track added to playlist"}, status=status.HTTP_200_OK)
    
    def delete(self, request, playlist_id):
        try:
            playlist = Playlist.objects.get(id=playlist_id, user=request.user)
        except Playlist.DoesNotExist:
            return Response({"detail": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND)
        
        track_id = request.data.get('track_id')
        try:
            track = Track.objects.get(id=track_id)
        except Track.DoesNotExist:
            return Response({"detail": "Track not found"}, status=status.HTTP_404_NOT_FOUND)
        
        playlist.tracks.remove(track)
        return Response({"detail": "Track removed from playlist"}, status=status.HTTP_200_OK)