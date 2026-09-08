'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/LoadingScreen';
import AuthModal from '@/components/AuthModal';
import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import EcosystemSection from '@/components/landing/EcosystemSection';
import MonitoringSection from '@/components/landing/MonitoringSection';
import StatsSection from '@/components/landing/StatsSection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/landing/Footer';

const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'), { ssr: false });
const AOSInit = dynamic(() => import('@/components/AOSInit'), { ssr: false });
const MapSection = dynamic(() => import('@/components/landing/MapSection'), {
  ssr: false,
  loading: () => <div className="h-[420px] md:h-[600px] bg-neutral-light/40" aria-hidden />,
});

type AuthTab = 'login' | 'signup' | 'forgot';

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  const [heavyReady, setHeavyReady] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>('login');

  useEffect(() => {
    const openAuth = (tab: AuthTab = 'login') => {
      setAuthTab(tab);
      setAuthModalOpen(true);
    };

    const onOpen = () => openAuth('login');
    window.addEventListener('openAuthModal', onOpen);

    const params = new URLSearchParams(window.location.search);
    const authParam = params.get('auth');
    if (authParam === 'login' || authParam === 'signup' || authParam === 'forgot') {
      openAuth(authParam);
    }

    let idleId = 0;
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(() => setHeavyReady(true), { timeout: 1500 });
    } else {
      idleId = window.setTimeout(() => setHeavyReady(true), 500) as unknown as number;
    }

    return () => {
      window.removeEventListener('openAuthModal', onOpen);
      if (typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  return (
    <>
      {showLoader && <LoadingScreen onLoadingComplete={() => setShowLoader(false)} />}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authTab}
      />
      <main className="overflow-x-hidden">
        <LandingNavbar />
        <HeroSection />
        {heavyReady && (
          <>
            <SmoothScroll />
            <AOSInit />
            <MapSection />
          </>
        )}
        {!heavyReady && <div className="h-[420px] md:h-[600px] bg-neutral-light/30" aria-hidden />}
        <FeaturesSection />
        <EcosystemSection />
        <StatsSection />
        <MonitoringSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
