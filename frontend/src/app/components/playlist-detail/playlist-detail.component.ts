import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlaylistService } from '../../services/playlist.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ]
})

export class PlaylistDetailComponent implements OnInit {
  playlist: any = null;
  loading = true;
  error = '';
  editMode = false;
  playlistForm: FormGroup;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistService: PlaylistService,
    private playerService: PlayerService,
    private formBuilder: FormBuilder
  ) {
    this.playlistForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const playlistId = Number(params.get('id'));
      if (playlistId) {
        this.loadPlaylistDetails(playlistId);
      }
    });
  }

  loadPlaylistDetails(playlistId: number): void {
    this.loading = true;
    this.playlistService.getPlaylist(playlistId).subscribe({
      next: (playlist) => {
        this.playlist = playlist;
        this.playlistForm.patchValue({
          title: playlist.title,
          description: playlist.description
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load playlist details';
        this.loading = false;
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.playlistForm.patchValue({
        title: this.playlist.title,
        description: this.playlist.description
      });
    }
  }

  updatePlaylist(): void {
    if (this.playlistForm.invalid) {
      return;
    }

    this.submitting = true;
    const { title, description } = this.playlistForm.value;

    this.playlistService.updatePlaylist(this.playlist.id, { title, description }).subscribe({
      next: (updatedPlaylist) => {
        this.playlist.title = updatedPlaylist.title;
        this.playlist.description = updatedPlaylist.description;
        this.submitting = false;
        this.editMode = false;
      },
      error: (err) => {
        this.error = 'Failed to update playlist';
        this.submitting = false;
      }
    });
  }

  playTrack(track: any): void {
    this.playerService.play(track);
  }

  removeTrackFromPlaylist(trackId: number): void {
    if (confirm('Are you sure you want to remove this track from the playlist?')) {
      this.playlistService.removeTrackFromPlaylist(this.playlist.id, trackId).subscribe({
        next: () => {
          this.playlist.tracks = this.playlist.tracks.filter((t: any) => t.id !== trackId);
        },
        error: (err) => {
          this.error = 'Failed to remove track from playlist';
        }
      });
    }
  }

  deletePlaylist(): void {
    if (confirm('Are you sure you want to delete this playlist?')) {
      this.playlistService.deletePlaylist(this.playlist.id).subscribe({
        next: () => {
          this.router.navigate(['/playlists']);
        },
        error: (err) => {
          this.error = 'Failed to delete playlist';
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