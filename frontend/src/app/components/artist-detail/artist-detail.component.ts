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
  ]
})
export class ArtistDetailComponent implements OnInit {
  artist: any = null;
  albums: any[] = [];
  loading = true;
  error = '';
  album: any = null; // Add this to fix template errors
  selectedPlaylistId: number | null = null;
  playlists: any[] = [];
  tracks: any[] = []; // Add this for missing property
  isAuthenticated$: Observable<boolean>; // Add this for missing property
  
  constructor(
    private route: ActivatedRoute,
    private artistService: ArtistService,
    private albumService: AlbumService,
    private playerService: PlayerService,
    private playlistService: PlaylistService,
    private authService: AuthService // Add auth service
  ) {
    // Initialize the isAuthenticated$ Observable
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const artistId = Number(params.get('id'));
      if (artistId) {
        this.loadArtistDetails(artistId);
      }
    });
    
    // Load playlists if authenticated
    this.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.loadPlaylists();
      }
    });
  }

  loadArtistDetails(artistId: number): void {
    this.loading = true;
    this.artistService.getArtist(artistId).subscribe({
      next: (artist) => {
        this.artist = artist;
        
        // Set this.album for compatibility with template
        this.album = {
          title: artist.name,
          artist_name: artist.name,
          cover_image_url: artist.image_url,
          release_date: new Date() // Placeholder date
        };
        
        // Load albums and tracks
        this.albumService.getAlbums().subscribe({
          next: (allAlbums) => {
            this.albums = allAlbums.filter((album: any) => album.artist === artistId);
            
            // Load tracks from these albums
            if (this.albums.length > 0) {
              // For simplicity, just get tracks from the first album
              this.albumService.getAlbum(this.albums[0].id).subscribe({
                next: (albumDetail) => {
                  this.tracks = albumDetail.tracks || [];
                  this.loading = false;
                }
              });
            } else {
              this.loading = false;
            }
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
}