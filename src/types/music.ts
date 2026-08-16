export type TimeOfDay = 'dawn' | 'day' | 'evening' | 'night';
export type TimeMode = 'auto' | 'dawn' | 'day' | 'evening' | 'night';
export type WeatherMode = 'clear' | 'rain' | 'mist' | 'golden_haze';
export type AnimationLevel = 'full' | 'reduced' | 'off';
export type ThemeMode =
  | 'vintage'
  | 'dark_vintage'
  | 'midnight_velvet'
  | 'emerald_garden'
  | 'monsoon_slate'
  | 'rose_sunset';
export type RepeatMode = 'off' | 'one' | 'all';
export type SourceType = 'youtube' | 'audio' | 'stream' | 'archive';

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumOrMovie?: string;
  year?: string;
  url: string;
  thumbnail?: string;
  duration?: number; // duration in seconds
  addedAt: number;
  sourceType: SourceType;
  youtubeId?: string;
  category?: 'Kishore Kumar' | 'Lata Mangeshkar' | 'Mohammed Rafi' | 'Mukesh' | 'R.D. Burman' | 'Ghazals' | 'Vintage 70s' | 'Custom';
  lyricsSnippet?: string;
}

export interface PlayerState {
  currentSongId: string | null;
  isPlaying: boolean;
  volume: number; // 0 to 1
  isMuted: boolean;
  progress: number; // current time in seconds
  duration: number; // total duration in seconds
  shuffle: boolean;
  repeat: RepeatMode;
  playbackRate: number;
  isLoadingMedia: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export interface AppSettings {
  timeMode: TimeMode;
  weatherMode: WeatherMode;
  animationLevel: AnimationLevel;
  theme: ThemeMode;
  ambienceVolume: number; // 0 to 1
  ambienceType: 'stall_simmer' | 'evening_crickets' | 'morning_birds' | 'monsoon_rain' | 'off';
  rememberVolume: boolean;
  rememberPlaylist: boolean;
  showVisualizer: boolean;
  vintageRadioGlow: boolean;
}

export interface PlaylistExportData {
  version: string;
  exportedAt: string;
  playlistName: string;
  songs: Song[];
}
