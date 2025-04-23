import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LibraryComponent } from './components/library/library.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';
import { PlaylistDetailComponent } from './components/playlist-detail/playlist-detail.component';
import { SearchComponent } from './components/search/search.component';
import { PlayerComponent } from './components/player/player.component';

import { AuthInterceptor } from './interceptors/auth-interceptor.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    LibraryComponent,
    AlbumDetailComponent,
    PlaylistDetailComponent,
    SearchComponent,
    PlayerComponent,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
})
export class AppModule { }
