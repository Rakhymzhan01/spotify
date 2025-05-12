import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  // Make sure the URL ends with exactly one slash
  private apiUrl = 'http://localhost:8000/api/playlists';

  constructor(private http: HttpClient) { }

  getPlaylists(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  getPlaylist(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/`);
  }

  createPlaylist(title: string, description: string = ''): Observable<any> {
    console.log('Creating playlist:', {title, description});
    // Make sure to use exactly one slash
    return this.http.post(`${this.apiUrl}/`, { title, description });
  }

  updatePlaylist(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/`, data);
  }

  deletePlaylist(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/`);
  }

  addTrackToPlaylist(playlistId: number, trackId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${playlistId}/tracks/`, { track_id: trackId });
  }

  removeTrackFromPlaylist(playlistId: number, trackId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${playlistId}/tracks/`, {
      body: { track_id: trackId }
    });
  }
}