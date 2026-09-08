'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/LoadingScreen';
import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';

const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });
const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'), { ssr: false });
const AOSInit = dynamic(() => import('@/components/AOSInit'), { ssr: false });
const MapSection = dynamic(() => import('@/components/landing/MapSection'), {
  ssr: false,
  loading: () => <div id="map" className="h-[360px] md:h-[560px] bg-neutral-light/40" aria-hidden />,
});
const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection'));
const EcosystemSection = dynamic(() => import('@/components/landing/EcosystemSection'));
const MonitoringSection = dynamic(() => import('@/components/landing/MonitoringSection'));
const StatsSection = dynamic(() => import('@/components/landing/StatsSection'));
const ContactSection = dynamic(() => import('@/components/landing/ContactSection'));
const Footer = dynamic(() => import('@/components/landing/Footer'));

type AuthTab = 'login' | 'signup' | 'forgot';

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  const [belowFold, setBelowFold] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [desktopFx, setDesktopFx] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>('login');

  const handleLoadingComplete = useCallback(() => {
    setShowLoader(false);
  }, []);

  // Auth + device flags (does not touch the loader)
  useEffect(() => {
    setDesktopFx(window.matchMedia('(min-width: 768px)').matches);

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

    return () => window.removeEventListener('openAuthModal', onOpen);
  }, []);

  // Load below-fold content only AFTER the splash finishes (avoids restarting it)
  useEffect(() => {
    if (showLoader) return;

    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const t1 = window.setTimeout(() => setBelowFold(true), 50);
    const t2 = window.setTimeout(() => setMapReady(true), isDesktop ? 1800 : 4000);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [showLoader]);

  return (
    <>
      {showLoader && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultTab={authTab}
        />
      )}
      <main
        className={`overflow-x-hidden transition-opacity duration-300 ${
          showLoader ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <LandingNavbar />
        <HeroSection />
        {belowFold && (
          <>
            {desktopFx && (
              <>
                <SmoothScroll />
                <AOSInit />
              </>
            )}
            {mapReady ? (
              <MapSection />
            ) : (
              <div id="map" className="h-[360px] md:h-[560px] bg-neutral-light/30" aria-hidden />
            )}
            <FeaturesSection />
            <EcosystemSection />
            <StatsSection />
            <MonitoringSection />
            <ContactSection />
            <Footer />
          </>
        )}
      </main>
    </>
  );
}
