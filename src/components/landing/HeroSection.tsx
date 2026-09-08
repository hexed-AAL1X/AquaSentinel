'use client';

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(min-width: 768px)" srcSet="/hero-lg.webp" type="image/webp" />
          <img
            src="/hero.webp"
            alt="Río amazónico en Madre de Dios"
            width={960}
            height={640}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
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
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-display text-white mb-6 leading-tight tracking-wide">
          SISTEMA INTELIGENTE DE
          <br />
          MONITOREO AMBIENTAL
        </h1>

        <p className="text-lg md:text-2xl text-white/90 mb-10 md:mb-12 max-w-3xl mx-auto">
          Monitoreo en tiempo real de mercurio en los ríos
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#features"
            className="px-8 py-4 bg-white text-primary rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg"
          >
            Conocer Más
          </a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))}
            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
          >
            Acceder
          </button>
        </div>

        <div className="fixed bottom-28 left-0 hidden md:flex flex-col items-center gap-2 pl-6 z-30">
          <span className="text-white text-sm font-medium tracking-wider rotate-90 origin-center">
            SCROLL
          </span>
          <a href="#map" className="block mt-8" aria-label="Ir a la sección del mapa">
            <svg className="text-white w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
