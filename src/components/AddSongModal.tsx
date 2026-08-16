import React, { useState, useEffect } from 'react';
import { X, Music2, Link as LinkIcon, Plus, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Song, AppSettings } from '../types/music';
import { parseAndValidateMediaUrl } from '../utils/validation';
import { THEME_PRESETS } from '../utils/themes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddSong: (song: Song) => void;
  settings: AppSettings;
}

const SAMPLE_VINTAGE_LINKS = [
  {
    title: 'Ek Ajnabee Haseena Se',
    artist: 'Kishore Kumar',
    url: 'https://www.youtube.com/watch?v=0k5fJb_sC7U',
    category: 'Kishore Kumar' as const,
  },
  {
    title: 'Ajeeb Dastan Hai Yeh',
    artist: 'Lata Mangeshkar',
    url: 'https://www.youtube.com/watch?v=D003O_b7wXU',
    category: 'Lata Mangeshkar' as const,
  },
  {
    title: 'Chaudhvin Ka Chand Ho',
    artist: 'Mohammed Rafi',
    url: 'https://www.youtube.com/watch?v=jWJqN3lM8xY',
    category: 'Mohammed Rafi' as const,
  },
];

export const AddSongModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAddSong,
  settings,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [artistInput, setArtistInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<Song['category']>('Custom');
  const [thumbnailInput, setThumbnailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-validate and parse URL when pasted
  useEffect(() => {
    if (!urlInput.trim()) {
      setErrorMsg(null);
      return;
    }

    const res = parseAndValidateMediaUrl(urlInput);
    if (!res.isValid) {
      setErrorMsg(res.errorMessage || 'Please enter a valid supported song link.');
    } else {
      setErrorMsg(null);
      if (res.thumbnailUrl && !thumbnailInput) {
        setThumbnailInput(res.thumbnailUrl);
      }
      if (res.suggestedTitle && !titleInput) {
        setTitleInput(res.suggestedTitle);
      }
    }
  }, [urlInput]);

  // Handle keyboard Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = parseAndValidateMediaUrl(urlInput);

    if (!res.isValid) {
      setErrorMsg(res.errorMessage || 'Please enter a valid supported song link.');
      return;
    }

    const finalTitle = titleInput.trim() || res.suggestedTitle || 'Nostalgic Melody';
    const finalArtist = artistInput.trim() || 'Classic Indian Melody';

    const newSong: Song = {
      id: `song-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: finalTitle,
      artist: finalArtist,
      url: res.cleanUrl,
      thumbnail: thumbnailInput.trim() || res.thumbnailUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
      addedAt: Date.now(),
      sourceType: res.sourceType,
      youtubeId: res.youtubeId,
      category: categoryInput,
    };

    onAddSong(newSong);
    setSuccessMsg('Song added to your chai playlist ☕');

    setTimeout(() => {
      setSuccessMsg(null);
      setUrlInput('');
      setTitleInput('');
      setArtistInput('');
      setThumbnailInput('');
      onClose();
    }, 1100);
  };

  const handleApplySample = (sample: typeof SAMPLE_VINTAGE_LINKS[0]) => {
    setUrlInput(sample.url);
    setTitleInput(sample.title);
    setArtistInput(sample.artist);
    setCategoryInput(sample.category);
  };

  const currentThemeConfig = THEME_PRESETS[settings.theme] || THEME_PRESETS.vintage;

  return (
    <div
      id="add-song-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-song-modal-title"
    >
      <div
        id="add-song-modal-card"
        className={`relative w-full max-w-lg rounded-2xl sm:rounded-3xl border shadow-2xl p-6 sm:p-8 overflow-hidden transition-all ${currentThemeConfig.playerCard}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Wood Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-900/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-600/20 border border-amber-600/40 text-amber-400">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="add-song-modal-title"
                className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold text-amber-100"
              >
                Add a Song to Your Chai Playlist
              </h2>
              <p className="text-xs font-['Yatra_One'] text-amber-400/80 mt-0.5">
                चाय प्लेलिस्ट में नया गाना जोड़ें ☕
              </p>
            </div>
          </div>

          <button
            id="close-add-song-modal-btn"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full text-stone-400 hover:text-amber-200 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback alerts */}
        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-xs sm:text-sm flex items-center space-x-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-600/50 text-rose-300 text-xs sm:text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Song URL */}
          <div>
            <label className="block text-xs font-medium text-amber-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Paste Song Link (YouTube or Direct Audio)</span>
              </span>
              <span className="text-[10px] text-amber-400/70 font-mono">Supported Format</span>
            </label>
            <input
              id="song-url-input"
              type="text"
              required
              placeholder="e.g. https://www.youtube.com/watch?v=... or .mp3 link"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-950/80 border border-amber-900/60 rounded-xl text-sm text-amber-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Quick Suggestions / Sample Vintage Links */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-stone-300 flex items-center space-x-1 font-['Cormorant_Garamond']">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Or try one of these timeless classics:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_VINTAGE_LINKS.map((sample) => (
                <button
                  key={sample.title}
                  type="button"
                  onClick={() => handleApplySample(sample)}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/40 text-[11px] text-amber-200 transition-colors cursor-pointer"
                >
                  + {sample.title} ({sample.artist})
                </button>
              ))}
            </div>
          </div>

          {/* Title & Artist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-amber-300 mb-1">
                Song Title (गाने का नाम)
              </label>
              <input
                id="song-title-input"
                type="text"
                placeholder="e.g. Pal Pal Dil Ke Paas"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-950/80 border border-amber-900/60 rounded-xl text-sm text-amber-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-amber-300 mb-1">
                Artist / Singer (गायक)
              </label>
              <input
                id="song-artist-input"
                type="text"
                placeholder="e.g. Kishore Kumar"
                value={artistInput}
                onChange={(e) => setArtistInput(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-950/80 border border-amber-900/60 rounded-xl text-sm text-amber-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          {/* Category / Era Tag */}
          <div>
            <label className="block text-xs font-medium text-amber-300 mb-1">
              Category / Mood Tag
            </label>
            <select
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value as any)}
              className="w-full px-3.5 py-2 bg-stone-950/80 border border-amber-900/60 rounded-xl text-sm text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="Custom">Custom / General</option>
              <option value="Kishore Kumar">Kishore Kumar Special</option>
              <option value="Lata Mangeshkar">Lata Mangeshkar Melody</option>
              <option value="Mohammed Rafi">Mohammed Rafi Gem</option>
              <option value="Mukesh">Mukesh Sahab</option>
              <option value="R.D. Burman">R.D. Burman Magic</option>
              <option value="Ghazals">Late Night Ghazal</option>
              <option value="Vintage 70s">Vintage 1970s</option>
            </select>
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-amber-900/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-stone-300 hover:text-amber-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-add-song-btn"
              type="submit"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add to Chai Playlist</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
