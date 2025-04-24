import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface Track {
  id: number;
  title: string;
  artist_name?: string;
  audio_file: string;
  duration: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audio: any;
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private isBrowser: boolean;
  
  // Для управления плейлистом проигрывания
  private queue: Track[] = [];
  private currentIndex = -1;
  
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      this.audio = new Audio();
      
      this.audio.addEventListener('ended', () => {
        console.log('Track ended');
        this.isPlayingSubject.next(false);
        // Автоматически играть следующий трек
        if (this.hasNextTrack()) {
          this.playNext();
        }
      });
      
      this.audio.addEventListener('play', () => {
        console.log('Track playing');
        this.isPlayingSubject.next(true);
      });
      
      this.audio.addEventListener('pause', () => {
        console.log('Track paused');
        this.isPlayingSubject.next(false);
      });
      
      this.audio.addEventListener('error', (e: any) => {
        console.error('Audio error:', e);
        this.isPlayingSubject.next(false);
      });
      
      // Обновление duration когда метаданные загружены
      this.audio.addEventListener('loadedmetadata', () => {
        console.log('Duration updated:', this.audio.duration);
        // Вызываем update для корректного отображения
        this.currentTrackSubject.next(this.currentTrackSubject.value);
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
    
    console.log('PlayerService: Playing track', track);
    
    try {
      // Проверяем, есть ли трек уже в очереди
      const existingIndex = this.queue.findIndex(t => t.id === track.id);
      
      if (existingIndex >= 0) {
        // Если трек уже в очереди, просто переключаемся на него
        this.currentIndex = existingIndex;
      } else {
        // Добавляем трек в очередь и играем его
        this.queue.push(track);
        this.currentIndex = this.queue.length - 1;
      }
      
      const currentTrack = this.queue[this.currentIndex];
      
      if (this.currentTrackSubject.value?.id === currentTrack.id) {
        this.togglePlayPause();
      } else {
        if (!currentTrack.audio_file) {
          console.error('Track has no audio URL');
          return;
        }
        
        console.log('Setting audio source:', currentTrack.audio_file);
        this.audio.src = currentTrack.audio_file;
        this.audio.load();
        
        // Обновляем трек
        this.currentTrackSubject.next(currentTrack);
        
        // Пробуем воспроизвести
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Audio playback started successfully');
            this.isPlayingSubject.next(true);
          }).catch((error: any) => {
            console.error('Audio playback failed:', error);
          });
        }
      }
    } catch (error) {
      console.error('Error in play method:', error);
    }
  }
  
  togglePlayPause(): void {
    if (!this.isBrowser) return;
    
    console.log('Toggle play/pause');
    if (this.audio.paused) {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error: any) => {
          console.error('Playback failed:', error);
        });
      }
    } else {
      this.audio.pause();
    }
  }
  
  stop(): void {
    if (!this.isBrowser) return;
    
    console.log('Stopping playback');
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlayingSubject.next(false);
  }
  
  playNext(): void {
    if (!this.hasNextTrack()) return;
    
    this.currentIndex++;
    this.play(this.queue[this.currentIndex]);
  }
  
  playPrevious(): void {
    if (!this.hasPreviousTrack()) return;
    
    this.currentIndex--;
    this.play(this.queue[this.currentIndex]);
  }
  
  hasNextTrack(): boolean {
    return this.currentIndex < this.queue.length - 1;
  }
  
  hasPreviousTrack(): boolean {
    return this.currentIndex > 0;
  }
  
  getCurrentTime(): number {
    return this.isBrowser ? this.audio.currentTime : 0;
  }
  
  getDuration(): number {
    return this.isBrowser && !isNaN(this.audio.duration) ? this.audio.duration : 0;
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