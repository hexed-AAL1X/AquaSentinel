'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const totalMs = isMobile ? 900 : 1800;
    const steps = [0, 35, 62, 88, 100];
    let i = 0;

    const tick = window.setInterval(() => {
      i = Math.min(i + 1, steps.length - 1);
      setProgress(steps[i]);
    }, totalMs / steps.length);

    const done = window.setTimeout(() => {
      setProgress(100);
      setLoading(false);
      onLoadingComplete();
    }, totalMs);

    return () => {
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-primary via-primary/95 to-accent flex items-center justify-center pointer-events-none"
          aria-hidden={!loading}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10"
          >
            <Image
              src="/logo.webp"
              alt=""
              width={320}
              height={96}
              className="w-auto h-24 md:h-32"
              priority
            />
          </motion.div>
          <div className="absolute bottom-10 left-8 md:bottom-12 md:left-12">
            <span className="text-white font-display text-5xl md:text-7xl font-bold tabular-nums">
              {progress}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
