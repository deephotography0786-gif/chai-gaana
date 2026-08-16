import React, { useState, useRef } from 'react';
import {
  X,
  Play,
  Trash2,
  ChevronUp,
  ChevronDown,
  Download,
  Upload,
  Search,
  RotateCcw,
  Sparkles,
  Plus,
  Radio,
} from 'lucide-react';
import { Song, AppSettings } from '../types/music';
import { formatTime } from '../utils/timeOfDay';
import { StorageService } from '../services/storageService';
import { DEFAULT_VINTAGE_SONGS, PRESET_THEMES_COLLECTIONS } from '../data/defaultSongs';
import { THEME_PRESETS } from '../utils/themes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  currentSongId: string | null;
  isPlaying: boolean;
  settings: AppSettings;
  onSelectSong: (songId: string) => void;
  onRemoveSong: (songId: string) => void;
  onMoveSong: (fromIndex: number, toIndex: number) => void;
  onOpenAddModal: () => void;
  onUpdateSongs: (newSongs: Song[]) => void;
}

export const PlaylistDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  songs,
  currentSongId,
  isPlaying,
  settings,
  onSelectSong,
  onRemoveSong,
  onMoveSong,
  onOpenAddModal,
  onUpdateSongs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const filteredSongs = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Export Playlist
  const handleExport = () => {
    try {
      const json = StorageService.exportPlaylistJson(songs);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chai-and-gaana-playlist-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('Playlist exported successfully 💾');
    } catch {
      showNotification('Failed to export playlist.');
    }
  };

  // Import Playlist
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = StorageService.validateAndImportPlaylistJson(content);
        if (res.success && res.songs) {
          onUpdateSongs(res.songs);
          showNotification(`Imported ${res.songs.length} songs successfully ☕`);
        } else {
          showNotification(res.error || 'Failed to parse playlist file.');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Restore Default Classics
  const handleRestoreDefaults = () => {
    if (confirm('Restore the default curated vintage Indian classic songs?')) {
      onUpdateSongs(DEFAULT_VINTAGE_SONGS);
      showNotification('Restored timeless classic songs 🎵');
    }
  };

  // Clear Playlist
  const handleClearAll = () => {
    if (confirm('Clear all songs from your playlist?')) {
      onUpdateSongs([]);
      showNotification('Playlist cleared.');
    }
  };

  const currentThemeConfig = THEME_PRESETS[settings.theme] || THEME_PRESETS.vintage;

  return (
    <div
      id="playlist-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        id="playlist-drawer-panel"
        className={`relative w-full max-w-lg h-full flex flex-col border-l shadow-2xl overflow-hidden transition-all ${currentThemeConfig.playerCard}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-amber-900/50 flex items-center justify-between bg-black/30">
          <div>
            <div className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-amber-400" />
              <h2 className="font-['Playfair_Display'] text-xl font-bold text-amber-200">
                Tonight's Chai Playlist
              </h2>
            </div>
            <p className="text-xs font-['Yatra_One'] text-amber-400/80 mt-0.5">
              आज की चाय प्लेलिस्ट • {songs.length} नगमे (Songs)
            </p>
          </div>

          <button
            id="close-playlist-drawer-btn"
            onClick={onClose}
            aria-label="Close playlist"
            className="p-2 rounded-full text-stone-400 hover:text-amber-200 hover:bg-stone-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification Toast */}
        {statusMessage && (
          <div className="bg-amber-500/20 text-amber-200 text-xs px-4 py-2 text-center border-b border-amber-500/30 flex items-center justify-center space-x-2 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Action Toolbar & Search */}
        <div className="p-4 border-b border-amber-900/40 space-y-3 bg-stone-950/40">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-amber-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by song name, singer (Kishore, Lata...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search playlist songs"
              className="w-full pl-9 pr-4 py-2 bg-stone-900/80 border border-amber-900/50 rounded-xl text-xs sm:text-sm text-amber-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Song</span>
            </button>

            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportFile}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Import playlist JSON"
                className="p-1.5 rounded-lg bg-stone-900 border border-amber-900/50 text-amber-200 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                onClick={handleExport}
                title="Export playlist JSON"
                className="p-1.5 rounded-lg bg-stone-900 border border-amber-900/50 text-amber-200 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleRestoreDefaults}
                title="Restore vintage classics"
                className="p-1.5 rounded-lg bg-stone-900 border border-amber-900/50 text-amber-200 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {songs.length > 0 && (
                <button
                  onClick={handleClearAll}
                  title="Clear all songs"
                  className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-900/50 text-rose-300 hover:bg-rose-900 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Songs List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
          {filteredSongs.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Radio className="w-12 h-12 text-stone-600 mx-auto" />
              <p className="text-sm font-['Playfair_Display'] text-amber-200">
                {searchQuery ? 'No songs match your search.' : 'Your playlist is empty.'}
              </p>
              <button
                onClick={onOpenAddModal}
                className="px-4 py-2 rounded-xl bg-amber-600 text-stone-950 font-semibold text-xs transition-transform active:scale-95 cursor-pointer"
              >
                Add an Old Favorite ☕
              </button>
            </div>
          ) : (
            filteredSongs.map((s, index) => {
              const isSelected = s.id === currentSongId;
              const originalIndex = songs.findIndex((orig) => orig.id === s.id);

              return (
                <div
                  key={s.id}
                  id={`playlist-item-${s.id}`}
                  className={`group relative flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all duration-300 ${
                    isSelected
                      ? 'bg-amber-950/70 border-amber-500/70 shadow-lg ring-1 ring-amber-500/30'
                      : 'bg-stone-950/50 border-amber-900/30 hover:bg-stone-900/70 hover:border-amber-800/60'
                  }`}
                >
                  {/* Left info: Index, Thumbnail, Title & Artist */}
                  <div
                    className="flex items-center space-x-3 min-w-0 flex-1 cursor-pointer"
                    onClick={() => onSelectSong(s.id)}
                  >
                    {/* Index or Live Equalizer */}
                    <div className="w-6 text-center text-xs font-mono font-bold text-amber-400/80 flex-shrink-0">
                      {isSelected && isPlaying ? (
                        <div className="flex items-end justify-center space-x-0.5 h-3">
                          <span className="w-1 bg-amber-400 rounded-t h-3 animate-pulse" />
                          <span className="w-1 bg-amber-300 rounded-t h-2 animate-bounce" />
                          <span className="w-1 bg-amber-500 rounded-t h-3 animate-pulse" />
                        </div>
                      ) : (
                        <span>{(index + 1).toString().padStart(2, '0')}</span>
                      )}
                    </div>

                    {/* Thumbnail */}
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-amber-900/40 bg-black flex-shrink-0">
                      {s.thumbnail ? (
                        <img
                          src={s.thumbnail}
                          alt={s.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-950 text-amber-400 text-[10px]">
                          ☕
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-4 h-4 text-amber-400 fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Titles */}
                    <div className="min-w-0 flex-1 pr-2">
                      <h4
                        className={`text-sm font-semibold truncate ${
                          isSelected ? 'text-amber-300 font-["Playfair_Display"]' : 'text-amber-100'
                        }`}
                        title={s.title}
                      >
                        {s.title}
                      </h4>
                      <p className="text-xs text-stone-400 truncate">{s.artist}</p>
                    </div>
                  </div>

                  {/* Right Actions: Duration, Reorder, Delete */}
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {s.duration && (
                      <span className="text-[11px] font-mono text-stone-400 hidden sm:inline mr-1">
                        {formatTime(s.duration)}
                      </span>
                    )}

                    {/* Reorder Buttons */}
                    <div className="flex flex-col">
                      <button
                        onClick={() => originalIndex > 0 && onMoveSong(originalIndex, originalIndex - 1)}
                        disabled={originalIndex === 0}
                        title="Move Up"
                        aria-label="Move song up in playlist"
                        className="p-1 text-stone-400 hover:text-amber-200 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          originalIndex < songs.length - 1 &&
                          onMoveSong(originalIndex, originalIndex + 1)
                        }
                        disabled={originalIndex === songs.length - 1}
                        title="Move Down"
                        aria-label="Move song down in playlist"
                        className="p-1 text-stone-400 hover:text-amber-200 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Delete Song */}
                    <button
                      onClick={() => onRemoveSong(s.id)}
                      title="Remove from playlist"
                      aria-label="Remove song"
                      className="p-2 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
