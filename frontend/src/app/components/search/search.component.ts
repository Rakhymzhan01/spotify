// search.component.ts
import { Component } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchQuery = '';
  searchResults: any = {
    songs: [],
    albums: [],
    artists: []
  };
  loading = false;
  private searchSubject = new Subject<string>();

  constructor(private musicService: MusicService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchQuery);
  }

  performSearch(query: string) {
    if (!query.trim()) {
      this.searchResults = { songs: [], albums: [], artists: [] };
      return;
    }

    this.loading = true;
    
    this.musicService.search(query).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  addToFavorites(songId: number) {
    this.musicService.addToFavorites(songId).subscribe();
  }
  playSong(song: any) {
    console.log('Playing song:', song);
    // Используем сервис для воспроизведения песни
    this.musicService.play(song).subscribe({
      next: () => {
        console.log('Song is now playing:', song);
      },
      error: () => {
        console.error('Error while trying to play the song');
      }
    });
  }
}