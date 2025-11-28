'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="AquaSentinel"
              width={350}
              height={100}
              className={`h-24 w-auto transition-all duration-300 ${
                scrolled ? 'brightness-0 saturate-100' : ''
              }`}
              style={scrolled ? { filter: 'invert(28%) sepia(68%) saturate(2159%) hue-rotate(175deg) brightness(95%) contrast(101%)' } : {}}
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className={`font-medium hover:text-accent transition-colors ${
                scrolled ? 'text-neutral-dark' : 'text-white'
              }`}
            >
              Características
            </a>
            <a
              href="#ecosystem"
              className={`font-medium hover:text-accent transition-colors ${
                scrolled ? 'text-neutral-dark' : 'text-white'
              }`}
            >
              Ecosistema
            </a>
            <a
              href="#monitoring"
              className={`font-medium hover:text-accent transition-colors ${
                scrolled ? 'text-neutral-dark' : 'text-white'
              }`}
            >
              Monitoreo
            </a>
            <a
              href="#contact"
              className={`font-medium hover:text-accent transition-colors ${
                scrolled ? 'text-neutral-dark' : 'text-white'
              }`}
            >
              Contacto
            </a>
            <button
              onClick={() => {
                const event = new CustomEvent('openAuthModal');
                window.dispatchEvent(event);
              }}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                scrolled
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-white text-primary hover:bg-white/90'
              }`}
            >
              Acceder
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
