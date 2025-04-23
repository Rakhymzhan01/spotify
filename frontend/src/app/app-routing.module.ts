// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LibraryComponent } from './components/library/library.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';
import { PlaylistDetailComponent } from './components/playlist-detail/playlist-detail.component';
import { SearchComponent } from './components/search/search.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'library', component: LibraryComponent, canActivate: [AuthGuard] },
  { path: 'album/:id', component: AlbumDetailComponent },
  { path: 'playlist/:id', component: PlaylistDetailComponent },
  { path: 'search', component: SearchComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }