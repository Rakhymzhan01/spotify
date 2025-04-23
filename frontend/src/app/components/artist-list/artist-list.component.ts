import { Component, OnInit } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    SlicePipe
  ]
})

export class ArtistListComponent implements OnInit {
  artists: any[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  filteredArtists: any[] = [];

  constructor(private artistService: ArtistService) { }

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists(): void {
    this.artistService.getArtists().subscribe({
      next: (artists) => {
        this.artists = artists;
        this.filteredArtists = artists;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load artists';
        this.loading = false;
      }
    });
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredArtists = this.artists;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredArtists = this.artists.filter(artist => 
      artist.name.toLowerCase().includes(term)
    );
  }
}