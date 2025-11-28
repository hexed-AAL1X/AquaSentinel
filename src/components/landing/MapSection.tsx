'use client';

import { useRef, useState, useEffect } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapSection() {
  const mapRef = useRef(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setWebGLSupported(Boolean(gl));
  }, []);

  return (
    <section id="map" className="relative py-20 bg-gradient-to-b from-white to-neutral-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-4xl md:text-5xl font-bold font-display text-neutral-dark mb-4">
            Nuestra Ubicación
          </h2>
          <p className="text-lg text-neutral-dark/70 max-w-2xl mx-auto">
            Monitoreando la calidad del agua en <span className="text-primary font-semibold">Puerto Maldonado, Perú</span>
          </p>
        </div>

        <div className="w-full">
          <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative" data-aos="zoom-in" data-aos-duration="1000">
            {!mapboxToken ? (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-display font-semibold text-neutral-dark mb-2">
                    Configuración del Mapa
                  </h3>
                  <p className="text-sm text-neutral-dark/70 mb-4">
                    Para visualizar el mapa interactivo, configura tu token de MapBox
                  </p>
                  <a 
                    href="https://account.mapbox.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Obtener Token de MapBox
                  </a>
                </div>
              </div>
            ) : !webGLSupported || mapError ? (
              <div className="w-full h-full relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63286.51773877891!2d-69.21920645!3d-12.5934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91e6d0f3c1e1f3b5%3A0x3d1f3b5c1e1f3b5d!2sPuerto%20Maldonado%2C%20Peru!5e1!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
                {!webGLSupported && (
                  <div className="absolute top-4 left-4 right-4 bg-yellow-500/90 text-white px-4 py-3 rounded-lg shadow-lg">
                    <p className="text-sm font-semibold">WebGL no disponible</p>
                    <p className="text-xs mt-1">Mostrando mapa alternativo. Usa Ctrl + scroll para zoom.</p>
                  </div>
                )}
              </div>
            ) : (
              <Map
                ref={mapRef}
                mapboxAccessToken={mapboxToken}
                initialViewState={{
                  longitude: -69.1892,
                  latitude: -12.5934,
                  zoom: 12,
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                scrollZoom={true}
                onError={(e) => {
                  console.error('Map error:', e);
                  setMapError(true);
                }}
              >
                <Marker longitude={-69.1892} latitude={-12.5934} anchor="bottom">
                  <div className="relative group">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50">
                      Puerto Maldonado
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
                    </div>
                    <div className="bg-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
                      <MapPin size={24} />
                    </div>
                  </div>
                </Marker>
                <NavigationControl position="top-right" />
              </Map>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-neutral-light" data-aos="fade-up" data-aos-delay="100">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MapPin className="text-primary" size={24} />
                </div>
                <h3 className="font-display font-semibold text-neutral-dark">Ubicación</h3>
              </div>
              <p className="text-neutral-dark/70 text-sm">
                Puerto Maldonado, Madre de Dios, Perú
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-neutral-light" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <svg className="text-accent" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-neutral-dark">Coordenadas</h3>
              </div>
              <p className="text-neutral-dark/70 text-sm">
                12 35 36 S, 69 11 21 W
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-neutral-light" data-aos="fade-up" data-aos-delay="300">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-secondary/10 p-2 rounded-lg">
                  <svg className="text-secondary" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20.2 7.8l-7.7 7.7-4-4-5.5 5.5" />
                    <path d="M15 7h6v6" />
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-neutral-dark">Altitud</h3>
              </div>
              <p className="text-neutral-dark/70 text-sm">
                183 metros sobre el nivel del mar
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
