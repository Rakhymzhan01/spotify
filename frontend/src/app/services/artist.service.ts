import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private apiUrl = 'http://localhost:8000/api/artists';

  constructor(private http: HttpClient) { }

  getArtists(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getArtist(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/`);
  }
}