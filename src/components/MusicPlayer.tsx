import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Volume2,
  VolumeX,
  Plus,
  Radio,
  Sparkles,
  Disc3,
  ListMusic,
  Sliders,
} from 'lucide-react';
import { Song, PlayerState, TimeOfDay, AppSettings } from '../types/music';
import { formatTime } from '../utils/timeOfDay';
import { THEME_PRESETS } from '../utils/themes';

interface Props {
  song: Song | null;
  playerState: PlayerState;
  timeOfDay: TimeOfDay;
  settings: AppSettings;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onOpenAddModal: () => void;
  onOpenPlaylist: () => void;
  onOpenSettings?: () => void;
}

export const MusicPlayer: React.FC<Props> = ({
  song,
  playerState,
  timeOfDay,
  settings,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  onOpenAddModal,
  onOpenPlaylist,
  onOpenSettings,
}) => {
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubValue, setScrubValue] = useState(0);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Equalizer visualizer bars simulation
  const [eqLevels, setEqLevels] = useState<number[]>([40, 65, 80, 50, 70, 90, 60, 45, 75, 55]);

  useEffect(() => {
    if (!playerState.isPlaying || settings.animationLevel === 'off') {
      setEqLevels([15, 20, 25, 20, 30, 25, 20, 15, 25, 20]);
      return;
    }

    const interval = setInterval(() => {
      setEqLevels((prev) =>
        prev.map(() => Math.floor(Math.random() * 75) + 25)
      );
    }, 120);

    return () => clearInterval(interval);
  }, [playerState.isPlaying, settings.animationLevel]);

  // Handle Seek scrubbing
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setScrubValue(val);
  };

  const handleSeekStart = () => {
    setIsScrubbing(true);
    setScrubValue(playerState.progress);
  };

  const handleSeekEnd = () => {
    setIsScrubbing(false);
    onSeek(scrubValue);
  };

  const currentDisplayTime = isScrubbing ? scrubValue : playerState.progress;
  const totalDuration = playerState.duration || song?.duration || 0;
  const progressPercent = totalDuration > 0 ? (currentDisplayTime / totalDuration) * 100 : 0;
  const currentThemeConfig = THEME_PRESETS[settings.theme] || THEME_PRESETS.vintage;

  return (
    <div
      id="vintage-music-player-container"
      className="w-full max-w-5xl mx-auto px-2 sm:px-4 z-20"
    >
      {/* Hidden YouTube Iframe Mount Target */}
      <div
        id="youtube-player-mount"
        className="fixed -top-[9999px] -left-[9999px] w-1 h-1 pointer-events-none opacity-0"
        aria-hidden="true"
      />

      {/* Main Slim Vintage Radio Player Card at the bottom */}
      <div
        id="vintage-radio-card"
        className={`relative overflow-hidden rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 border backdrop-blur-xl transition-all duration-500 shadow-2xl mx-auto w-full sm:w-[550px] sm:h-[104px] flex flex-col justify-between ${
          currentThemeConfig.playerCard
        } ${playerState.isPlaying ? currentThemeConfig.playerGlow : ''}`}
      >
        {/* Vintage Radio Wood Grain & Texture Rim */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-950/20 pointer-events-none" />

        {/* Top Slim Progress Bar across entire card */}
        <div className="relative w-full mb-2" ref={progressBarRef}>
          <div className="relative group flex items-center">
            <input
              id="player-seek-slider"
              type="range"
              min="0"
              max={totalDuration > 0 ? totalDuration : 100}
              step="1"
              value={currentDisplayTime}
              onChange={handleSeekChange}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              disabled={!song}
              aria-label="Song seek slider"
              className="w-full h-1.5 bg-stone-950/80 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400/60 transition-all hover:h-2"
              style={{
                background: `linear-gradient(to right, ${currentThemeConfig.accentColor} ${progressPercent}%, rgba(20, 10, 8, 0.95) ${progressPercent}%)`,
                accentColor: currentThemeConfig.accentColor,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-amber-300/70 pt-0.5 px-0.5">
            <span>{formatTime(currentDisplayTime)}</span>
            <span className="hidden sm:inline text-amber-400/50 font-['Yatra_One'] text-[9px]">
              RADIO CHAI 98.4 FM • {timeOfDay.toUpperCase()}
            </span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Horizontal Slim Content Grid */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
          {/* Left: Compact Album Art & Song Info */}
          <div className="flex items-center space-x-3 w-full sm:w-auto min-w-0 sm:max-w-xs md:max-w-sm flex-1">
            {/* Small Vinyl Art (44x44px) */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden border border-amber-900/70 bg-stone-950 flex-shrink-0 shadow-md">
              {song?.thumbnail ? (
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-950 to-stone-950 text-amber-400">
                  <Disc3 className="w-5 h-5 animate-spin-slow" />
                </div>
              )}
              {/* Spinning Vinyl Overlay when playing */}
              {playerState.isPlaying && (
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                  <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping opacity-75" />
                </div>
              )}
            </div>

            {/* Title & Artist Text */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    playerState.isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-stone-600'
                  }`}
                />
                <h2
                  id="now-playing-title"
                  className="font-['Playfair_Display'] text-xs sm:text-sm font-bold text-amber-100 truncate drop-shadow-sm"
                  title={song?.title || 'No song selected'}
                >
                  {song?.title || 'रेडियो शांत है (Select a song)'}
                </h2>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-300/80 truncate font-['Plus_Jakarta_Sans'] pl-3">
                {song ? (
                  <>
                    <span>{song.artist}</span>
                    {song.albumOrMovie && (
                      <span className="hidden md:inline text-stone-400 font-['Cormorant_Garamond']">
                        {' '}
                        • {song.albumOrMovie}
                      </span>
                    )}
                  </>
                ) : (
                  'Click Playlist or Add Song'
                )}
              </p>
            </div>
          </div>

          {/* Center: Slim Playback Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
            {/* Shuffle */}
            <button
              id="player-shuffle-btn"
              onClick={onToggleShuffle}
              aria-label="Toggle shuffle"
              title={`Shuffle: ${playerState.shuffle ? 'On' : 'Off'}`}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                playerState.shuffle
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-stone-400 hover:text-amber-200'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            {/* Previous */}
            <button
              id="player-previous-btn"
              onClick={onPrevious}
              disabled={!song}
              aria-label="Previous song"
              title="Previous Song (Shift + Left)"
              className="p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 text-amber-200 border border-amber-900/60 shadow-sm transition-all active:scale-95 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            {/* Compact Master Play / Pause Button (40x40) */}
            <button
              id="player-play-pause-btn"
              onClick={playerState.isPlaying ? onPause : onPlay}
              disabled={!song}
              aria-label={playerState.isPlaying ? 'Pause song' : 'Play song'}
              title={playerState.isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              className={`relative group w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 ${
                playerState.isPlaying
                  ? 'bg-gradient-to-b from-amber-400 to-amber-600 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                  : 'bg-gradient-to-b from-amber-500 to-amber-700 text-stone-950 hover:from-amber-400 hover:to-amber-600'
              }`}
            >
              <div className="absolute inset-0.5 rounded-full border border-amber-200/30 pointer-events-none" />
              {playerState.isPlaying ? (
                <Pause className="w-5 h-5 fill-current stroke-[2.5]" />
              ) : (
                <Play className="w-5 h-5 fill-current stroke-[2.5] ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              id="player-next-btn"
              onClick={onNext}
              disabled={!song}
              aria-label="Next song"
              title="Next Song (Shift + Right)"
              className="p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 text-amber-200 border border-amber-900/60 shadow-sm transition-all active:scale-95 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Right: Volume, Mini Visualizer & Quick Actions */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-3 w-full sm:w-auto flex-1">
            {/* Mini Equalizer */}
            {settings.showVisualizer && (
              <div className="hidden lg:flex items-end space-x-0.5 h-5 px-1.5 py-0.5 rounded bg-black/40 border border-amber-900/30">
                {eqLevels.slice(0, 6).map((lvl, idx) => (
                  <span
                    key={idx}
                    className="w-1 rounded-t-sm bg-amber-400/90 transition-all duration-100"
                    style={{ height: `${lvl}%` }}
                  />
                ))}
              </div>
            )}

            {/* Volume Control Slider */}
            <div className="flex items-center space-x-1.5">
              <button
                id="player-volume-mute-btn"
                onClick={onToggleMute}
                aria-label={playerState.isMuted ? 'Unmute volume' : 'Mute volume (M)'}
                className="text-amber-300 hover:text-amber-100 transition-colors p-1 cursor-pointer"
              >
                {playerState.isMuted || playerState.volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
              <input
                id="player-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={playerState.isMuted ? 0 : playerState.volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                aria-label="Volume slider"
                className="w-14 sm:w-16 h-1 bg-stone-950 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
              />
            </div>

            {/* Quick Playlist Drawer Button */}
            <button
              id="player-open-playlist-btn"
              onClick={onOpenPlaylist}
              aria-label="Open playlist drawer"
              title="View Playlist"
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-800/50 text-amber-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <ListMusic className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Playlist</span>
            </button>

            {/* Quick Add Song Button */}
            <button
              id="player-open-add-song-btn"
              onClick={onOpenAddModal}
              aria-label="Add a song"
              title="Add Song"
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
              <span className="hidden md:inline">Add</span>
            </button>

            {/* Settings Button */}
            {onOpenSettings && (
              <button
                id="player-open-settings-btn"
                onClick={onOpenSettings}
                aria-label="Open Settings"
                title="Settings & Audio Customization"
                className="p-1 rounded-lg text-stone-400 hover:text-amber-200 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
