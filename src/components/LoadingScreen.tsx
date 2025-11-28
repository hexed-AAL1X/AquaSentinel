'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [loading, setLoading] = useState(true);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animar el porcentaje de forma aleatoria
    const progressSteps = [0, 12, 29, 40, 56, 70, 89, 100];
    let currentIndex = 0;

    const progressInterval = setInterval(() => {
      if (currentIndex < progressSteps.length - 1) {
        currentIndex++;
        setProgress(progressSteps[currentIndex]);
      }
    }, 300); // Cambiar cada 300ms

    // Simular tiempo de carga
    const timer = setTimeout(() => {
      setProgress(100);
      setAnimatingOut(true);
      // Después de la animación, notificar que terminó
      setTimeout(() => {
        setLoading(false);
        onLoadingComplete();
      }, 1000); // Duración de la animación de salida
    }, 2500); // Tiempo de pantalla de carga

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-primary via-primary/95 to-accent flex items-center justify-center"
        >
          {/* Logo con animación de desaparición */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: animatingOut ? 0 : 1,
              scale: animatingOut ? 0.9 : 1,
            }}
            transition={{
              opacity: { duration: 0.8, ease: 'easeInOut' },
              scale: { duration: 0.8, ease: 'easeInOut' },
            }}
            className="relative z-10"
          >
            <Image
              src="/logo.png"
              alt="AquaSentinel"
              width={500}
              height={150}
              className="w-auto h-32 md:h-40"
              priority
            />
          </motion.div>

          {/* Porcentaje en la esquina inferior izquierda */}
          {!animatingOut && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute bottom-12 left-12"
            >
              <span className="text-white font-display text-7xl md:text-8xl font-bold">
                {progress}%
              </span>
            </motion.div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}
