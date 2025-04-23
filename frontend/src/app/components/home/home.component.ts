import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DatePipe, SlicePipe } from '@angular/common';
import { ArtistService } from '../../services/artist.service';
import { AlbumService } from '../../services/album.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SlicePipe
  ]
})

export class HomeComponent implements OnInit {
  featuredArtists: any[] = [];
  newReleases: any[] = [];
  loading = true;
  error = '';

  constructor(
    private artistService: ArtistService,
    private albumService: AlbumService
  ) { }

  ngOnInit(): void {
    this.loadFeaturedContent();
  }

  loadFeaturedContent(): void {
    // Load featured artists
    this.artistService.getArtists().subscribe({
      next: (artists) => {
        this.featuredArtists = artists.slice(0, 4); // Get first 4 artists
        
        // Load new releases (albums)
        this.albumService.getAlbums().subscribe({
          next: (albums) => {
            this.newReleases = albums.slice(0, 4); // Get first 4 albums
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load albums';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.error = 'Failed to load artists';
        this.loading = false;
      }
    });
  }
}