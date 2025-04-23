// album-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent implements OnInit {
  album: any = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private musicService: MusicService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const albumId = Number(params.get('id'));
      if (albumId) {
        this.loadAlbum(albumId);
      }
    });
  }

  loadAlbum(albumId: number) {
    this.loading = true;
    this.musicService.getAlbumById(albumId).subscribe({
      next: (album) => {
        this.album = album;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load album. Please try again later.';
        this.loading = false;
      }
    });
  }

  playSong(song: any) {
    // This would connect to a player service to actually play the song
    console.log('Playing song:', song);
  }

  addToFavorites(songId: number) {
    this.musicService.addToFavorites(songId).subscribe({
      next: () => {
        // Show a success message or update UI
        console.log('Added to favorites');
      }
    });
  }
}