import { TimeOfDay, TimeMode } from '../types/music';

export function getSystemTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) {
    return 'dawn';
  } else if (hour >= 9 && hour < 16) {
    return 'day';
  } else if (hour >= 16 && hour < 19) {
    return 'evening';
  } else {
    return 'night';
  }
}

export function resolveTimeOfDay(mode: TimeMode): TimeOfDay {
  if (mode === 'auto') {
    return getSystemTimeOfDay();
  }
  return mode;
}

export interface TimeStateInfo {
  label: string;
  hindiLabel: string;
  timeRange: string;
  description: string;
  themeColor: string;
  accentColor: string;
  skyGlow: string;
  kettleSteamOpacity: number;
  bulbIntensity: number;
}

export const TIME_STATE_INFO: Record<TimeOfDay, TimeStateInfo> = {
  dawn: {
    label: 'Dawn (भोर)',
    hindiLabel: 'ताज़ा भोर की चाय',
    timeRange: '05:00 – 09:00',
    description: 'Soft pink morning rays, birds singing, gentle kettle steam.',
    themeColor: '#47281f',
    accentColor: '#f59e0b',
    skyGlow: 'from-amber-200/20 via-pink-300/10 to-transparent',
    kettleSteamOpacity: 0.85,
    bulbIntensity: 0.3,
  },
  day: {
    label: 'Midday (दोपहर)',
    hindiLabel: 'धूप और गर्मागर्म चाय',
    timeRange: '09:00 – 16:00',
    description: 'Golden sun through banyan tree leaves, lively roadside chatter.',
    themeColor: '#362016',
    accentColor: '#d97706',
    skyGlow: 'from-amber-100/30 via-yellow-200/10 to-transparent',
    kettleSteamOpacity: 0.6,
    bulbIntensity: 0.05,
  },
  evening: {
    label: 'Evening (शाम)',
    hindiLabel: 'शाम की सुनहरी महफ़िल',
    timeRange: '16:00 – 19:00',
    description: 'Golden hour sunset, long shadows, roadside bulb turning on.',
    themeColor: '#2b1610',
    accentColor: '#f97316',
    skyGlow: 'from-orange-500/25 via-rose-500/15 to-transparent',
    kettleSteamOpacity: 0.9,
    bulbIntensity: 0.7,
  },
  night: {
    label: 'Night (रात)',
    hindiLabel: 'सन्नाटा, बल्ब और पुराने नगमे',
    timeRange: '19:00 – 05:00',
    description: 'Deep navy skies, crescent moon, glowing warm yellow bulb.',
    themeColor: '#170c08',
    accentColor: '#fbbf24',
    skyGlow: 'from-blue-950/40 via-amber-500/10 to-transparent',
    kettleSteamOpacity: 0.95,
    bulbIntensity: 1.0,
  },
};

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
