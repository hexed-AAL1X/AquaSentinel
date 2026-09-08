'use client';

import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const socials = [
  { href: 'https://www.facebook.com/', label: 'Facebook', Icon: Facebook },
  { href: 'https://twitter.com/', label: 'Twitter / X', Icon: Twitter },
  { href: 'https://www.linkedin.com/', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://www.instagram.com/', label: 'Instagram', Icon: Instagram },
] as const;

export default function Footer() {
  return (
    <footer className="bg-neutral-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          <Image
            src="/icon-192.webp"
            alt="AquaSentinel"
            width={80}
            height={80}
            className="h-20 w-20"
            loading="lazy"
          />

          <nav className="flex flex-wrap justify-center gap-8 text-sm" aria-label="Enlaces del pie">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))}
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
          </nav>

          <div className="flex space-x-6">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Icon size={20} aria-hidden />
              </a>
            ))}
          </div>

          <p className="text-center text-sm text-white/60">
            © {new Date().getFullYear()} AquaSentinel. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
