import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlaylistService } from '../../services/playlist.service';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    DatePipe
  ]
})

export class PlaylistListComponent implements OnInit {
  playlists: any[] = [];
  loading = true;
  error = '';
  showCreateForm = false;
  playlistForm: FormGroup;
  submitting = false;

  constructor(
    private playlistService: PlaylistService,
    private formBuilder: FormBuilder
  ) {
    this.playlistForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadPlaylists();
  }

  loadPlaylists(): void {
    this.loading = true;
    this.playlistService.getPlaylists().subscribe({
      next: (playlists) => {
        this.playlists = playlists;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load playlists';
        this.loading = false;
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.playlistForm.reset();
    }
  }

  createPlaylist(): void {
    if (this.playlistForm.invalid) {
      return;
    }

    this.submitting = true;
    const { title, description } = this.playlistForm.value;

    this.playlistService.createPlaylist(title, description).subscribe({
      next: (playlist) => {
        this.playlists.unshift(playlist);
        this.submitting = false;
        this.toggleCreateForm();
        this.playlistForm.reset();
      },
      error: (err) => {
        this.error = 'Failed to create playlist';
        this.submitting = false;
      }
    });
  }

  deletePlaylist(playlistId: number, event: Event): void {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this playlist?')) {
      this.playlistService.deletePlaylist(playlistId).subscribe({
        next: () => {
          this.playlists = this.playlists.filter(p => p.id !== playlistId);
        },
        error: (err) => {
          this.error = 'Failed to delete playlist';
        }
      });
    }
  }
}