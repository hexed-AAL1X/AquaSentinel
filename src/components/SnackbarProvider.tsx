'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export type SnackbarVariant = 'success' | 'error' | 'info' | 'warning';

interface SnackbarState {
  id: string;
  message: string;
  variant: SnackbarVariant;
  duration: number; // ms
}

interface SnackbarContextValue {
  showSnackbar: (options: { message: string; variant?: SnackbarVariant; durationMs?: number }) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return ctx;
}

export default function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const hideSnackbar = useCallback(() => {
    clearTimer();
    setSnackbar(null);
  }, []);

  const showSnackbar = useCallback<SnackbarContextValue['showSnackbar']>(({ message, variant = 'info', durationMs = 3500 }) => {
    clearTimer();

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setSnackbar({ id, message, variant, duration: durationMs });

    timeoutRef.current = window.setTimeout(() => {
      setSnackbar(null);
      timeoutRef.current = null;
    }, durationMs);
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const value: SnackbarContextValue = { showSnackbar };

  const getStylesByVariant = (variant: SnackbarVariant) => {
    switch (variant) {
      case 'success':
        return {
          accent: 'from-accent/70 to-accent',
          panelBg: 'bg-accent/90',
          border: 'border-accent/60',
          icon: <CheckCircle size={18} className="text-emerald-100" />,
        };
      case 'error':
        return {
          accent: 'from-secondary/70 to-secondary',
          panelBg: 'bg-secondary/90',
          border: 'border-secondary/70',
          icon: <AlertCircle size={18} className="text-red-100" />,
        };
      case 'warning':
        return {
          accent: 'from-yellow-400/80 to-amber-500',
          panelBg: 'bg-yellow-500/90',
          border: 'border-amber-300/80',
          icon: <AlertTriangle size={18} className="text-yellow-50" />,
        };
      case 'info':
      default:
        return {
          accent: 'from-primary/70 to-primary',
          panelBg: 'bg-primary/90',
          border: 'border-primary/70',
          icon: <Info size={18} className="text-cyan-100" />,
        };
    }
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {snackbar && (
          <motion.div
            key={snackbar.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-[9999]"
          >
            {(() => {
              const styles = getStylesByVariant(snackbar.variant);
              return (
                <div className="max-w-sm relative">
                  {/* Glow / gradient background */}
                  <div
                    aria-hidden="true"
                    className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${styles.accent} opacity-70 blur-sm`}
                  />

                  <div
                    className={`relative overflow-hidden rounded-2xl ${styles.panelBg} ${styles.border} backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.55)] px-4 py-3 flex items-start gap-3 text-sm font-medium text-white`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {styles.icon}
                    </div>
                    <div className="flex-1 leading-snug">
                      {snackbar.message}
                    </div>
                    <button
                      onClick={hideSnackbar}
                      className="ml-2 text-white/70 hover:text-white transition-colors flex-shrink-0"
                      aria-label="Cerrar notificación"
                    >
                      <X size={16} />
                    </button>

                    {/* Bottom accent bar */}
                    <div
                      aria-hidden="true"
                      className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r ${styles.accent}`}
                    />
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </SnackbarContext.Provider>
  );
}
