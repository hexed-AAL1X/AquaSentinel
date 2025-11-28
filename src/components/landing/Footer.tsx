'use client';

import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="flex items-center justify-center">
            <Image
              src="/icon.png"
              alt="AquaSentinel"
              width={80}
              height={80}
              className="h-20 w-20"
              loading="lazy"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <button 
              onClick={() => {
                const event = new CustomEvent('openAuthModal');
                window.dispatchEvent(event);
              }}
              className="hover:text-accent transition-colors"
            >
              Acceder
            </button>
            <a href="#features" className="hover:text-accent transition-colors">
              Características
            </a>
            <a href="#ecosystem" className="hover:text-accent transition-colors">
              Ecosistema
            </a>
            <a href="#contact" className="hover:text-accent transition-colors">
              Contacto
            </a>
          </div>

          <div className="flex space-x-6">
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Instagram size={20} />
            </a>
          </div>

          <div className="text-center text-sm text-white/60">
            <p>© 2025 AquaSentinel. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
