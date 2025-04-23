import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface Track {
  id: number;
  title: string;
  artist: number;
  album: number;
  audio_file: string;
  duration: string;
  track_number: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audio: any = null;
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private isBrowser: boolean;
  
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      this.audio = new Audio();
      this.audio.addEventListener('ended', () => {
        this.isPlayingSubject.next(false);
      });
    }
  }
  
  getCurrentTrack(): Observable<Track | null> {
    return this.currentTrackSubject.asObservable();
  }
  
  isPlaying(): Observable<boolean> {
    return this.isPlayingSubject.asObservable();
  }
  
  play(track: Track): void {
    if (!this.isBrowser) return;
    
    if (this.currentTrackSubject.value?.id === track.id) {
      this.togglePlayPause();
    } else {
      this.audio.src = track.audio_file;
      this.audio.load();
      this.audio.play();
      this.currentTrackSubject.next(track);
      this.isPlayingSubject.next(true);
    }
  }
  
  togglePlayPause(): void {
    if (!this.isBrowser) return;
    
    if (this.audio.paused) {
      this.audio.play();
      this.isPlayingSubject.next(true);
    } else {
      this.audio.pause();
      this.isPlayingSubject.next(false);
    }
  }
  
  stop(): void {
    if (!this.isBrowser) return;
    
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlayingSubject.next(false);
  }
  
  getCurrentTime(): number {
    return this.isBrowser ? this.audio.currentTime : 0;
  }
  
  getDuration(): number {
    return this.isBrowser ? this.audio.duration : 0;
  }
  
  setCurrentTime(time: number): void {
    if (this.isBrowser) {
      this.audio.currentTime = time;
    }
  }
  
  setVolume(volume: number): void {
    if (this.isBrowser) {
      this.audio.volume = volume;
    }
  }
}