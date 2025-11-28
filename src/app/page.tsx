'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import AuthModal from '@/components/AuthModal';
import SmoothScroll from '@/components/SmoothScroll';
import AOSInit from '@/components/AOSInit';
import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import MapSection from '@/components/landing/MapSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import EcosystemSection from '@/components/landing/EcosystemSection';
import MonitoringSection from '@/components/landing/MonitoringSection';
import StatsSection from '@/components/landing/StatsSection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenAuthModal = () => setAuthModalOpen(true);
    window.addEventListener('openAuthModal', handleOpenAuthModal);
    
    // Check URL params for auth modal
    const params = new URLSearchParams(window.location.search);
    const authParam = params.get('auth');
    if (authParam === 'login' || authParam === 'signup' || authParam === 'forgot') {
      setAuthModalOpen(true);
    }
    
    return () => window.removeEventListener('openAuthModal', handleOpenAuthModal);
  }, []);

  return (
    <>
      <LoadingScreen onLoadingComplete={() => setLoadingComplete(true)} />
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        defaultTab={
          typeof window !== 'undefined' 
            ? (new URLSearchParams(window.location.search).get('auth') as 'login' | 'signup' | 'forgot') || 'login'
            : 'login'
        }
      />
      {loadingComplete && (
        <main className="overflow-x-hidden">
          <SmoothScroll />
          <AOSInit />
          <LandingNavbar />
          <HeroSection />
          <MapSection />
          <FeaturesSection />
          <EcosystemSection />
          <StatsSection />
          <MonitoringSection />
          <ContactSection />
          <Footer />
        </main>
      )}
    </>
  );
}
