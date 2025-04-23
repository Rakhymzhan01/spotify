import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { ArtistDetailComponent } from './components/artist-detail/artist-detail.component';
import { AlbumListComponent } from './components/album-list/album-list.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';
import { PlaylistListComponent } from './components/playlist-list/playlist-list.component';
import { PlaylistDetailComponent } from './components/playlist-detail/playlist-detail.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'artists', component: ArtistListComponent },
  { path: 'artists/:id', component: ArtistDetailComponent },
  { path: 'albums', component: AlbumListComponent },
  { path: 'albums/:id', component: AlbumDetailComponent },
  { path: 'playlists', component: PlaylistListComponent, canActivate: [authGuard] },
  { path: 'playlists/:id', component: PlaylistDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];