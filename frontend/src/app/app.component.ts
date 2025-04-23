// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PlayerComponent } from './components/player/player.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    NavbarComponent,
    PlayerComponent
  ]
})
export class AppComponent {
  title = 'spotify-clone';
}