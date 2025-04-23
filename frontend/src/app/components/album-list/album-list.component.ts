import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlbumService } from '../../services/album.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    DatePipe
  ]
})
export class AlbumListComponent implements OnInit {
  albums: any[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  filteredAlbums: any[] = [];

  constructor(private albumService: AlbumService) { }

  ngOnInit(): void {
    this.loadAlbums();
  }

  loadAlbums(): void {
    this.albumService.getAlbums().subscribe({
      next: (albums) => {
        this.albums = albums;
        this.filteredAlbums = albums;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load albums';
        this.loading = false;
      }
    });
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAlbums = this.albums;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredAlbums = this.albums.filter(album => 
      album.title.toLowerCase().includes(term) || 
      album.artist_name.toLowerCase().includes(term)
    );
  }
}