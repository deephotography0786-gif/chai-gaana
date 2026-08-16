import { useEffect, useRef } from 'react';
import { AppSettings } from '../types/music';

interface Props {
  settings: AppSettings;
}

export function TeaStallAmbiencePlayer({ settings }: Props) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isRunningRef = useRef<boolean>(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (settings.ambienceType === 'off' || settings.ambienceVolume === 0) {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
      }
      return;
    }

    const initAudio = async () => {
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContextClass) return;
          audioCtxRef.current = new AudioContextClass();
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          // Wait for user interaction to resume
          const resumeOnInteraction = () => {
            if (ctx.state === 'suspended') {
              ctx.resume();
            }
            window.removeEventListener('click', resumeOnInteraction);
            window.removeEventListener('keydown', resumeOnInteraction);
          };
          window.addEventListener('click', resumeOnInteraction);
          window.addEventListener('keydown', resumeOnInteraction);
        }

        if (!gainNodeRef.current) {
          gainNodeRef.current = ctx.createGain();
          gainNodeRef.current.connect(ctx.destination);
        }

        // Set volume
        const targetGain = Math.max(0, Math.min(0.2, settings.ambienceVolume * 0.15));
        gainNodeRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.4);

        if (!isRunningRef.current) {
          startSynthesizer(ctx, gainNodeRef.current, settings.ambienceType);
          isRunningRef.current = true;
        }
      } catch (e) {
        console.warn('Ambience audio initialization note:', e);
      }
    };

    initAudio();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [settings.ambienceType, settings.ambienceVolume]);

  const startSynthesizer = (ctx: AudioContext, masterGain: GainNode, type: string) => {
    // Generate gentle brown noise (kettle simmer / rain / wind)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 1.5; // Soft brown noise
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to sound like soft simmering kettle steam or quiet breeze
    const filter = ctx.createBiquadFilter();
    filter.type = type === 'monsoon_rain' ? 'lowpass' : 'bandpass';
    filter.frequency.value = type === 'monsoon_rain' ? 800 : 450;
    filter.Q.value = 1.2;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.04;

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);

    try {
      whiteNoise.start(0);
    } catch {
      // ignore
    }

    // Occasional gentle tea bubble / kettle whistle harmonic
    timerRef.current = setInterval(() => {
      if (ctx.state !== 'running') return;
      if (Math.random() > 0.4) return;

      try {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';

        if (type === 'evening_crickets') {
          // Soft cricket chirp
          osc.frequency.setValueAtTime(4500 + Math.random() * 800, ctx.currentTime);
          oscGain.gain.setValueAtTime(0.005, ctx.currentTime);
          oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
          osc.connect(oscGain);
          oscGain.connect(masterGain);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
        } else if (type === 'morning_birds') {
          // Distant morning bird call
          osc.frequency.setValueAtTime(2200, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(2900, ctx.currentTime + 0.1);
          oscGain.gain.setValueAtTime(0.008, ctx.currentTime);
          oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
          osc.connect(oscGain);
          oscGain.connect(masterGain);
          osc.start();
          osc.stop(ctx.currentTime + 0.25);
        } else {
          // Kettle tea bubble
          osc.frequency.setValueAtTime(180 + Math.random() * 120, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.08);
          oscGain.gain.setValueAtTime(0.012, ctx.currentTime);
          oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
          osc.connect(oscGain);
          oscGain.connect(masterGain);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        }
      } catch {
        // ignore
      }
    }, 1200);
  };

  return null;
}
