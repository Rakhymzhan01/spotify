import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AlbumService } from '../../services/album.service';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../services/auth.service';
import { PlaylistService } from '../../services/playlist.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe
  ]
})
export class AlbumDetailComponent implements OnInit {
  album: any = null;
  tracks: any[] = [];
  loading = true;
  error = '';
  isAuthenticated$: Observable<boolean>;
  playlists: any[] = [];
  selectedPlaylistId: number | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private albumService: AlbumService,
    private playerService: PlayerService,
    private authService: AuthService,
    private playlistService: PlaylistService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const albumId = Number(params.get('id'));
      if (albumId) {
        this.loadAlbumDetails(albumId);
      }
    });
    
    // Load user's playlists if authenticated
    this.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.loadPlaylists();
      }
    });
  }

  loadAlbumDetails(albumId: number): void {
    this.loading = true;
    this.albumService.getAlbum(albumId).subscribe({
      next: (response) => {
        this.album = response.album;
        this.tracks = response.tracks;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load album details';
        this.loading = false;
      }
    });
  }
  
  loadPlaylists(): void {
    this.playlistService.getPlaylists().subscribe({
      next: (playlists) => {
        this.playlists = playlists;
      },
      error: (err) => {
        console.error('Failed to load playlists', err);
      }
    });
  }

  playTrack(track: any): void {
    this.playerService.play(track);
  }
  
  addToPlaylist(trackId: number): void {
    if (this.selectedPlaylistId) {
      this.playlistService.addTrackToPlaylist(this.selectedPlaylistId, trackId).subscribe({
        next: () => {
          alert('Track added to playlist!');
          this.selectedPlaylistId = null;
        },
        error: (err) => {
          alert('Failed to add track to playlist');
          console.error(err);
        }
      });
    }
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
}