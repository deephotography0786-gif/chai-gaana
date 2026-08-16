import React, { useEffect, useRef } from 'react';
import { TimeOfDay, WeatherMode, AnimationLevel } from '../types/music';

// Hero retro Indian street theme background
import retroStreetImg from '../assets/images/retro_indian_music_stall_1786902201203.jpg';

interface Props {
  timeOfDay: TimeOfDay;
  weather: WeatherMode;
  animationLevel: AnimationLevel;
  isPlaying: boolean;
}

export const BackgroundScene: React.FC<Props> = ({
  timeOfDay,
  weather,
  animationLevel,
  isPlaying,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Atmospheric Dust Particles & Subtle Weather Canvas
  useEffect(() => {
    if (animationLevel === 'off') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface DustMote {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      maxOpacity: number;
      fadeSpeed: number;
      color: string;
      wobblePhase: number;
      wobbleSpeed: number;
      isRain?: boolean;
    }

    const particles: DustMote[] = [];
    const isRain = weather === 'rain';
    const count = isRain
      ? (animationLevel === 'reduced' ? 40 : 80)
      : (animationLevel === 'reduced' ? 25 : 55);

    for (let i = 0; i < count; i++) {
      if (isRain) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 16 + 10,
          speedX: -1.2,
          speedY: Math.random() * 8 + 12,
          opacity: Math.random() * 0.4 + 0.15,
          maxOpacity: 0.5,
          fadeSpeed: 0.01,
          color: 'rgba(215, 235, 255, 0.45)',
          wobblePhase: 0,
          wobbleSpeed: 0,
          isRain: true,
        });
      } else {
        // Floating golden ambient dust motes catching retro sunlight
        const warmColors = [
          'rgba(254, 240, 138, ',
          'rgba(251, 191, 36, ',
          'rgba(245, 158, 11, ',
          'rgba(253, 230, 138, ',
        ];
        const colorPrefix = warmColors[i % warmColors.length];
        const maxOp = timeOfDay === 'night' ? 0.35 : 0.6;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.2 + 0.8,
          speedX: (Math.random() - 0.5) * 0.25,
          speedY: -Math.random() * 0.35 - 0.05,
          opacity: Math.random() * maxOp,
          maxOpacity: maxOp,
          fadeSpeed: 0.003 + Math.random() * 0.005,
          color: colorPrefix,
          wobblePhase: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.015 + Math.random() * 0.02,
          isRain: false,
        });
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.isRain) {
          p.x += p.speedX;
          p.y += p.speedY;

          if (p.y > height) {
            p.y = -20;
            p.x = Math.random() * (width + 100);
          }
          if (p.x < -20) {
            p.x = width + 20;
          }

          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 3, p.y + p.size);
          ctx.stroke();
        } else {
          // Gentle floating motion
          p.wobblePhase += p.wobbleSpeed;
          p.x += p.speedX + Math.sin(p.wobblePhase) * 0.3;
          p.y += p.speedY;

          // Gentle breathing opacity
          p.opacity += p.fadeSpeed;
          if (p.opacity > p.maxOpacity || p.opacity < 0.05) {
            p.fadeSpeed = -p.fadeSpeed;
          }

          // Wrap edges smoothly
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          // Draw warm glowing dust particle
          ctx.fillStyle = `${p.color}${Math.max(0.02, Math.min(1, p.opacity))})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [timeOfDay, weather, animationLevel]);

  return (
    <div
      id="retro-background-scene-container"
      className="fixed inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0"
    >
      {/* 1. Main Retro Indian Street Cinematic Artwork */}
      <img
        src={retroStreetImg}
        alt="Vintage 1980s Retro Indian Music & Chai Street Shop"
        className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 transform scale-[1.01]"
        style={{
          filter:
            timeOfDay === 'night'
              ? 'brightness(0.72) contrast(1.08) saturate(0.95)'
              : timeOfDay === 'evening'
              ? 'brightness(0.96) contrast(1.04) saturate(1.15)'
              : timeOfDay === 'dawn'
              ? 'brightness(0.92) contrast(1.02) saturate(1.05)'
              : 'brightness(1.0) contrast(1.02) saturate(1.05)',
        }}
      />

      {/* 2. Realistic Cinematic Lighting Variations based on Time of Day */}
      {/* Dawn Rose-Amber Radiance */}
      {timeOfDay === 'dawn' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-800/20 via-rose-700/15 to-amber-400/10 mix-blend-color-burn transition-opacity duration-1000" />
      )}

      {/* Evening Golden Hour Sunset Richness */}
      {timeOfDay === 'evening' && (
        <div className="absolute inset-0 bg-gradient-to-b from-amber-700/20 via-orange-800/15 to-stone-950/30 mix-blend-multiply transition-opacity duration-1000" />
      )}

      {/* Night Atmospheric Twilight Indigo Veil with Warm Streetlamp Highlights */}
      {timeOfDay === 'night' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#080d1a]/50 via-[#100c14]/30 to-[#070505]/65 mix-blend-multiply transition-opacity duration-1000" />
      )}

      {/* 3. Authentic Shop Lamp Glow (Positioned directly over the stall's warm filament lamp) */}
      <div
        className={`absolute top-[28%] left-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-700 ${
          timeOfDay === 'night'
            ? 'w-64 sm:w-80 h-64 sm:h-80 bg-amber-400/30 blur-3xl'
            : timeOfDay === 'evening'
            ? 'w-52 sm:w-64 h-52 sm:h-64 bg-amber-400/20 blur-2xl'
            : 'w-40 h-40 bg-amber-300/15 blur-xl'
        } ${animationLevel !== 'off' ? 'animate-pulse' : ''}`}
        style={{ animationDuration: isPlaying ? '3.5s' : '5.5s' }}
      />

      {/* Street Lamp Glow on Upper Right */}
      {(timeOfDay === 'night' || timeOfDay === 'evening') && (
        <div
          className="absolute top-[16%] right-[11%] -translate-x-1/2 -translate-y-1/2 w-44 sm:w-56 h-44 sm:h-56 rounded-full bg-amber-300/25 blur-3xl pointer-events-none"
        />
      )}

      {/* 4. Subtle Slow Ambient Sunbeam Movement in Daylight */}
      {(timeOfDay === 'day' || timeOfDay === 'dawn') && animationLevel !== 'off' && (
        <div className="absolute -top-24 right-1/4 w-[450px] h-[550px] bg-gradient-to-b from-amber-200/15 via-amber-400/8 to-transparent rotate-[28deg] blur-2xl pointer-events-none animate-sunbeam" />
      )}

      {/* 5. Minimalist Dark Gradients ONLY at Header and Footer for UI Readability */}
      {/* Top Header Scrim - Extremely subtle so trees/awning stay crisp */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

      {/* Bottom Audio Console Scrim - Protects player visibility while keeping cobblestone/bench visible */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black/75 via-black/35 to-transparent pointer-events-none" />

      {/* Subtle 35mm Vintage Vignette on Outer Corners */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(10,5,2,0.45)_100%)] pointer-events-none" />

      {/* Weather Atmospheres */}
      {weather === 'mist' && (
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/10 via-stone-200/10 to-transparent backdrop-blur-[0.3px]" />
      )}
      {weather === 'golden_haze' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-transparent mix-blend-color-dodge" />
      )}

      {/* 6. Particles Canvas (Dust Motes & Delicate Rain) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
};
