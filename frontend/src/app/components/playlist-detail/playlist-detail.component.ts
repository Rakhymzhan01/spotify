// playlist-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MusicService } from '../../services/music.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css']
})
export class PlaylistDetailComponent implements OnInit {
  playlist: any = null;
  loading = true;
  error = '';
  isEditing = false;
  
  editablePlaylist = {
    name: '',
    description: ''
  };
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private musicService: MusicService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const playlistId = Number(params.get('id'));
      if (playlistId) {
        this.loadPlaylist(playlistId);
      }
    });
  }

  loadPlaylist(playlistId: number) {
    this.loading = true;
    this.musicService.getPlaylistById(playlistId).subscribe({
      next: (playlist) => {
        this.playlist = playlist;
        this.editablePlaylist = {
          name: playlist.name,
          description: playlist.description
        };
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load playlist. Please try again later.';
        this.loading = false;
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  savePlaylist() {
    this.musicService.updatePlaylist(this.playlist.id, this.editablePlaylist).subscribe({
      next: (updatedPlaylist) => {
        this.playlist = updatedPlaylist;
        this.isEditing = false;
      }
    });
  }

  deletePlaylist() {
    if (confirm(`Are you sure you want to delete "${this.playlist.name}"?`)) {
      this.musicService.deletePlaylist(this.playlist.id).subscribe({
        next: () => {
          this.router.navigate(['/library']);
        }
      });
    }
  }

  removeSong(songId: number) {
    // This would require an API endpoint to remove a song from a playlist
    console.log('Remove song:', songId);
  }

  playSong(song: any) {
    // This would connect to a player service to actually play the song
    console.log('Playing song:', song);
  }
}