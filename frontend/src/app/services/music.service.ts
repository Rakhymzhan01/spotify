// music.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  play(song: any): Observable<any> {
    // Проверяем, что у нас есть ссылка на аудиофайл песни
    if (!song || !song.audio_url) {
      throw new Error('Audio URL is missing for this song');
    }
  
    // Используем HTML5 Audio API для воспроизведения песни
    const audio = new Audio(song.audio_url);
    audio.play()
      .then(() => {
        console.log('Song is now playing:', song.title);
      })
      .catch((error) => {
        console.error('Error playing the song:', error);
      });
  
    // Возвращаем Observable для подписки
    return new Observable(observer => {
      audio.onended = () => {
        observer.next('Song finished playing');
        observer.complete();
      };
  
      audio.onerror = (error) => {
        observer.error('Error while trying to play the song');
      };
    });
  }
  
  private apiUrl = 'http://localhost:8000/api';
  
  constructor(private http: HttpClient) { }
  
  // Songs
  getSongs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/songs/`);
  }
  
  getSongById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/songs/${id}/`);
  }
  
  // Artists
  getArtists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/artists/`);
  }
  
  getArtistById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/artists/${id}/`);
  }
  
  // Albums
  getAlbums(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/albums/`);
  }
  
  getAlbumById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/albums/${id}/`);
  }
  
  // Playlists
  getPlaylists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/playlists/`);
  }
  
  getPlaylistById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/playlists/${id}/`);
  }
  
  createPlaylist(playlist: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/playlists/`, playlist);
  }
  
  updatePlaylist(id: number, playlist: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/playlists/${id}/`, playlist);
  }
  
  deletePlaylist(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/playlists/${id}/`);
  }
  
  // Favorites
  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/favorites/`);
  }
  
  addToFavorites(songId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/favorites/`, { song_id: songId });
  }
  
  removeFromFavorites(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/favorites/${id}/`);
  }
  
  // Search
  search(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search/?q=${query}`);
  }
  
}