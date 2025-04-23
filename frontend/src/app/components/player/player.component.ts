// player.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  currentSong: any = null;
  isPlaying = false;
  volume = 50;
  progress = 0;
  currentTime = 0;
  duration = 0;
  
  constructor() { }

  ngOnInit(): void {
    // In a real application, this would subscribe to a player service
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    // In a real application, this would call a player service method
  }

  nextTrack() {
    // In a real application, this would call a player service method
    console.log('Next track');
  }

  previousTrack() {
    // In a real application, this would call a player service method
    console.log('Previous track');
  }

  updateVolume() {
    // In a real application, this would call a player service method
    console.log('Volume updated:', this.volume);
  }

  seekTrack(event: any) {
    const seekPosition = event.target.value;
    this.progress = seekPosition;
    // In a real application, this would call a player service method
    console.log('Seek to:', seekPosition);
  }
  
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
}