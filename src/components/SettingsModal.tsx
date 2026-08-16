import React from 'react';
import {
  X,
  Sliders,
  Sun,
  Moon,
  Sunset,
  Sunrise,
  CloudRain,
  CloudFog,
  Sparkles,
  Volume2,
  Tv,
  RotateCcw,
} from 'lucide-react';
import { AppSettings, TimeMode, WeatherMode, AnimationLevel, ThemeMode } from '../types/music';
import { THEME_PRESETS } from '../utils/themes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onResetClassics: () => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetClassics,
}) => {
  if (!isOpen) return null;

  const handleTimeChange = (mode: TimeMode) => {
    onUpdateSettings({ ...settings, timeMode: mode });
  };

  const handleWeatherChange = (weather: WeatherMode) => {
    onUpdateSettings({ ...settings, weatherMode: weather });
  };

  const handleAnimationChange = (lvl: AnimationLevel) => {
    onUpdateSettings({ ...settings, animationLevel: lvl });
  };

  const handleThemeChange = (theme: ThemeMode) => {
    onUpdateSettings({ ...settings, theme });
  };

  const currentThemeConfig = THEME_PRESETS[settings.theme] || THEME_PRESETS.vintage;

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div
        id="settings-modal-card"
        className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border shadow-2xl p-6 sm:p-7 transition-all ${currentThemeConfig.playerCard}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-900/50 mb-5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-600/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="settings-modal-title"
                className="font-['Playfair_Display'] text-xl font-bold text-amber-100"
              >
                Tea Stall & Experience Settings
              </h2>
              <p className="text-xs font-['Yatra_One'] text-amber-400/80">
                माहौल और अनुभव सेटिंग्स ☕
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-2 rounded-full text-stone-400 hover:text-amber-200 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-xs sm:text-sm">
          {/* Time of Day Environment Selector */}
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 font-mono">
              Day & Night Environment (समय का माहौल)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'auto', label: 'Auto (Real-time)', icon: Sparkles },
                { id: 'dawn', label: 'Dawn (भोर)', icon: Sunrise },
                { id: 'day', label: 'Day (दोपहर)', icon: Sun },
                { id: 'evening', label: 'Evening (शाम)', icon: Sunset },
                { id: 'night', label: 'Night (रात)', icon: Moon },
              ].map((item) => {
                const isSelected = settings.timeMode === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTimeChange(item.id as TimeMode)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600 text-stone-950 border-amber-400 font-bold shadow-md'
                        : 'bg-stone-950/60 border-amber-900/40 text-stone-300 hover:bg-stone-900 hover:text-amber-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px]">{item.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weather / Atmosphere Mode */}
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 font-mono">
              Weather Atmosphere (मौसम)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'clear', label: 'Clear Sky', icon: Sun },
                { id: 'rain', label: 'Light Rain', icon: CloudRain },
                { id: 'mist', label: 'Morning Mist', icon: CloudFog },
                { id: 'golden_haze', label: 'Golden Haze', icon: Sunset },
              ].map((item) => {
                const isSelected = settings.weatherMode === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleWeatherChange(item.id as WeatherMode)}
                    className={`p-2.5 rounded-xl border flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600 text-stone-950 border-amber-400 font-bold shadow-md'
                        : 'bg-stone-950/60 border-amber-900/40 text-stone-300 hover:bg-stone-900 hover:text-amber-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tea Stall Sound Ambiance Synthesizer */}
          <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-amber-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-200 flex items-center space-x-1.5">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Roadside Tea Stall Ambience</span>
              </span>
              <span className="text-[10px] text-amber-400/80 font-mono">
                {Math.round(settings.ambienceVolume * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'stall_simmer', label: 'Kettle Simmer' },
                { id: 'evening_crickets', label: 'Night Crickets' },
                { id: 'morning_birds', label: 'Dawn Birds' },
                { id: 'monsoon_rain', label: 'Monsoon Rain' },
                { id: 'off', label: 'Off / Mute' },
              ].map((amb) => (
                <button
                  key={amb.id}
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      ambienceType: amb.id as any,
                    })
                  }
                  className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors border cursor-pointer ${
                    settings.ambienceType === amb.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-semibold'
                      : 'bg-stone-900/50 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {amb.label}
                </button>
              ))}
            </div>

            {settings.ambienceType !== 'off' && (
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-[11px] text-stone-400 font-mono">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.ambienceVolume}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      ambienceVolume: parseFloat(e.target.value),
                    })
                  }
                  className="w-full h-1.5 bg-stone-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            )}
          </div>

          {/* Theme / Palette Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
              Visual Theme & Radio Finish (थीम और रेडियो शैली)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'vintage',
                  name: 'Vintage Teak',
                  hindi: 'विंटेज टीक',
                  color: 'bg-amber-900 border-amber-600',
                  accent: 'text-amber-400',
                },
                {
                  id: 'dark_vintage',
                  name: 'Antique Charcoal',
                  hindi: 'एंटीक चारकोल',
                  color: 'bg-stone-900 border-stone-600',
                  accent: 'text-amber-300',
                },
                {
                  id: 'midnight_velvet',
                  name: 'Midnight Velvet',
                  hindi: 'मध्यरात्रि मखमल',
                  color: 'bg-indigo-950 border-indigo-500',
                  accent: 'text-sky-300',
                },
                {
                  id: 'emerald_garden',
                  name: 'Emerald Garden',
                  hindi: 'चाय बागान',
                  color: 'bg-emerald-950 border-emerald-500',
                  accent: 'text-emerald-300',
                },
                {
                  id: 'monsoon_slate',
                  name: 'Monsoon Slate',
                  hindi: 'मॉनसून स्लेट',
                  color: 'bg-slate-900 border-cyan-500',
                  accent: 'text-cyan-300',
                },
                {
                  id: 'rose_sunset',
                  name: 'Gulabi Dusk',
                  hindi: 'गुलाबी शाम',
                  color: 'bg-rose-950 border-rose-500',
                  accent: 'text-rose-300',
                },
              ].map((th) => {
                const isSelected = settings.theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => handleThemeChange(th.id as ThemeMode)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-amber-400 bg-amber-600/20 border-amber-400 font-semibold shadow-md'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-900 hover:border-amber-900/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full border ${th.color}`} />
                      <span className="text-xs font-medium text-amber-100">{th.name}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-['Yatra_One']">{th.hindi}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Animation & Graphics Options */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
              Animation & Visuals
            </label>

            <div className="flex items-center justify-between">
              <span className="text-stone-300">Background Movement & Steam</span>
              <div className="flex space-x-1.5">
                {(['full', 'reduced', 'off'] as AnimationLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleAnimationChange(lvl)}
                    className={`px-2.5 py-1 rounded-lg text-xs capitalize cursor-pointer border ${
                      settings.animationLevel === lvl
                        ? 'bg-amber-600 text-stone-950 font-bold border-amber-400'
                        : 'bg-stone-900 border-stone-800 text-stone-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-stone-300">Analog Equalizer Visualizer</span>
              <button
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    showVisualizer: !settings.showVisualizer,
                  })
                }
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                  settings.showVisualizer
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-stone-900 text-stone-400 border-stone-800'
                }`}
              >
                {settings.showVisualizer ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Reset / Restore Defaults */}
          <div className="pt-3 border-t border-amber-900/50 flex justify-between items-center">
            <button
              onClick={() => {
                onResetClassics();
                onClose();
              }}
              className="flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default Indian Classics</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Done (पूर्ण)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
