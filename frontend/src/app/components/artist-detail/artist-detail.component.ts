import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { AlbumService } from '../../services/album.service';
import { PlayerService } from '../../services/player.service';
import { PlaylistService } from '../../services/playlist.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe
  ]
})
export class ArtistDetailComponent implements OnInit {
  artist: any = null;
  albums: any[] = [];
  albumTracks: {[albumId: number]: any[]} = {}; // Track lists by album ID
  loading = true;
  error = '';
  isAuthenticated$: Observable<boolean>;
  playlists: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private artistService: ArtistService,
    private albumService: AlbumService,
    private playerService: PlayerService,
    private playlistService: PlaylistService,
    private authService: AuthService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    // Load user's playlists if authenticated
    this.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.loadPlaylists();
      }
    });

    this.route.paramMap.subscribe(params => {
      const artistId = Number(params.get('id'));
      if (artistId) {
        this.loadArtistDetails(artistId);
      }
    });
  }

  loadArtistDetails(artistId: number): void {
    this.loading = true;
    this.artistService.getArtist(artistId).subscribe({
      next: (artist) => {
        this.artist = artist;
        
        // Now get albums by this artist
        this.albumService.getAlbums().subscribe({
          next: (allAlbums) => {
            // Filter albums by artist
            this.albums = allAlbums.filter((album: any) => album.artist === artistId);
            
            // Load tracks for each album
            this.loadAlbumTracks();
            
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load albums';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.error = 'Failed to load artist details';
        this.loading = false;
      }
    });
  }
  
  loadAlbumTracks(): void {
    // For each album, get its tracks
    this.albums.forEach(album => {
      this.albumService.getAlbum(album.id).subscribe({
        next: (albumDetail) => {
          this.albumTracks[album.id] = albumDetail.tracks;
          console.log(`Loaded ${albumDetail.tracks.length} tracks for album ${album.id}`);
        },
        error: (err) => {
          console.error(`Failed to load tracks for album ${album.id}`, err);
        }
      });
    });
  }
  
  loadPlaylists(): void {
    this.playlistService.getPlaylists().subscribe({
      next: (playlists) => {
        this.playlists = playlists;
        console.log('Loaded playlists:', playlists);
      },
      error: (err) => {
        console.error('Failed to load playlists', err);
      }
    });
  }
  
  formatDuration(duration: string): string {
    if (!duration) return '0:00';
    
    const parts = duration.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const seconds = parseInt(parts[2]);
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
    return duration;
  }

  playTrack(track: any): void {
    console.log('Playing track:', track);
    if (!track.audio_file) {
      alert('This track has no audio preview available');
      return;
    }
    this.playerService.play(track);
  }
  
  addToPlaylist(trackId: number, playlistId: number): void {
    console.log('Adding track', trackId, 'to playlist', playlistId);
    this.playlistService.addTrackToPlaylist(playlistId, trackId).subscribe({
      next: () => {
        alert('Track added to playlist!');
      },
      error: (err) => {
        alert('Failed to add track to playlist');
        console.error(err);
      }
    });
  }
}