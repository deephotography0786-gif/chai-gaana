// Media playback coordinator supporting YouTube IFrame API and HTML5 Audio
import { SourceType } from '../types/music';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export type PlayerEventType = 'play' | 'pause' | 'ended' | 'timeupdate' | 'error' | 'ready';
export type PlayerEventCallback = (data?: any) => void;

class MediaService {
  private ytPlayer: any = null;
  private audioElement: HTMLAudioElement | null = null;
  private isYtApiReady = false;
  private ytReadyPromise: Promise<void> | null = null;
  private listeners: Map<PlayerEventType, Set<PlayerEventCallback>> = new Map();
  private currentSourceType: SourceType | null = null;
  private pollInterval: any = null;

  constructor() {
    this.initAudioElement();
    this.loadYouTubeIframeAPI();
  }

  private initAudioElement() {
    if (typeof window === 'undefined') return;
    this.audioElement = new Audio();
    this.audioElement.preload = 'auto';

    this.audioElement.addEventListener('play', () => this.emit('play'));
    this.audioElement.addEventListener('pause', () => this.emit('pause'));
    this.audioElement.addEventListener('ended', () => this.emit('ended'));
    this.audioElement.addEventListener('timeupdate', () => {
      if (this.audioElement) {
        this.emit('timeupdate', {
          currentTime: this.audioElement.currentTime,
          duration: this.audioElement.duration || 0,
        });
      }
    });
    this.audioElement.addEventListener('error', (e) => {
      console.warn('Audio playback error', e);
      this.emit('error', 'Audio playback failed. The media source may be temporarily unavailable.');
    });
  }

  private loadYouTubeIframeAPI(): Promise<void> {
    if (this.ytReadyPromise) return this.ytReadyPromise;

    this.ytReadyPromise = new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve();

      if (window.YT && window.YT.Player) {
        this.isYtApiReady = true;
        return resolve();
      }

      // Existing tag check
      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        this.isYtApiReady = true;
        resolve();
      };
    });

    return this.ytReadyPromise;
  }

  public async mountYouTubePlayer(containerId: string): Promise<void> {
    await this.loadYouTubeIframeAPI();

    return new Promise((resolve) => {
      if (!window.YT || !window.YT.Player) {
        resolve();
        return;
      }

      if (this.ytPlayer) {
        try {
          this.ytPlayer.destroy();
        } catch {
          // ignore
        }
      }

      this.ytPlayer = new window.YT.Player(containerId, {
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          fs: 0,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            this.emit('ready');
            resolve();
          },
          onStateChange: (event: any) => {
            // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
            if (event.data === 1) {
              this.emit('play');
              this.startProgressPolling();
            } else if (event.data === 2) {
              this.emit('pause');
              this.stopProgressPolling();
            } else if (event.data === 0) {
              this.emit('ended');
              this.stopProgressPolling();
            }
          },
          onError: (event: any) => {
            console.warn('YouTube Player error code:', event.data);
            this.emit('error', 'Video playback error on third-party source. Skipping to next song...');
          },
        },
      });
    });
  }

  public on(event: PlayerEventType, callback: PlayerEventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: PlayerEventType, data?: any) {
    const cbs = this.listeners.get(event);
    if (cbs) {
      cbs.forEach((cb) => cb(data));
    }
  }

  public async playTrack(sourceType: SourceType, url: string, youtubeId?: string, autoplay = true) {
    this.stopProgressPolling();

    // Pause audio if switching
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.ytPlayer && typeof this.ytPlayer.stopVideo === 'function') {
      try {
        this.ytPlayer.stopVideo();
      } catch {
        // ignore
      }
    }

    this.currentSourceType = sourceType;

    if (sourceType === 'youtube' && (youtubeId || url)) {
      const vid = youtubeId || this.extractYoutubeId(url);
      if (vid && this.ytPlayer && typeof this.ytPlayer.loadVideoById === 'function') {
        try {
          if (autoplay) {
            this.ytPlayer.loadVideoById(vid);
          } else {
            this.ytPlayer.cueVideoById(vid);
          }
        } catch (e) {
          console.warn('Failed to load YT video', e);
        }
      }
    } else {
      // Direct Audio / Stream / Archive
      if (this.audioElement) {
        this.audioElement.src = url;
        this.audioElement.load();
        if (autoplay) {
          try {
            await this.audioElement.play();
          } catch (e) {
            console.warn('Autoplay prevented by browser', e);
            this.emit('pause');
          }
        }
      }
    }
  }

  public play() {
    if (this.currentSourceType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
      try {
        this.ytPlayer.playVideo();
      } catch (e) {
        console.warn('YT play failed', e);
      }
    } else if (this.currentSourceType === 'audio' && this.audioElement) {
      this.audioElement.play().catch((e) => console.warn('Audio play failed', e));
    }
  }

  public pause() {
    if (this.currentSourceType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
      } catch (e) {
        console.warn('YT pause failed', e);
      }
    } else if (this.currentSourceType === 'audio' && this.audioElement) {
      this.audioElement.pause();
    }
    this.stopProgressPolling();
  }

  public seekTo(seconds: number) {
    if (this.currentSourceType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
      try {
        this.ytPlayer.seekTo(seconds, true);
      } catch (e) {
        console.warn('YT seek failed', e);
      }
    } else if (this.currentSourceType === 'audio' && this.audioElement) {
      this.audioElement.currentTime = seconds;
    }
  }

  public setVolume(volume0to1: number) {
    const clamped = Math.max(0, Math.min(1, volume0to1));
    if (this.audioElement) {
      this.audioElement.volume = clamped;
    }
    if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
      try {
        this.ytPlayer.setVolume(clamped * 100);
      } catch {
        // ignore
      }
    }
  }

  public setMuted(muted: boolean) {
    if (this.audioElement) {
      this.audioElement.muted = muted;
    }
    if (this.ytPlayer) {
      try {
        if (muted && typeof this.ytPlayer.mute === 'function') {
          this.ytPlayer.mute();
        } else if (!muted && typeof this.ytPlayer.unMute === 'function') {
          this.ytPlayer.unMute();
        }
      } catch {
        // ignore
      }
    }
  }

  private startProgressPolling() {
    this.stopProgressPolling();
    this.pollInterval = setInterval(() => {
      if (this.currentSourceType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
        try {
          const currentTime = this.ytPlayer.getCurrentTime() || 0;
          const duration = this.ytPlayer.getDuration() || 0;
          this.emit('timeupdate', { currentTime, duration });
        } catch {
          // ignore
        }
      }
    }, 400);
  }

  private stopProgressPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  private extractYoutubeId(url: string): string | null {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }
}

export const mediaService = new MediaService();
