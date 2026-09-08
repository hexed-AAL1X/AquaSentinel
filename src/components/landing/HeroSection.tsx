'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  const typedRef = useRef<HTMLSpanElement>(null);
  const riverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let typed: { destroy: () => void } | undefined;
    let parallaxTween: { kill: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: Typed }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('typed.js'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (cancelled || !typedRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      typed = new Typed(typedRef.current, {
        strings: [
          'Monitoreo en tiempo real de mercurio en los ríos',
          'Protegiendo la salud pública amazónica',
          'Datos precisos para decisiones críticas',
          'Cuidando la biodiversidad del río Madre de Dios',
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|',
      });

      if (riverRef.current && window.matchMedia('(min-width: 768px)').matches) {
        parallaxTween = gsap.to(riverRef.current, {
          y: 100,
          ease: 'none',
          scrollTrigger: {
            trigger: riverRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    })();

    return () => {
      cancelled = true;
      typed?.destroy();
      parallaxTween?.kill();
    };
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div ref={riverRef} className="absolute inset-0 scale-110">
          <Image
            src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1600&q=75"
            alt="Río amazónico en Madre de Dios"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/80" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10" aria-hidden>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold font-display text-white mb-6 leading-tight tracking-wide"
        >
          SISTEMA INTELIGENTE DE
          <br />
          MONITOREO AMBIENTAL
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto min-h-[4rem] flex items-center justify-center"
        >
          <span ref={typedRef} />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#features"
            className="px-8 py-4 bg-white text-primary rounded-full font-semibold hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg"
          >
            Conocer Más
          </a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))}
            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all"
          >
            Acceder
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="fixed bottom-32 left-0 hidden md:flex flex-col items-center gap-2 pl-6 z-30"
        >
          <span className="text-white text-sm font-medium tracking-wider rotate-90 origin-center">
            SCROLL
          </span>
          <a href="#map" className="animate-bounce block mt-8" aria-label="Ir a la sección del mapa">
            <ArrowDown className="text-white" size={28} aria-hidden />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
