/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Song, PlayerState, AppSettings, TimeOfDay, TimeMode, ThemeMode } from './types/music';
import { resolveTimeOfDay, getSystemTimeOfDay } from './utils/timeOfDay';
import { StorageService } from './services/storageService';
import { mediaService } from './services/mediaService';
import { DEFAULT_VINTAGE_SONGS } from './data/defaultSongs';

// Components
import { BackgroundScene } from './components/BackgroundScene';
import { TeaStallDecor } from './components/TeaStallDecor';
import { MusicPlayer } from './components/MusicPlayer';
import { PlaylistDrawer } from './components/PlaylistDrawer';
import { AddSongModal } from './components/AddSongModal';
import { SettingsModal } from './components/SettingsModal';
import { LoadingScreen } from './components/LoadingScreen';
import { TeaStallAmbiencePlayer } from './components/TeaStallAmbiencePlayer';

export default function App() {
  // App initialization & loading state
  const [isLoadingApp, setIsLoadingApp] = useState(true);

  // Settings State
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.loadSettings());

  // Playlist State
  const [songs, setSongs] = useState<Song[]>(() => StorageService.loadPlaylist());

  // Player State
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentSongId: songs.length > 0 ? songs[0].id : null,
    isPlaying: false,
    volume: StorageService.loadSavedVolume(),
    isMuted: false,
    progress: 0,
    duration: songs.length > 0 && songs[0].duration ? songs[0].duration : 0,
    shuffle: false,
    repeat: 'all',
    playbackRate: 1,
    isLoadingMedia: false,
    hasError: false,
    errorMessage: null,
  });

  // UI Modals State
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Real-time Day/Night detection
  const [currentTimeOfDay, setCurrentTimeOfDay] = useState<TimeOfDay>(() =>
    resolveTimeOfDay(settings.timeMode)
  );

  // Keep ref for song list in media event callbacks
  const songsRef = useRef<Song[]>(songs);
  songsRef.current = songs;
  const playerStateRef = useRef<PlayerState>(playerState);
  playerStateRef.current = playerState;

  // Resolved current song object
  const currentSong = songs.find((s) => s.id === playerState.currentSongId) || (songs.length > 0 ? songs[0] : null);

  // Mount official YouTube Player element on startup
  useEffect(() => {
    mediaService.mountYouTubePlayer('youtube-player-mount');
  }, []);

  // Update time of day periodically (every 30 seconds for smooth auto transitions)
  useEffect(() => {
    const updateScene = () => {
      const resolved = resolveTimeOfDay(settings.timeMode);
      setCurrentTimeOfDay(resolved);
    };

    updateScene();
    const timer = setInterval(updateScene, 30000);
    return () => clearInterval(timer);
  }, [settings.timeMode]);

  // Persist playlist when modified
  useEffect(() => {
    if (settings.rememberPlaylist) {
      StorageService.savePlaylist(songs);
    }
  }, [songs, settings.rememberPlaylist]);

  // Persist settings when modified
  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  // Playback Control Handlers
  const handlePlaySong = useCallback((songToPlay: Song, shouldAutoplay = true) => {
    setPlayerState((prev) => ({
      ...prev,
      currentSongId: songToPlay.id,
      isPlaying: shouldAutoplay,
      duration: songToPlay.duration || 0,
      progress: 0,
      hasError: false,
      errorMessage: null,
    }));

    mediaService.playTrack(
      songToPlay.sourceType,
      songToPlay.url,
      songToPlay.youtubeId,
      shouldAutoplay
    );
  }, []);

  const handleNextSong = useCallback(() => {
    const currentList = songsRef.current;
    if (currentList.length === 0) return;

    const state = playerStateRef.current;
    const currentIndex = currentList.findIndex((s) => s.id === state.currentSongId);

    if (state.shuffle && currentList.length > 1) {
      let randomIndex = Math.floor(Math.random() * currentList.length);
      while (randomIndex === currentIndex && currentList.length > 1) {
        randomIndex = Math.floor(Math.random() * currentList.length);
      }
      handlePlaySong(currentList[randomIndex], true);
      return;
    }

    let nextIndex = currentIndex + 1;
    if (nextIndex >= currentList.length) {
      if (state.repeat === 'all') {
        nextIndex = 0;
      } else {
        // End of playlist without repeat-all
        setPlayerState((prev) => ({ ...prev, isPlaying: false }));
        return;
      }
    }

    handlePlaySong(currentList[nextIndex], true);
  }, [handlePlaySong]);

  const handlePreviousSong = useCallback(() => {
    const currentList = songsRef.current;
    if (currentList.length === 0) return;

    const state = playerStateRef.current;
    const currentIndex = currentList.findIndex((s) => s.id === state.currentSongId);

    // If more than 3 seconds into song, restart current song
    if (state.progress > 3) {
      mediaService.seekTo(0);
      setPlayerState((prev) => ({ ...prev, progress: 0 }));
      return;
    }

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = currentList.length - 1;
    }

    handlePlaySong(currentList[prevIndex], true);
  }, [handlePlaySong]);

  // Subscribe to Media Service Events
  useEffect(() => {
    const unsubPlay = mediaService.on('play', () => {
      setPlayerState((prev) => ({ ...prev, isPlaying: true, hasError: false }));
    });

    const unsubPause = mediaService.on('pause', () => {
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
    });

    const unsubTime = mediaService.on('timeupdate', (data: { currentTime: number; duration: number }) => {
      setPlayerState((prev) => ({
        ...prev,
        progress: data.currentTime,
        duration: data.duration > 0 ? data.duration : prev.duration,
      }));
    });

    const unsubEnded = mediaService.on('ended', () => {
      const state = playerStateRef.current;
      if (state.repeat === 'one') {
        mediaService.seekTo(0);
        mediaService.play();
      } else {
        handleNextSong();
      }
    });

    const unsubError = mediaService.on('error', (err: string) => {
      setPlayerState((prev) => ({
        ...prev,
        hasError: true,
        errorMessage: err,
      }));
      // Gracefully advance to next playable item after 2 seconds
      setTimeout(() => {
        handleNextSong();
      }, 2200);
    });

    return () => {
      unsubPlay();
      unsubPause();
      unsubTime();
      unsubEnded();
      unsubError();
    };
  }, [handleNextSong]);

  // Play & Pause Toggles
  const handlePlay = () => {
    if (!currentSong) return;
    mediaService.play();
    setPlayerState((prev) => ({ ...prev, isPlaying: true }));
  };

  const handlePause = () => {
    mediaService.pause();
    setPlayerState((prev) => ({ ...prev, isPlaying: false }));
  };

  const handleSeek = (seconds: number) => {
    mediaService.seekTo(seconds);
    setPlayerState((prev) => ({ ...prev, progress: seconds }));
  };

  const handleVolumeChange = (vol: number) => {
    mediaService.setVolume(vol);
    setPlayerState((prev) => ({
      ...prev,
      volume: vol,
      isMuted: vol === 0,
    }));
    if (settings.rememberVolume) {
      StorageService.saveVolume(vol);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !playerState.isMuted;
    mediaService.setMuted(nextMuted);
    setPlayerState((prev) => ({ ...prev, isMuted: nextMuted }));
  };

  const handleToggleShuffle = () => {
    setPlayerState((prev) => ({ ...prev, shuffle: !prev.shuffle }));
  };

  const handleToggleRepeat = () => {
    const nextMode =
      playerState.repeat === 'off'
        ? 'all'
        : playerState.repeat === 'all'
        ? 'one'
        : 'off';
    setPlayerState((prev) => ({ ...prev, repeat: nextMode }));
  };

  // Quick Scene Toggle Button in Header
  const handleToggleTimeQuick = () => {
    const sequence: TimeOfDay[] = ['dawn', 'day', 'evening', 'night'];
    const nextIdx = (sequence.indexOf(currentTimeOfDay) + 1) % sequence.length;
    const nextScene = sequence[nextIdx];
    setSettings((prev) => ({ ...prev, timeMode: nextScene }));
    setCurrentTimeOfDay(nextScene);
  };

  // Quick Theme Cycle Button in Header
  const handleCycleTheme = () => {
    const themeSequence: ThemeMode[] = [
      'vintage',
      'dark_vintage',
      'midnight_velvet',
      'emerald_garden',
      'monsoon_slate',
      'rose_sunset',
    ];
    const nextIdx = (themeSequence.indexOf(settings.theme) + 1) % themeSequence.length;
    const nextTheme = themeSequence[nextIdx];
    setSettings((prev) => ({ ...prev, theme: nextTheme }));
  };

  // Playlist Management
  const handleAddSong = (newSong: Song) => {
    setSongs((prev) => [newSong, ...prev]);
    // Auto-select newly added song
    handlePlaySong(newSong, true);
  };

  const handleRemoveSong = (songId: string) => {
    setSongs((prev) => {
      const updated = prev.filter((s) => s.id !== songId);
      if (playerState.currentSongId === songId && updated.length > 0) {
        handlePlaySong(updated[0], playerState.isPlaying);
      }
      return updated;
    });
  };

  const handleMoveSong = (fromIndex: number, toIndex: number) => {
    setSongs((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  };

  // Keyboard Shortcuts (Space for Play/Pause, Arrow keys for Skip)
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      // Ignore if user is typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (playerStateRef.current.isPlaying) {
          handlePause();
        } else {
          handlePlay();
        }
      } else if (e.code === 'ArrowRight' && e.shiftKey) {
        e.preventDefault();
        handleNextSong();
      } else if (e.code === 'ArrowLeft' && e.shiftKey) {
        e.preventDefault();
        handlePreviousSong();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [handleNextSong, handlePreviousSong]);

  return (
    <div
      id="app-root-wrapper"
      className="relative min-h-screen flex flex-col font-['Plus_Jakarta_Sans'] select-none overflow-x-hidden"
    >
      {/* Loading Screen on Initial Entry */}
      {isLoadingApp && (
        <LoadingScreen onComplete={() => setIsLoadingApp(false)} />
      )}

      {/* Dynamic 4-State Day-to-Night Background Scene */}
      <BackgroundScene
        timeOfDay={currentTimeOfDay}
        weather={settings.weatherMode}
        animationLevel={settings.animationLevel}
        isPlaying={playerState.isPlaying}
      />

      {/* Animated Tea Stall Decor (Bulb, Steam, Slate board) */}
      <TeaStallDecor
        timeOfDay={currentTimeOfDay}
        animationLevel={settings.animationLevel}
        isPlaying={playerState.isPlaying}
      />

      {/* Tea Stall Soundscape Synthesizer */}
      <TeaStallAmbiencePlayer settings={settings} />

      {/* Main Music Stage - Docked elegantly at the bottom to keep background scenery fully visible */}
      <main className="relative flex-1 flex flex-col items-center justify-end pb-3 sm:pb-5 px-2 sm:px-6 z-10">
        {/* Error notification banner if third-party stream issues arise */}
        {playerState.hasError && playerState.errorMessage && (
          <div className="mb-3 px-4 py-2 rounded-xl bg-rose-950/90 border border-rose-600/60 text-rose-200 text-xs sm:text-sm backdrop-blur-md shadow-lg animate-fadeIn flex items-center space-x-2">
            <span>☕ {playerState.errorMessage}</span>
          </div>
        )}

        {/* Vintage Radio Music Player */}
        <MusicPlayer
          song={currentSong}
          playerState={playerState}
          timeOfDay={currentTimeOfDay}
          settings={settings}
          onPlay={handlePlay}
          onPause={handlePause}
          onNext={handleNextSong}
          onPrevious={handlePreviousSong}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
          onToggleShuffle={handleToggleShuffle}
          onToggleRepeat={handleToggleRepeat}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenPlaylist={() => setIsPlaylistOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </main>

      {/* Bottom Footer Note */}
      <footer className="relative z-10 py-2.5 px-4 text-center text-[11px] text-amber-200/60 font-['Cormorant_Garamond'] border-t border-amber-900/20 bg-black/30 backdrop-blur-sm">
        <span>चाय की चुस्की और पुराने गीतों का सुहाना सफ़र • Ad-Free Vintage Indian Music Experience</span>
      </footer>

      {/* Playlist Drawer Panel */}
      <PlaylistDrawer
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        songs={songs}
        currentSongId={playerState.currentSongId}
        isPlaying={playerState.isPlaying}
        settings={settings}
        onSelectSong={(id) => {
          const s = songs.find((item) => item.id === id);
          if (s) handlePlaySong(s, true);
        }}
        onRemoveSong={handleRemoveSong}
        onMoveSong={handleMoveSong}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onUpdateSongs={(newSongs) => {
          setSongs(newSongs);
          if (newSongs.length > 0 && !newSongs.find((s) => s.id === playerState.currentSongId)) {
            handlePlaySong(newSongs[0], false);
          }
        }}
      />

      {/* Add Song Modal */}
      <AddSongModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSong={handleAddSong}
        settings={settings}
      />

      {/* Experience & Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onResetClassics={() => {
          setSongs(DEFAULT_VINTAGE_SONGS);
          handlePlaySong(DEFAULT_VINTAGE_SONGS[0], false);
        }}
      />
    </div>
  );
}
