'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import Image from 'next/image';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup' | 'forgot';
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>(defaultTab);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginData, setLoginData] = useState({ Id: '', Contrasenia: '' });

  // Signup form
  const [signupData, setSignupData] = useState({
    Nombre: '',
    Email: '',
    Contrasenia: '',
    ConfirmPassword: '',
    CodigoInstitucion: '',
  });

  // Forgot password form
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/usuarios/login', loginData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.usuario));
        router.push('/dashboard');
        onClose();
      } else {
        setError(response.data.message || 'Error al iniciar sesión');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (signupData.Contrasenia !== signupData.ConfirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (signupData.Contrasenia.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    // Validar dominio de email en el frontend (solo Gmail por ahora)
    const emailDomain = signupData.Email.split('@')[1]?.toLowerCase();
    const allowedDomains = ['gmail.com'];

    if (!emailDomain || !allowedDomains.includes(emailDomain)) {
      setError('Por ahora solo se permiten correos @gmail.com');
      setLoading(false);
      return;
    }

    try {
      const { ConfirmPassword, ...dataToSend } = signupData;
      const response = await api.post('/usuarios/register', dataToSend);
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          setActiveTab('login');
          setSuccess(false);
        }, 2000);
      } else {
        setError(response.data.message || 'Error al registrar usuario');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      setError('Configuración de API inválida para OAuth');
      return;
    }
    window.location.href = `${baseUrl}/auth/google`;
  };

  const handleMicrosoftAuth = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      setError('Configuración de API inválida para OAuth');
      return;
    }
    window.location.href = `${baseUrl}/auth/microsoft`;
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/usuarios/forgot-password', { Email: forgotEmail });
      if (response.data.success) {
        console.log('Reset token (demo):', response.data.data?.resetToken);
        setSuccess(true);
      } else {
        setError(response.data.message || 'Error al enviar el correo de recuperación');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop difuminado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-6 relative"
            >
              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-neutral-dark/40 hover:text-neutral-dark transition-colors"
              >
                <X size={24} />
              </button>

              {/* Header con ícono */}
              <div className="flex flex-col items-center mb-5">
                <div className="bg-primary/10 rounded-full p-3 mb-3">
                  <Image
                    src="/icon.png"
                    alt="AquaSentinel"
                    width={48}
                    height={48}
                    className="w-12 h-12"
                    style={{ filter: 'invert(28%) sepia(68%) saturate(2159%) hue-rotate(175deg) brightness(95%) contrast(101%)' }}
                  />
                </div>
                <h1 className="text-xl font-bold font-display text-neutral-dark">AquaSentinel</h1>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-neutral-light mb-4">
                <button
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                    setSuccess(false);
                  }}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors relative ${
                    activeTab === 'login'
                      ? 'text-primary'
                      : 'text-neutral-dark/50 hover:text-neutral-dark/70'
                  }`}
                >
                  Login
                  {activeTab === 'login' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('signup');
                    setError('');
                    setSuccess(false);
                  }}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors relative ${
                    activeTab === 'signup'
                      ? 'text-primary'
                      : 'text-neutral-dark/50 hover:text-neutral-dark/70'
                  }`}
                >
                  Sign Up
                  {activeTab === 'signup' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              </div>

              {activeTab === 'login' && (
                <>
                  <p className="text-xs text-center text-neutral-dark/60 mb-4">O continúa con</p>

                  {/* OAuth Buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      onClick={handleGoogleAuth}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 border border-neutral-light rounded-lg hover:bg-neutral-light/30 transition-all text-xs font-medium"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>
                    <button
                      onClick={handleMicrosoftAuth}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 border border-neutral-light rounded-lg hover:bg-neutral-light/30 transition-all text-xs font-medium"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 23 23">
                        <path fill="#f35325" d="M0 0h11v11H0z"/>
                        <path fill="#81bc06" d="M12 0h11v11H12z"/>
                        <path fill="#05a6f0" d="M0 12h11v11H0z"/>
                        <path fill="#ffba08" d="M12 12h11v11H12z"/>
                      </svg>
                      Microsoft
                    </button>
                  </div>
                </>
              )}

              {/* Alerts */}
              {error && (
                <div className="bg-secondary/10 border border-secondary text-secondary px-3 py-2 rounded-lg mb-3 flex items-center gap-2 text-xs">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-accent/10 border border-accent text-accent px-3 py-2 rounded-lg mb-3 flex items-center gap-2 text-xs">
                  <CheckCircle size={16} />
                  <span>¡Registro exitoso! Cambiando a login...</span>
                </div>
              )}

              {/* Forms */}
              {activeTab === 'forgot' ? (
                // Forgot Password Form
                !success ? (
                  <form onSubmit={handleForgotSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-dark mb-1">Email</label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-lg transition-all text-sm disabled:opacity-50"
                    >
                      {loading ? 'Enviando...' : 'Enviar Instrucciones'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('login');
                        setError('');
                        setSuccess(false);
                      }}
                      className="w-full text-xs text-primary hover:text-accent transition-colors"
                    >
                      Volver al inicio de sesión
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-center text-neutral-dark">
                      Revisa tu bandeja de entrada para restablecer tu contraseña.
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('login');
                        setSuccess(false);
                        setForgotEmail('');
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-lg transition-all text-sm"
                    >
                      Volver al Login
                    </button>
                  </div>
                )
              ) : activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-dark mb-1">Email</label>
                    <input
                      type="email"
                      value={loginData.Id}
                      onChange={(e) => setLoginData({ ...loginData, Id: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="Tu email"
                      required
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-medium text-neutral-dark">Contraseña</label>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('forgot');
                          setError('');
                          setSuccess(false);
                        }}
                        className="text-xs text-primary hover:text-accent"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <input
                      type="password"
                      value={loginData.Contrasenia}
                      onChange={(e) => setLoginData({ ...loginData, Contrasenia: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="Tu contraseña"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-lg transition-all text-sm disabled:opacity-50"
                  >
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit} className="space-y-2.5">
                  <div>
                    <label className="block text-xs font-medium text-neutral-dark mb-1">Nombre</label>
                    <input
                      type="text"
                      value={signupData.Nombre}
                      onChange={(e) => setSignupData({ ...signupData, Nombre: e.target.value })}
                      className="w-full px-3 py-1.5 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-dark mb-1">Email</label>
                    <input
                      type="email"
                      value={signupData.Email}
                      onChange={(e) => setSignupData({ ...signupData, Email: e.target.value })}
                      className="w-full px-3 py-1.5 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-dark mb-1">Código de institución</label>
                    <input
                      type="text"
                      value={signupData.CodigoInstitucion}
                      onChange={(e) => setSignupData({ ...signupData, CodigoInstitucion: e.target.value })}
                      className="w-full px-3 py-1.5 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="Ej: INST-001-PRUEBA"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-dark mb-1">Contraseña</label>
                    <input
                      type="password"
                      value={signupData.Contrasenia}
                      onChange={(e) => setSignupData({ ...signupData, Contrasenia: e.target.value })}
                      className="w-full px-3 py-1.5 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="Mín. 6 caracteres"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-dark mb-1">Confirmar</label>
                    <input
                      type="password"
                      value={signupData.ConfirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, ConfirmPassword: e.target.value })}
                      className="w-full px-3 py-1.5 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="Repite contraseña"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-lg transition-all text-sm disabled:opacity-50 mt-2"
                  >
                    {loading ? 'Registrando...' : 'Crear Cuenta'}
                  </button>
                </form>
              )}

              <p className="text-xs text-center text-neutral-dark/50 mt-4">
                Protegiendo los ríos de la Amazonía
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
