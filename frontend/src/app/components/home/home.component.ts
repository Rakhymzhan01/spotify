// home.component.ts
import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredAlbums: any[] = [];
  recentlyPlayed: any[] = [];
  topArtists: any[] = [];
  loading = true;
  error = '';

  constructor(private musicService: MusicService) { }

  ngOnInit(): void {
    this.loadHomeData();
  }

  loadHomeData() {
    this.musicService.getAlbums().subscribe({
      next: (albums) => {
        this.featuredAlbums = albums.slice(0, 6); // Show up to 6 albums
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load featured albums';
        this.loading = false;
      }
    });

    this.musicService.getArtists().subscribe({
      next: (artists) => {
        this.topArtists = artists.slice(0, 5); // Show up to 5 top artists
      },
      error: () => {
        this.error = 'Failed to load top artists';
      }
    });
  }

  playSong(song: any) {
    // This would connect to a player service to actually play the song
    console.log('Playing song:', song);
  }
}