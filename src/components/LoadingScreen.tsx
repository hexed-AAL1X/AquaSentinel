'use client';

import { useEffect, useRef, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');
  const doneRef = useRef(false);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const duration = mobile ? 1400 : 2200;
    const start = performance.now();
    let raf = 0;

    // Ease-out cubic for smooth %
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(Math.round(easeOut(t) * 100));

      if (t < 1) {
        raf = requestAnimationFrame(frame);
        return;
      }

      setProgress(100);
      setPhase('out');
      window.setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true;
          onLoadingComplete();
        }
      }, 550);
    };

    // small delay so enter animation paints first
    const kick = window.setTimeout(() => {
      setPhase('hold');
      raf = requestAnimationFrame(frame);
    }, 80);

    return () => {
      clearTimeout(kick);
      cancelAnimationFrame(raf);
    };
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ease-out ${
        phase === 'out' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        // sólido 100%: no se ve el hero detrás
        background: 'linear-gradient(135deg, #0077B6 0%, #0096C7 45%, #2A9D8F 100%)',
      }}
      aria-busy={phase !== 'out'}
      aria-live="polite"
    >
      <div
        className={`relative z-10 transition-all duration-700 ease-out ${
          phase === 'in'
            ? 'opacity-0 scale-90'
            : phase === 'out'
              ? 'opacity-0 scale-95'
              : 'opacity-100 scale-100'
        }`}
      >
        <img
          src="/logo-sm.webp"
          alt="AquaSentinel"
          width={200}
          height={114}
          className="h-24 md:h-32 w-auto"
          decoding="async"
        />
      </div>

      <div
        className={`absolute bottom-10 left-8 md:bottom-12 md:left-12 transition-opacity duration-500 ${
          phase === 'out' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span className="text-white font-display text-6xl md:text-8xl font-bold tabular-nums tracking-tight">
          {progress}%
        </span>
      </div>
    </div>
  );
}
