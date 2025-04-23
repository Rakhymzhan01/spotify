import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Импортируем FormsModule для standalone компонента
import { RouterModule } from '@angular/router';  // Импортируем RouterModule для маршрутизации
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-library',
  standalone: true,  // Указываем, что это standalone компонент
  imports: [FormsModule, RouterModule],  // Добавляем FormsModule и RouterModule в imports
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent {
  userPlaylists: any[] = [];
  favorites: any[] = [];
  loading = true;
  newPlaylist = {
    name: '',
    description: ''
  };
  showCreateForm = false;

  constructor(private musicService: MusicService) { }

  ngOnInit(): void {
    this.loadLibrary();
  }

  loadLibrary() {
    this.musicService.getPlaylists().subscribe({
      next: (playlists) => {
        this.userPlaylists = playlists;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.musicService.getFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
      }
    });
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  createPlaylist() {
    if (!this.newPlaylist.name) return;
    
    this.musicService.createPlaylist(this.newPlaylist).subscribe({
      next: (playlist) => {
        this.userPlaylists.push(playlist);
        this.newPlaylist = { name: '', description: '' };
        this.showCreateForm = false;
      }
    });
  }

  removeFromFavorites(favorite: any) {
    this.musicService.removeFromFavorites(favorite.id).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f.id !== favorite.id);
      }
    });
  }

  playSong(song: any) {
    console.log('Playing song:', song);
    // Воспроизводим песню и подписываемся на Observable, возвращаемый play()
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
