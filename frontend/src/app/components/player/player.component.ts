import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})

export class PlayerComponent implements OnInit, OnDestroy {
  currentTrack: any = null;
  isPlaying = false;
  volume = 80;
  currentTime = 0;
  duration = 0;
  hasPreviousTrack = false;
  hasNextTrack = false;
  
  private trackSubscription: Subscription | null = null;
  private playingSubscription: Subscription | null = null;
  private timeUpdateInterval: any = null;

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    console.log('Player component initialized');
    
    this.trackSubscription = this.playerService.getCurrentTrack().subscribe(track => {
      console.log('Current track changed:', track);
      this.currentTrack = track;
      if (track) {
        this.duration = this.playerService.getDuration() || 0;
        this.hasPreviousTrack = this.playerService.hasPreviousTrack();
        this.hasNextTrack = this.playerService.hasNextTrack();
      }
    });

    this.playingSubscription = this.playerService.isPlaying().subscribe(playing => {
      console.log('Playing state changed:', playing);
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
    console.log('Toggle play/pause clicked');
    if (this.currentTrack) {
      this.playerService.togglePlayPause();
    }
  }
  
  nextTrack(): void {
    this.playerService.playNext();
  }
  
  previousTrack(): void {
    this.playerService.playPrevious();
  }

  stop(): void {
    console.log('Stop clicked');
    this.playerService.stop();
  }

  setVolume(): void {
    console.log('Volume changed:', this.volume);
    this.playerService.setVolume(this.volume / 100);
  }

  setCurrentTime(event: any): void {
    const seekTime = event.target.value;
    console.log('Seeking to:', seekTime);
    this.playerService.setCurrentTime(seekTime);
    this.currentTime = seekTime;
  }

  private startTimeUpdate(): void {
    console.log('Starting time updates');
    this.stopTimeUpdate();
    this.timeUpdateInterval = setInterval(() => {
      this.currentTime = this.playerService.getCurrentTime();
      this.duration = this.playerService.getDuration() || 0;
    }, 1000);
  }

  private stopTimeUpdate(): void {
    if (this.timeUpdateInterval) {
      console.log('Stopping time updates');
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