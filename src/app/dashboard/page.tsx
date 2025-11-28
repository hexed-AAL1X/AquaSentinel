'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Thermometer,
  Gauge,
  Waves
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '@/lib/api';
import { Rio, Mantenimiento } from '@/types';
import { useSnackbar } from '@/components/SnackbarProvider';

export default function DashboardPage() {
  const [rios, setRios] = useState<Rio[]>([]);
  const [mantenimiento, setMantenimiento] = useState<Mantenimiento | null>(null);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [riosRes, mantRes] = await Promise.all([
        api.get('/rios'),
        api.get('/mantenimiento'),
      ]);

      if (riosRes.data.success) {
        setRios(riosRes.data.data);
      }

      if (mantRes.data.success && mantRes.data.data.length > 0) {
        setMantenimiento(mantRes.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar({ message: 'Error al cargar datos del panel', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const totalSensores = mantenimiento
    ? mantenimiento.Sensores_activos + mantenimiento.Sensores_inactivos
    : 0;

  const riosEnAlerta = rios.filter((rio) =>
    rio.Estado?.toLowerCase().includes('alerta')
  ).length;

  const activeRivers = rios.filter((rio) => 
    !rio.Estado?.toLowerCase().includes('inactivo')
  ).length;

  // Mock data for charts
  const waterQualityData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    pH: 7 + Math.random() * 1.5,
    turbidity: 40 + Math.random() * 20,
    temperature: 20 + Math.random() * 5,
    oxygen: 7 + Math.random() * 3,
  }));

  const weeklyTrendData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][i],
    mediciones: Math.floor(Math.random() * 500) + 200,
    alertas: Math.floor(Math.random() * 10),
  }));

  const getRioBadgeClass = (estado?: string) => {
    const lower = estado?.toLowerCase() || '';
    if (lower.includes('crítico') || lower.includes('alerta')) {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    if (lower.includes('monitor') || lower.includes('observación')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
    if (lower.includes('óptimo') || lower.includes('excelente')) {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-display text-neutral-dark">Cargando datos...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero en gradiente con KPIs */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#1d4ed8] text-white shadow-2xl border border-white/10 px-6 py-6 md:px-10 md:py-8">
          <div className="absolute inset-y-0 right-0 opacity-20 pointer-events-none hidden md:block">
            <div className="h-full w-72 bg-gradient-to-b from-cyan-400/40 via-sky-500/30 to-transparent blur-3xl translate-x-16" />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            <div>
              <p className="uppercase tracking-[0.35em] text-xs text-sky-200/80 mb-1">
                Panel hidrológico
              </p>
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold font-display mb-2">
                Monitoreo en tiempo real
              </h1>
              <p className="text-sm md:text-base text-sky-100/80 max-w-xl">
                Estado global de ríos, sensores y alertas críticas en la red AquaSentinel.
              </p>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-3">
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/40 px-3 py-1.5 text-xs font-medium">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>API conectada</span>
              </div>
              <div className="text-xs md:text-sm text-sky-100/80">
                <p className="font-semibold">Última actualización</p>
                <p>{new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
            <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 flex items-center justify-between backdrop-blur-sm">
              <div>
                <p className="text-xs text-sky-100/70">Ríos activos</p>
                <p className="text-2xl font-bold">{activeRivers}</p>
                <p className="text-[11px] text-sky-100/70">de {rios.length} monitoreados</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/30">
                <Droplets className="text-sky-100" size={20} />
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 flex items-center justify-between backdrop-blur-sm">
              <div>
                <p className="text-xs text-sky-100/70">Sensores operativos</p>
                <p className="text-2xl font-bold">{mantenimiento?.Sensores_activos || 0}</p>
                <p className="text-[11px] text-sky-100/70">de {totalSensores} instalados</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/30">
                <Activity className="text-emerald-50" size={20} />
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 flex items-center justify-between backdrop-blur-sm">
              <div>
                <p className="text-xs text-sky-100/70">Ríos en alerta</p>
                <p className="text-2xl font-bold">{riosEnAlerta}</p>
                <p className="text-[11px] text-sky-100/70">monitoreados en tiempo real</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/30">
                <AlertTriangle className="text-rose-50" size={20} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
        <div className="2xl:col-span-2 space-y-4">
          {/* Dinámica de calidad del agua */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl border border-primary/10 p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold font-display text-neutral-dark">
                  Dinámica de calidad del agua
                </h2>
                <p className="text-xs md:text-sm text-neutral-dark/60">
                  pH y turbidez estimados para las últimas 24 horas
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary font-medium">
                  <Waves size={14} />
                  Flujo estable
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={waterQualityData}>
                <defs>
                  <linearGradient id="colorpH" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTurb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="time" stroke="#4B5563" style={{ fontSize: '11px' }} />
                <YAxis stroke="#4B5563" style={{ fontSize: '11px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    fontFamily: 'Inter',
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="pH"
                  name="pH"
                  stroke="#0ea5e9"
                  fillOpacity={1}
                  fill="url(#colorpH)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="turbidity"
                  name="Turbidez"
                  stroke="#f97316"
                  fillOpacity={1}
                  fill="url(#colorTurb)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Tendencia semanal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="bg-white rounded-2xl shadow-xl border border-secondary/15 p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold font-display text-neutral-dark">Actividad semanal</h2>
                <p className="text-xs md:text-sm text-neutral-dark/60">
                  Volumen de mediciones vs. número de alertas registradas
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#4B5563" style={{ fontSize: '11px' }} />
                <YAxis stroke="#4B5563" style={{ fontSize: '11px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    fontFamily: 'Inter',
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="mediciones"
                  name="Mediciones"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#0f766e' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="alertas"
                  name="Alertas"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#ef4444' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Panel lateral: ríos + salud del sistema */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl border border-neutral-light p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold font-display text-neutral-dark">Ríos monitoreados</h2>
                <p className="text-xs md:text-sm text-neutral-dark/60">Vista rápida de estado y localización</p>
              </div>
              <span className="text-xs font-medium text-neutral-dark/60">{rios.length} en total</span>
            </div>
            {rios.length === 0 ? (
              <div className="py-10 text-center text-neutral-dark/50 text-sm">
                No hay ríos registrados en el sistema.
              </div>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {rios.slice(0, 7).map((rio) => (
                  <div
                    key={rio.Id}
                    className="flex items-center justify-between rounded-xl border border-neutral-light/80 px-3 py-2 hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-neutral-dark">{rio.Nombre_del_rio}</span>
                      <span className="text-[11px] text-neutral-dark/60">
                        {rio.Departamento || 'Sin departamento'} · {rio.Coordenadas || 'Coordenadas no registradas'}
                      </span>
                    </div>
                    <span
                      className={`ml-3 inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getRioBadgeClass(
                        rio.Estado
                      )}`}
                    >
                      {rio.Estado || 'Sin estado'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-slate-50 shadow-2xl border border-slate-700 p-4 md:p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="text-sky-400" size={20} />
                <h2 className="text-sm md:text-base font-semibold font-display">Salud del sistema</h2>
              </div>
              <span className="text-[11px] uppercase tracking-wide text-slate-400">Núcleo AquaSentinel</span>
            </div>
            <div className="space-y-3 text-xs md:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2">
                  <Thermometer size={16} className="text-amber-300" />
                  Temperatura operativa
                </span>
                <span className="font-semibold text-slate-50">22.5°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2">
                  <Activity size={16} className="text-emerald-300" />
                  Uptime de plataforma
                </span>
                <span className="font-semibold text-emerald-300">99.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2">
                  <TrendingUp size={16} className="text-sky-300" />
                  Datos procesados
                </span>
                <span className="font-semibold text-slate-50">2.4M registros</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-300" />
                  Estado general
                </span>
                <span className="font-semibold text-emerald-300">Estable</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
