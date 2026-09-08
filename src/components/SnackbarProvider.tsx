'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export type SnackbarVariant = 'success' | 'error' | 'info' | 'warning';

interface SnackbarState {
  id: string;
  message: string;
  variant: SnackbarVariant;
  duration: number;
}

interface SnackbarContextValue {
  showSnackbar: (options: { message: string; variant?: SnackbarVariant; durationMs?: number }) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within a SnackbarProvider');
  return ctx;
}

const variantStyles: Record<
  SnackbarVariant,
  { panel: string; accent: string; Icon: typeof CheckCircle }
> = {
  success: { panel: 'bg-accent/90 border-accent/60', accent: 'from-accent/70 to-accent', Icon: CheckCircle },
  error: { panel: 'bg-secondary/90 border-secondary/70', accent: 'from-secondary/70 to-secondary', Icon: AlertCircle },
  warning: { panel: 'bg-yellow-500/90 border-amber-300/80', accent: 'from-yellow-400/80 to-amber-500', Icon: AlertTriangle },
  info: { panel: 'bg-primary/90 border-primary/70', accent: 'from-primary/70 to-primary', Icon: Info },
};

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

  const showSnackbar = useCallback<SnackbarContextValue['showSnackbar']>(
    ({ message, variant = 'info', durationMs = 3500 }) => {
      clearTimer();
      setSnackbar({
        id: `${Date.now()}`,
        message,
        variant,
        duration: durationMs,
      });
      timeoutRef.current = window.setTimeout(() => {
        setSnackbar(null);
        timeoutRef.current = null;
      }, durationMs);
    },
    []
  );

  useEffect(() => () => clearTimer(), []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-fadeInUp" role="status">
          {(() => {
            const styles = variantStyles[snackbar.variant];
            const Icon = styles.Icon;
            return (
              <div className="max-w-sm relative">
                <div
                  aria-hidden
                  className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${styles.accent} opacity-70 blur-sm`}
                />
                <div
                  className={`relative overflow-hidden rounded-2xl ${styles.panel} border backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.55)] px-4 py-3 flex items-start gap-3 text-sm font-medium text-white`}
                >
                  <Icon size={18} className="mt-0.5 flex-shrink-0 text-white" aria-hidden />
                  <p className="flex-1 leading-snug">{snackbar.message}</p>
                  <button
                    type="button"
                    onClick={hideSnackbar}
                    className="ml-2 text-white/70 hover:text-white transition-colors flex-shrink-0"
                    aria-label="Cerrar notificación"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </SnackbarContext.Provider>
  );
}
