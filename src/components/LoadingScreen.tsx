'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

/** Desktop-only splash. Skipped on mobile for LCP/TBT. */
export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) {
      onLoadingComplete();
      setVisible(false);
      return;
    }

    const steps = [0, 40, 75, 100];
    let i = 0;
    const tick = window.setInterval(() => {
      i = Math.min(i + 1, steps.length - 1);
      setProgress(steps[i]);
    }, 280);

    const done = window.setTimeout(() => {
      setProgress(100);
      setVisible(false);
      onLoadingComplete();
    }, 1100);

    return () => {
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [onLoadingComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-primary via-primary/95 to-accent flex items-center justify-center pointer-events-none transition-opacity duration-300"
      aria-hidden
    >
      <img src="/logo.webp" alt="" width={280} height={84} className="h-28 w-auto" />
      <div className="absolute bottom-12 left-12">
        <span className="text-white font-display text-7xl font-bold tabular-nums">{progress}%</span>
      </div>
    </div>
  );
}
