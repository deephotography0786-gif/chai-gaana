import { Song, AppSettings, PlaylistExportData } from '../types/music';
import { DEFAULT_VINTAGE_SONGS } from '../data/defaultSongs';

const PLAYLIST_STORAGE_KEY = 'chai_gaana_playlist_v2';
const SETTINGS_STORAGE_KEY = 'chai_gaana_settings_v2';
const PLAYER_VOLUME_KEY = 'chai_gaana_volume_v2';

export const DEFAULT_SETTINGS: AppSettings = {
  timeMode: 'auto',
  weatherMode: 'clear',
  animationLevel: 'full',
  theme: 'vintage',
  ambienceVolume: 0.25,
  ambienceType: 'stall_simmer',
  rememberVolume: true,
  rememberPlaylist: true,
  showVisualizer: true,
  vintageRadioGlow: true,
};

export const StorageService = {
  loadPlaylist(): Song[] {
    try {
      const data = localStorage.getItem(PLAYLIST_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If the requested song is not in the cached playlist, prepend it
          const hasRequested = parsed.some(
            (s: Song) => s.youtubeId === 'bwWprAAOyy8' || s.url?.includes('bwWprAAOyy8')
          );
          if (!hasRequested && DEFAULT_VINTAGE_SONGS.length > 0) {
            const requestedSong = DEFAULT_VINTAGE_SONGS[0];
            return [requestedSong, ...parsed];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load playlist from localStorage', e);
    }
    return DEFAULT_VINTAGE_SONGS;
  },

  savePlaylist(songs: Song[]): void {
    try {
      localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(songs));
    } catch (e) {
      console.warn('Failed to save playlist to localStorage', e);
    }
  },

  loadSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }
  },

  loadSavedVolume(): number {
    try {
      const vol = localStorage.getItem(PLAYER_VOLUME_KEY);
      if (vol !== null) {
        const parsed = parseFloat(vol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return 0.85;
  },

  saveVolume(volume: number): void {
    try {
      localStorage.setItem(PLAYER_VOLUME_KEY, volume.toString());
    } catch {
      // ignore
    }
  },

  exportPlaylistJson(songs: Song[]): string {
    const exportData: PlaylistExportData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      playlistName: "Tonight's Chai Playlist",
      songs,
    };
    return JSON.stringify(exportData, null, 2);
  },

  validateAndImportPlaylistJson(jsonString: string): { success: boolean; songs?: Song[]; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      const rawSongs = Array.isArray(parsed) ? parsed : parsed.songs;

      if (!Array.isArray(rawSongs) || rawSongs.length === 0) {
        return { success: false, error: 'File does not contain a valid list of songs.' };
      }

      const validSongs: Song[] = [];
      for (const item of rawSongs) {
        if (!item.title || !item.url) continue;
        validSongs.push({
          id: item.id || `song-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: String(item.title).trim(),
          artist: String(item.artist || 'Classic Artist').trim(),
          url: String(item.url).trim(),
          albumOrMovie: item.albumOrMovie ? String(item.albumOrMovie) : undefined,
          year: item.year ? String(item.year) : undefined,
          thumbnail: item.thumbnail ? String(item.thumbnail) : undefined,
          duration: typeof item.duration === 'number' ? item.duration : undefined,
          addedAt: typeof item.addedAt === 'number' ? item.addedAt : Date.now(),
          sourceType: item.sourceType || (item.url.includes('youtu') ? 'youtube' : 'audio'),
          youtubeId: item.youtubeId,
          category: item.category || 'Custom',
        });
      }

      if (validSongs.length === 0) {
        return { success: false, error: 'No readable songs found in the imported file.' };
      }

      return { success: true, songs: validSongs };
    } catch {
      return { success: false, error: 'Invalid JSON file format. Please check the file.' };
    }
  },
};
