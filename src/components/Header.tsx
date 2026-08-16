import React, { useState } from 'react';
import {
  Radio,
  ListMusic,
  Plus,
  Sliders,
  Sun,
  Moon,
  Sunset,
  Sunrise,
  Palette,
  Menu,
  X,
} from 'lucide-react';
import { TimeOfDay, AppSettings } from '../types/music';
import { THEME_PRESETS } from '../utils/themes';

interface Props {
  timeOfDay: TimeOfDay;
  playlistCount: number;
  settings: AppSettings;
  onOpenPlaylist: () => void;
  onOpenAddModal: () => void;
  onOpenSettings: () => void;
  onToggleTimeQuick: () => void;
  onQuickCycleTheme?: () => void;
}

export const Header: React.FC<Props> = ({
  timeOfDay,
  playlistCount,
  settings,
  onOpenPlaylist,
  onOpenAddModal,
  onOpenSettings,
  onToggleTimeQuick,
  onQuickCycleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentThemeConfig = THEME_PRESETS[settings.theme] || THEME_PRESETS.vintage;

  const TimeIcon =
    timeOfDay === 'dawn'
      ? Sunrise
      : timeOfDay === 'day'
      ? Sun
      : timeOfDay === 'evening'
      ? Sunset
      : Moon;

  return (
    <header
      id="main-app-header"
      className={`relative z-30 w-full px-4 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between border-b backdrop-blur-md transition-all duration-500 ${currentThemeConfig.headerBg}`}
    >
      {/* Left: Vintage Brand / Logo */}
      <div className="flex items-center space-x-3">
        {/* Tea Cup & Radio Wave Visual */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 border border-amber-500/40 flex items-center justify-center shadow-lg text-amber-100 flex-shrink-0">
          <Radio className="w-5 h-5 text-amber-200" />
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-['Yatra_One'] text-base sm:text-lg text-amber-200 tracking-wider">
              CHAI & GAANA
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/50 text-[10px] font-mono text-amber-300">
              {currentThemeConfig.name}
            </span>
          </div>
          <p className="font-['Cormorant_Garamond'] text-xs sm:text-sm text-stone-300 italic tracking-wide">
            Purane gaane, purani yaadein • 100% Ad-Free
          </p>
        </div>
      </div>

      {/* Right Desktop Nav */}
      <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-2.5">
        {/* Quick Theme Switcher Button */}
        {onQuickCycleTheme && (
          <button
            id="header-quick-theme-btn"
            onClick={onQuickCycleTheme}
            title={`Theme: ${currentThemeConfig.name} (Click to switch theme)`}
            aria-label="Switch visual theme"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-950/60 hover:bg-stone-900 border border-amber-900/50 text-amber-200 text-xs font-mono transition-colors cursor-pointer hover:border-amber-400/50"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">{currentThemeConfig.name.split(' ')[0]}</span>
          </button>
        )}

        {/* Time of Day Toggle Badge */}
        <button
          id="header-time-toggle-btn"
          onClick={onToggleTimeQuick}
          title={`Current Scene: ${timeOfDay.toUpperCase()} (Click to toggle scene)`}
          aria-label="Toggle time of day scene"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-950/60 hover:bg-stone-900 border border-amber-900/50 text-amber-300 text-xs font-mono transition-colors cursor-pointer"
        >
          <TimeIcon className="w-3.5 h-3.5 text-amber-400" />
          <span className="capitalize">{timeOfDay}</span>
        </button>

        {/* Playlist Button */}
        <button
          id="header-playlist-btn"
          onClick={onOpenPlaylist}
          aria-label="Open playlist drawer"
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-stone-950/60 hover:bg-stone-900 border border-amber-900/40 text-amber-100 text-xs font-medium transition-colors cursor-pointer"
        >
          <ListMusic className="w-4 h-4 text-amber-400" />
          <span>Playlist</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-900/60 text-amber-300 text-[10px] font-mono">
            {playlistCount}
          </span>
        </button>

        {/* Add Song Button */}
        <button
          id="header-add-song-btn"
          onClick={onOpenAddModal}
          aria-label="Add a song to playlist"
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Song</span>
        </button>

        {/* Settings Button */}
        <button
          id="header-settings-btn"
          onClick={onOpenSettings}
          aria-label="Open settings"
          title="Settings & Atmosphere"
          className="p-2 rounded-xl bg-stone-950/60 hover:bg-stone-900 border border-amber-900/40 text-stone-300 hover:text-amber-200 transition-colors cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </nav>

      {/* Mobile Hamburger Toggle */}
      <div className="flex md:hidden items-center space-x-2">
        {onQuickCycleTheme && (
          <button
            onClick={onQuickCycleTheme}
            aria-label="Switch theme"
            className="p-2 rounded-lg bg-stone-900 border border-amber-900/40 text-amber-300 text-xs flex items-center"
          >
            <Palette className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onOpenPlaylist}
          aria-label="Open playlist"
          className="p-2 rounded-lg bg-stone-900 border border-amber-900/40 text-amber-300 text-xs flex items-center space-x-1"
        >
          <ListMusic className="w-4 h-4" />
          <span className="text-[10px] font-mono font-bold">{playlistCount}</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          className="p-2 rounded-lg bg-stone-900 border border-amber-900/40 text-amber-200"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="absolute top-full left-0 right-0 p-4 bg-[#180e0a]/95 border-b border-amber-900/50 backdrop-blur-xl shadow-2xl md:hidden flex flex-col space-y-2.5 z-40 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-2 border-b border-amber-900/30">
            <span className="text-xs font-mono text-amber-400">THEME: {currentThemeConfig.name}</span>
            {onQuickCycleTheme && (
              <button
                onClick={() => {
                  onQuickCycleTheme();
                }}
                className="text-xs px-2.5 py-1 rounded bg-stone-900 border border-amber-900 text-amber-200"
              >
                Next Theme 🎨
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-amber-900/30">
            <span className="text-xs font-mono text-amber-400">ATMOSPHERE: {timeOfDay.toUpperCase()}</span>
            <button
              onClick={() => {
                onToggleTimeQuick();
                setMobileMenuOpen(false);
              }}
              className="text-xs px-2.5 py-1 rounded bg-stone-900 border border-amber-900 text-amber-200"
            >
              Change Scene ⛅
            </button>
          </div>

          <button
            onClick={() => {
              onOpenAddModal();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-amber-600 font-bold text-xs text-stone-950"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Song</span>
          </button>

          <button
            onClick={() => {
              onOpenSettings();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-stone-900 border border-amber-900/40 text-xs text-amber-200"
          >
            <Sliders className="w-4 h-4" />
            <span>Experience Settings</span>
          </button>
        </div>
      )}
    </header>
  );
};
