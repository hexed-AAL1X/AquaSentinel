'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Trash2, AlertTriangle, Save, Lock } from 'lucide-react';
import { useSnackbar } from '@/components/SnackbarProvider';
import api from '@/lib/api';

export default function ConfiguracionPage() {
  const [user, setUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    criticalAlerts: true,
    weeklyReport: false,
  });
  const [nombre, setNombre] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombreError, setNombreError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setNombre(parsedUser?.Nombre || '');
    }

    const notificationData = localStorage.getItem('notifications');
    if (notificationData) {
      try {
        setNotifications(JSON.parse(notificationData));
      } catch (error) {
        console.error('Error parsing notifications from localStorage', error);
      }
    }
    
    const fetchPreferences = async () => {
      try {
        const storedUser = userData ? JSON.parse(userData) : null;
        const userId = storedUser?.Id;
        if (!userId) return;

        const response = await api.get(`/preferencias-notificacion/${userId}`);
        if (response.data?.success && response.data.data) {
          const prefs = response.data.data;
          setNotifications((prev) => ({
            ...prev,
            emailAlerts: !!prefs.RecibirEmail,
            criticalAlerts: !!prefs.RecibirWeb,
          }));
        }
      } catch (error: any) {
        // Si no hay preferencias aún (404) o cualquier otro error, mantenemos los valores locales
        if (error?.response?.status !== 404) {
          console.error('Error fetching notification preferences', error);
        }
      }
    };

    fetchPreferences();
  }, []);

  const handleSaveProfile = async () => {
    // Guardar cambios de perfil (demo)
    if (!user) {
      showSnackbar({ message: 'No se encontró información de usuario', variant: 'error' });
      return;
    }

    if (!nombre.trim()) {
      setNombreError('Este campo es obligatorio');
      showSnackbar({ message: 'El nombre no puede estar vacío', variant: 'error' });
      return;
    }

    try {
      const response = await api.put(`/usuarios/${user.Id}`, {
        Nombre: nombre.trim(),
      });

      const updatedUser = { ...user, Nombre: nombre.trim() };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      showSnackbar({ message: 'Perfil actualizado correctamente', variant: 'success' });
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar({ message: 'No se pudo actualizar el perfil', variant: 'error' });
    }
  };

  const handleChangePassword = async () => {
    if (!user) {
      showSnackbar({ message: 'No se encontró información de usuario', variant: 'error' });
      return;
    }

    let hasError = false;

    if (!newPassword) {
      setNewPasswordError('Este campo es obligatorio');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Este campo es obligatorio');
      hasError = true;
    }

    if (hasError) {
      showSnackbar({ message: 'Completa los campos requeridos', variant: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setNewPasswordError('La contraseña debe tener al menos 6 caracteres');
      showSnackbar({ message: 'La contraseña debe tener al menos 6 caracteres', variant: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      showSnackbar({ message: 'Las contraseñas no coinciden', variant: 'error' });
      return;
    }

    try {
      const response = await api.put(`/usuarios/${user.Id}`, {
        Contrasenia: newPassword,
      });

      showSnackbar({ message: 'Contraseña actualizada. Vuelve a iniciar sesión.', variant: 'success' });
      setNewPassword('');
      setConfirmPassword('');
      setNewPasswordError('');
      setConfirmPasswordError('');

      // Cerrar sesión localmente tras cambio de contraseña
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    } catch (error) {
      console.error('Error updating password:', error);
      showSnackbar({ message: 'No se pudo actualizar la contraseña', variant: 'error' });
    }
  };

  const handleSaveNotifications = async () => {
    try {
      const storedUser = user || JSON.parse(localStorage.getItem('user') || 'null');
      const userId = storedUser?.Id;

      if (userId) {
        await api.put(`/preferencias-notificacion/${userId}`, {
          RecibirEmail: notifications.emailAlerts,
          RecibirSms: false,
          RecibirWeb: notifications.criticalAlerts,
        });
      }

      // Seguimos guardando también en localStorage para lectura rápida en el cliente
      localStorage.setItem('notifications', JSON.stringify(notifications));
      showSnackbar({ message: 'Preferencias guardadas correctamente', variant: 'success' });
    } catch (error) {
      console.error('Error saving notifications:', error);
      showSnackbar({ message: 'No se pudieron guardar las preferencias', variant: 'error' });
    }
  };

  const handleDownloadData = () => {
    try {
      const storedUser = user || JSON.parse(localStorage.getItem('user') || 'null');
      const payload = {
        usuario: storedUser,
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mis-datos-aquasentinel.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSnackbar({ message: 'Descarga iniciada', variant: 'info' });
    } catch (error) {
      console.error('Error downloading data:', error);
      showSnackbar({ message: 'No se pudo descargar tus datos', variant: 'error' });
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText === 'ELIMINAR MI CUENTA') {
      try {
        const storedUser = user || JSON.parse(localStorage.getItem('user') || 'null');
        const userId = storedUser?.Id;

        if (userId) {
          await api.delete(`/usuarios/${userId}`);
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        showSnackbar({ message: 'No se pudo eliminar la cuenta. Inténtalo nuevamente.', variant: 'error' });
        return;
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      showSnackbar({ message: 'Cuenta eliminada correctamente', variant: 'success' });
      window.location.href = '/';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#2563eb] text-white shadow-2xl border border-white/10 px-6 py-6 md:px-10 md:py-8">
          <div className="absolute inset-y-0 right-0 opacity-20 pointer-events-none hidden md:block">
            <div className="h-full w-64 bg-gradient-to-b from-sky-400/40 via-blue-500/30 to-transparent blur-3xl translate-x-12" />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <User className="text-sky-100" size={26} />
              </div>
              <div>
                <p className="uppercase tracking-[0.35em] text-xs text-sky-200/80 mb-1">
                  Configuración
                </p>
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold font-display">
                  Centro de cuenta y seguridad
                </h1>
                <p className="text-xs md:text-sm text-sky-100/80 mt-1 max-w-xl">
                  Administra tu cuenta, credenciales y preferencias de notificación.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-2">
              <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sesión activa</span>
                {user?.Email && (
                  <>
                    <span className="opacity-60">•</span>
                    <span className="truncate max-w-[160px] md:max-w-[220px]">
                      {user.Email}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl border border-neutral-light p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display text-neutral-dark">Perfil de Usuario</h2>
            <p className="text-neutral-dark/60 text-sm">Información personal</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-dark mb-2">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                if (nombreError) setNombreError('');
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                nombreError
                  ? 'border-red-400 focus:ring-red-500'
                  : 'border-neutral-light focus:ring-primary'
              }`}
              placeholder="Tu nombre"
            />
            {nombreError && (
              <p className="mt-1 text-xs text-red-600">{nombreError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-dark mb-2">Email</label>
            <input
              type="email"
              defaultValue={user?.Email || ''}
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-neutral-light/30"
              disabled
            />
            <p className="text-xs text-neutral-dark/50 mt-1">El email no se puede cambiar</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-dark mb-2">Institución</label>
            <input
              type="text"
              defaultValue={user?.Institucion || ''}
              className="w-full px-4 py-3 border border-neutral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-neutral-light/30"
              disabled
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Save size={20} />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-xl border border-neutral-light p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
            <Shield className="text-accent" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display text-neutral-dark">Seguridad</h2>
            <p className="text-neutral-dark/60 text-sm">Contraseña y autenticación</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-dark mb-2">Nueva Contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (newPasswordError) setNewPasswordError('');
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                newPasswordError
                  ? 'border-red-400 focus:ring-red-500'
                  : 'border-neutral-light focus:ring-accent'
              }`}
              placeholder="Ingresa nueva contraseña"
            />
            {newPasswordError && (
              <p className="mt-1 text-xs text-red-600">{newPasswordError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-dark mb-2">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                confirmPasswordError
                  ? 'border-red-400 focus:ring-red-500'
                  : 'border-neutral-light focus:ring-accent'
              }`}
              placeholder="Confirma nueva contraseña"
            />
            {confirmPasswordError && (
              <p className="mt-1 text-xs text-red-600">{confirmPasswordError}</p>
            )}
          </div>

          <button
            onClick={handleChangePassword}
            className="flex items-center space-x-2 px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Lock size={20} />
            <span>Cambiar Contraseña</span>
          </button>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl border border-neutral-light p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
            <Bell className="text-secondary" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display text-neutral-dark">Notificaciones</h2>
            <p className="text-neutral-dark/60 text-sm">Gestiona tus alertas</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-neutral-light/20 rounded-xl cursor-pointer hover:bg-neutral-light/40 transition-all">
            <div>
              <p className="font-semibold text-neutral-dark">Alertas por Email</p>
              <p className="text-sm text-neutral-dark/60">Recibe notificaciones en tu correo</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailAlerts}
              onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
              className="w-5 h-5 text-primary focus:ring-primary rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-neutral-light/20 rounded-xl cursor-pointer hover:bg-neutral-light/40 transition-all">
            <div>
              <p className="font-semibold text-neutral-dark">Alertas Críticas</p>
              <p className="text-sm text-neutral-dark/60">Notificaciones de emergencia inmediatas</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.criticalAlerts}
              onChange={(e) => setNotifications({ ...notifications, criticalAlerts: e.target.checked })}
              className="w-5 h-5 text-primary focus:ring-primary rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-neutral-light/20 rounded-xl cursor-pointer hover:bg-neutral-light/40 transition-all">
            <div>
              <p className="font-semibold text-neutral-dark">Reporte Semanal</p>
              <p className="text-sm text-neutral-dark/60">Resumen de actividad cada semana</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weeklyReport}
              onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
              className="w-5 h-5 text-primary focus:ring-primary rounded"
            />
          </label>

          <button
            onClick={handleSaveNotifications}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Save size={20} />
            <span>Guardar Preferencias</span>
          </button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-2xl shadow-xl border-2 border-red-500/30 p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-red-500" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display text-red-500">Zona Peligrosa</h2>
            <p className="text-neutral-dark/60 text-sm">Acciones irreversibles</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-bold text-red-700 mb-2 flex items-center">
              <Trash2 className="mr-2" size={20} />
              Eliminar Cuenta
            </h3>
            <p className="text-sm text-red-600 mb-4">
              Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de que realmente quieres hacer esto.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              Eliminar Mi Cuenta
            </button>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h3 className="font-bold text-yellow-700 mb-2">Exportar Datos</h3>
            <p className="text-sm text-yellow-600 mb-4">
              Descarga todos tus datos antes de eliminar tu cuenta.
            </p>
            <button
              onClick={handleDownloadData}
              className="px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all font-semibold"
            >
              Descargar Mis Datos
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <h3 className="text-2xl font-bold font-display text-red-500">Confirmar Eliminación</h3>
            </div>

            <p className="text-neutral-dark/70 mb-4">
              Esta acción es <strong>permanente e irreversible</strong>. Se eliminarán todos tus datos, configuraciones y accesos.
            </p>

            <p className="text-sm text-neutral-dark/60 mb-4">
              Para confirmar, escribe <strong className="text-red-500">ELIMINAR MI CUENTA</strong> en el campo de abajo:
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all mb-4"
              placeholder="ELIMINAR MI CUENTA"
            />

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText('');
                }}
                className="flex-1 px-6 py-3 bg-neutral-light text-neutral-dark rounded-xl hover:bg-neutral-light/70 transition-all font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={confirmText !== 'ELIMINAR MI CUENTA'}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
