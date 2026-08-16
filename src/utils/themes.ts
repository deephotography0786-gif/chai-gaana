import { ThemeMode } from '../types/music';

export interface ThemeDefinition {
  id: ThemeMode;
  name: string;
  hindiName: string;
  description: string;
  previewGradient: string;
  playerCard: string;
  playerBorder: string;
  playerGlow: string;
  accentColor: string;
  textPrimary: string;
  textSecondary: string;
  chipBg: string;
  headerBg: string;
}

export const THEME_PRESETS: Record<ThemeMode, ThemeDefinition> = {
  vintage: {
    id: 'vintage',
    name: 'Vintage Teak Wood',
    hindiName: 'विंटेज टीक वुड',
    description: 'Classic warm brass and deep mahogany radio grain',
    previewGradient: 'from-amber-700 via-amber-900 to-stone-950',
    playerCard: 'bg-[#20130d]/85 border-amber-800/40 text-[#fef3c7] shadow-[0_15px_40px_rgba(20,10,5,0.6)]',
    playerBorder: 'border-amber-800/40',
    playerGlow: 'ring-1 ring-amber-500/30 shadow-[0_0_30px_rgba(217,119,6,0.12)]',
    accentColor: '#f59e0b',
    textPrimary: 'text-amber-100',
    textSecondary: 'text-amber-300/80',
    chipBg: 'bg-amber-950/70 border-amber-800/50 text-amber-200',
    headerBg: 'bg-[#160d09]/75 border-amber-900/30',
  },
  dark_vintage: {
    id: 'dark_vintage',
    name: 'Antique Charcoal',
    hindiName: 'एंटीक चारकोल',
    description: 'Deep nocturnal espresso with warm amber filament lighting',
    previewGradient: 'from-stone-800 via-stone-900 to-black',
    playerCard: 'bg-[#150e0c]/90 border-amber-950/60 text-amber-50 shadow-[0_15px_40px_rgba(0,0,0,0.8)]',
    playerBorder: 'border-amber-950/60',
    playerGlow: 'ring-1 ring-amber-400/25 shadow-[0_0_30px_rgba(245,158,11,0.1)]',
    accentColor: '#fbbf24',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-amber-300/70',
    chipBg: 'bg-stone-950/80 border-amber-900/40 text-amber-200',
    headerBg: 'bg-[#0f0907]/85 border-amber-950/40',
  },
  midnight_velvet: {
    id: 'midnight_velvet',
    name: 'Midnight Velvet & Gold',
    hindiName: 'मध्यरात्रि मखमली और सोना',
    description: 'Deep royal sapphire indigo with warm golden accents',
    previewGradient: 'from-indigo-900 via-slate-900 to-stone-950',
    playerCard: 'bg-[#0a0f1d]/85 border-indigo-900/50 text-sky-50 shadow-[0_15px_40px_rgba(5,10,25,0.7)]',
    playerBorder: 'border-indigo-900/50',
    playerGlow: 'ring-1 ring-amber-400/40 shadow-[0_0_30px_rgba(251,191,36,0.15)]',
    accentColor: '#f59e0b',
    textPrimary: 'text-sky-50',
    textSecondary: 'text-amber-300/90',
    chipBg: 'bg-indigo-950/70 border-indigo-800/50 text-indigo-200',
    headerBg: 'bg-[#080d1a]/80 border-indigo-950/40',
  },
  emerald_garden: {
    id: 'emerald_garden',
    name: 'Darjeeling Tea Garden',
    hindiName: 'दार्जिलिंग चाय बागान',
    description: 'Lush organic emerald tea leaves with earthy bark accents',
    previewGradient: 'from-emerald-900 via-teal-950 to-stone-950',
    playerCard: 'bg-[#091811]/85 border-emerald-900/50 text-emerald-50 shadow-[0_15px_40px_rgba(4,20,12,0.7)]',
    playerBorder: 'border-emerald-900/50',
    playerGlow: 'ring-1 ring-emerald-400/30 shadow-[0_0_30px_rgba(52,211,153,0.15)]',
    accentColor: '#34d399',
    textPrimary: 'text-emerald-50',
    textSecondary: 'text-emerald-300/80',
    chipBg: 'bg-emerald-950/70 border-emerald-800/50 text-emerald-200',
    headerBg: 'bg-[#06140e]/80 border-emerald-950/40',
  },
  monsoon_slate: {
    id: 'monsoon_slate',
    name: 'Monsoon Chai Rain',
    hindiName: 'मॉनसून चाय बारिश',
    description: 'Cool rainy slate blue with warm steam accents',
    previewGradient: 'from-slate-800 via-cyan-950 to-stone-950',
    playerCard: 'bg-[#0e171e]/85 border-slate-700/50 text-slate-100 shadow-[0_15px_40px_rgba(8,15,22,0.7)]',
    playerBorder: 'border-slate-700/50',
    playerGlow: 'ring-1 ring-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.15)]',
    accentColor: '#38bdf8',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-cyan-200/80',
    chipBg: 'bg-slate-900/70 border-slate-700/50 text-slate-200',
    headerBg: 'bg-[#091016]/80 border-slate-800/40',
  },
  rose_sunset: {
    id: 'rose_sunset',
    name: 'Gulabi Sunset Chai',
    hindiName: 'गुलाबी शाम की चाय',
    description: 'Rich sunset terracotta rose with warm golden twilight',
    previewGradient: 'from-rose-900 via-amber-950 to-stone-950',
    playerCard: 'bg-[#1f0f14]/85 border-rose-900/40 text-rose-50 shadow-[0_15px_40px_rgba(25,10,16,0.7)]',
    playerBorder: 'border-rose-900/40',
    playerGlow: 'ring-1 ring-rose-400/30 shadow-[0_0_30px_rgba(251,113,133,0.15)]',
    accentColor: '#fb7185',
    textPrimary: 'text-rose-50',
    textSecondary: 'text-amber-200/85',
    chipBg: 'bg-rose-950/70 border-rose-900/50 text-rose-200',
    headerBg: 'bg-[#180b10]/80 border-rose-950/40',
  },
};
