import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'], // Changed from .scss to .css
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})

export class PlayerComponent implements OnInit, OnDestroy {
  currentTrack: any = null;
  isPlaying = false;
  volume = 80;
  currentTime = 0;
  duration = 0;
  private trackSubscription: Subscription | null = null;
  private playingSubscription: Subscription | null = null;
  private timeUpdateInterval: any = null;

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.trackSubscription = this.playerService.getCurrentTrack().subscribe(track => {
      this.currentTrack = track;
      if (track) {
        this.duration = this.playerService.getDuration() || 0;
      }
    });

    this.playingSubscription = this.playerService.isPlaying().subscribe(playing => {
      this.isPlaying = playing;
      
      if (playing) {
        this.startTimeUpdate();
      } else {
        this.stopTimeUpdate();
      }
    });
    
    this.playerService.setVolume(this.volume / 100);
  }

  ngOnDestroy(): void {
    if (this.trackSubscription) {
      this.trackSubscription.unsubscribe();
    }
    
    if (this.playingSubscription) {
      this.playingSubscription.unsubscribe();
    }
    
    this.stopTimeUpdate();
  }

  togglePlayPause(): void {
    if (this.currentTrack) {
      this.playerService.togglePlayPause();
    }
  }

  stop(): void {
    this.playerService.stop();
  }

  setVolume(): void {
    this.playerService.setVolume(this.volume / 100);
  }

  setCurrentTime(event: any): void {
    const seekTime = event.target.value;
    this.playerService.setCurrentTime(seekTime);
    this.currentTime = seekTime;
  }

  private startTimeUpdate(): void {
    this.stopTimeUpdate();
    this.timeUpdateInterval = setInterval(() => {
      this.currentTime = this.playerService.getCurrentTime();
      this.duration = this.playerService.getDuration() || 0;
    }, 1000);
  }

  private stopTimeUpdate(): void {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
  }
  
  formatTime(seconds: number): string {
    if (isNaN(seconds) || !isFinite(seconds)) {
      return '0:00';
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}