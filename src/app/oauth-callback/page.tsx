'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userEncoded = searchParams.get('user');

    if (token) {
      try {
        localStorage.setItem('token', token);
      } catch (e) {
        console.error('No se pudo guardar el token en localStorage', e);
      }
    }

    if (userEncoded) {
      try {
        const userJson = atob(userEncoded);
        localStorage.setItem('user', userJson);
      } catch (e) {
        console.error('No se pudo decodificar/guardar el usuario', e);
      }
    }

    // Redirigir al dashboard después de guardar credenciales
    router.replace('/dashboard');
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
      <div className="text-center">
        <p className="text-lg font-semibold mb-2">Procesando inicio de sesión...</p>
        <p className="text-sm opacity-80">Serás redirigido al panel en unos segundos.</p>
      </div>
    </div>
  );
}
