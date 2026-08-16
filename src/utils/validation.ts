import { SourceType } from '../types/music';

export interface ParsedMediaUrl {
  isValid: boolean;
  sourceType: SourceType;
  youtubeId?: string;
  cleanUrl: string;
  suggestedTitle?: string;
  suggestedArtist?: string;
  thumbnailUrl?: string;
  errorMessage?: string;
}

export function parseAndValidateMediaUrl(inputUrl: string): ParsedMediaUrl {
  const trimmed = inputUrl.trim();
  if (!trimmed) {
    return {
      isValid: false,
      sourceType: 'audio',
      cleanUrl: '',
      errorMessage: 'Please enter a valid song URL.',
    };
  }

  // Check for YouTube URL
  // Matches: youtube.com/watch?v=xxx, youtu.be/xxx, youtube.com/embed/xxx, youtube.com/shorts/xxx, music.youtube.com/watch?v=xxx
  const ytRegex = /(?:https?:\/\/)?(?:www\.|m\.|music\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const ytMatch = trimmed.match(ytRegex);

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      isValid: true,
      sourceType: 'youtube',
      youtubeId: videoId,
      cleanUrl: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // Check for Direct Audio streams (.mp3, .ogg, .wav, .m4a, .aac, .webm, internet archive)
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const pathname = parsed.pathname.toLowerCase();

    const isAudioFile =
      pathname.endsWith('.mp3') ||
      pathname.endsWith('.m4a') ||
      pathname.endsWith('.wav') ||
      pathname.endsWith('.ogg') ||
      pathname.endsWith('.aac') ||
      pathname.endsWith('.flac') ||
      pathname.endsWith('.webm') ||
      parsed.hostname.includes('archive.org') ||
      parsed.hostname.includes('soundcloud.com') ||
      parsed.hostname.includes('stream') ||
      parsed.hostname.includes('radio');

    if (isAudioFile || parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      // Extract suggested filename from path
      const filename = pathname.split('/').pop() || '';
      const cleanName = decodeURIComponent(filename)
        .replace(/\.[a-z0-9]+$/i, '')
        .replace(/[-_]/g, ' ');

      return {
        isValid: true,
        sourceType: parsed.hostname.includes('archive.org') ? 'archive' : 'audio',
        cleanUrl: parsed.href,
        suggestedTitle: cleanName ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : undefined,
      };
    }
  } catch {
    return {
      isValid: false,
      sourceType: 'audio',
      cleanUrl: trimmed,
      errorMessage: 'Invalid URL format. Please paste a valid web link.',
    };
  }

  return {
    isValid: false,
    sourceType: 'audio',
    cleanUrl: trimmed,
    errorMessage: 'Please enter a valid supported song link (YouTube, MP3 audio link, or Archive stream).',
  };
}
