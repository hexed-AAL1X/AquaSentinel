'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, MapPin, Activity, AlertTriangle, TrendingUp, Plus } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import api from '@/lib/api';
import { Rio } from '@/types';
import { useSnackbar } from '@/components/SnackbarProvider';

export default function RiosPage() {
  const [rios, setRios] = useState<Rio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRio, setSelectedRio] = useState<Rio | null>(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchRios();
  }, []);

  const fetchRios = async () => {
    try {
      const response = await api.get('/rios');
      if (response.data.success) {
        const data = (response.data.data || []) as Rio[];
        const mapped = data.map((rio) => {
          const lat = rio.Latitud != null ? Number(rio.Latitud as any) : null;
          const lng = rio.Longitud != null ? Number(rio.Longitud as any) : null;
          let coords: string | undefined;
          if (lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)) {
            coords = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          }
          return {
            ...rio,
            Coordenadas: rio.Coordenadas || coords,
            Departamento: rio.Departamento || rio.Cuenca || undefined,
          };
        });
        setRios(mapped);
      }
    } catch (error) {
      console.error('Error fetching rivers:', error);
      showSnackbar({ message: 'Error al cargar datos de ríos', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado: string) => {
    const lower = estado?.toLowerCase() || '';
    if (lower.includes('crítico') || lower.includes('alerta')) return 'danger';
    if (lower.includes('monitor') || lower.includes('observación')) return 'warning';
    if (lower.includes('óptimo') || lower.includes('excelente')) return 'success';
    return 'primary';
  };

  const getStatusBadgeClass = (estado: string) => {
    const lower = estado?.toLowerCase() || '';
    if (lower.includes('crítico') || lower.includes('alerta')) 
      return 'bg-red-100 text-red-800 border-red-300';
    if (lower.includes('monitor') || lower.includes('observación')) 
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (lower.includes('óptimo') || lower.includes('excelente')) 
      return 'bg-green-100 text-green-800 border-green-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const activeRios = rios.filter((r) => !r.Estado?.toLowerCase().includes('inactivo'));
  const criticalRios = rios.filter((r) => r.Estado?.toLowerCase().includes('crítico'));
  const monitoringRios = rios.filter((r) => r.Estado?.toLowerCase().includes('monitor'));
  const totalRiosCount = Math.max(rios.length, 1);

  const riverStatusChartData = [
    { name: 'Activos', value: activeRios.length },
    { name: 'Observación', value: monitoringRios.length },
    { name: 'Críticos', value: criticalRios.length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-lg text-neutral-dark">Cargando datos de ríos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#0ea5e9] text-white shadow-2xl border border-white/10 px-6 py-6 md:px-10 md:py-8">
          <div className="absolute inset-y-0 right-0 opacity-25 pointer-events-none hidden md:block">
            <div className="h-full w-64 bg-gradient-to-b from-sky-400/40 via-cyan-500/30 to-transparent blur-3xl translate-x-12" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Droplets className="text-sky-100" size={26} />
              </div>
              <div>
                <p className="uppercase tracking-[0.35em] text-xs text-sky-200/80 mb-1">
                  Ríos
                </p>
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold font-display">
                  Gestión de ríos
                </h1>
                <p className="text-xs md:text-sm text-sky-50/80 mt-1 max-w-xl">
                  Monitoreo, estado y localización de los cuerpos hídricos registrados en AquaSentinel.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="rounded-2xl bg-white/10 border border-white/20 px-3 py-2 text-[11px] md:text-xs flex flex-col gap-1">
                <span className="font-semibold">Resumen hidrológico</span>
                <span className="text-sky-100/80">
                  Total ríos: <span className="font-semibold text-white">{rios.length}</span>
                </span>
                <span className="text-sky-100/80">
                  Activos: <span className="font-semibold text-white">{activeRios.length}</span> · Críticos:{' '}
                  <span className="font-semibold text-white">{criticalRios.length}</span>
                </span>
              </div>
              <button
                className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all text-xs md:text-sm font-semibold shadow-lg hover:shadow-xl"
                onClick={() =>
                  showSnackbar({
                    message: 'Creación de nuevos ríos estará disponible próximamente',
                    variant: 'info',
                  })
                }
              >
                <Plus size={18} />
                <span>Nuevo Río</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Rivers Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="xl:col-span-2 rounded-2xl bg-slate-950/95 text-slate-50 shadow-[0_18px_45px_rgba(15,23,42,0.9)] border border-slate-800/80 overflow-hidden backdrop-blur-sm"
        >
          <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-sky-500/10 via-slate-900/60 to-transparent">
            <h2 className="text-xl md:text-2xl font-bold font-display text-slate-50">Cuerpos Hídricos Monitoreados</h2>
            <p className="text-[13px] text-slate-400 mt-1">Información detallada de cada río registrado en la red</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400/90 uppercase tracking-[0.16em]">
                    Nombre del Río
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400/90 uppercase tracking-[0.16em]">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400/90 uppercase tracking-[0.16em]">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400/90 uppercase tracking-[0.16em]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {rios.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <Droplets className="text-neutral-dark/20" size={48} />
                        <p className="text-neutral-dark/60">No hay ríos registrados</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rios.map((rio) => (
                    <tr
                      key={rio.Id}
                      className="hover:bg-slate-900/70 transition-colors cursor-pointer"
                      onClick={() => setSelectedRio(rio)}
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 bg-sky-500/15 rounded-lg flex items-center justify-center border border-sky-500/30">
                            <Droplets className="text-sky-300" size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-50">
                              {rio.Nombre_del_rio}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {rio.Departamento || 'Sin departamento'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="text-slate-400" size={14} />
                          <span className="text-xs md:text-sm text-slate-300/90">
                            {rio.Coordenadas || 'No especificado'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(rio.Estado || '')}`}>
                          {rio.Estado || 'Sin estado'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <button className="text-sky-300 hover:text-sky-200 font-semibold text-xs md:text-sm transition-colors">
                          Ver detalles →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Side panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-light p-5 space-y-4">
            <h3 className="text-lg font-bold font-display text-neutral-dark flex items-center">
              <Activity className="mr-2 text-primary" size={18} />
              Estado de la red
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-dark/70">Ríos activos</span>
                <span className="font-semibold text-primary">{activeRios.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-dark/70">En observación</span>
                <span className="font-semibold text-secondary">{monitoringRios.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-dark/70">En estado crítico</span>
                <span className="font-semibold text-red-600">{criticalRios.length}</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-neutral-dark/60 mb-1">
                <span>Distribución de estados</span>
                <span>{rios.length} en total</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-light/70 overflow-hidden flex">
                <div
                  className="bg-emerald-500"
                  style={{ width: `${(activeRios.length / totalRiosCount) * 100}%` }}
                />
                <div
                  className="bg-amber-400"
                  style={{ width: `${(monitoringRios.length / totalRiosCount) * 100}%` }}
                />
                <div
                  className="bg-rose-500"
                  style={{ width: `${(criticalRios.length / totalRiosCount) * 100}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-neutral-dark/60">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Activos
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Observación
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> Críticos
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-900 text-slate-50 shadow-2xl border border-slate-700 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm md:text-base font-semibold font-display flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-300" />
                Ríos en atención
              </h3>
              <span className="text-[11px] uppercase tracking-wide text-slate-400">Panel de riesgo</span>
            </div>
            {criticalRios.length === 0 && monitoringRios.length === 0 ? (
              <p className="text-xs md:text-sm text-slate-300/80">
                No hay ríos en estado crítico u observación. La red se mantiene estable.
              </p>
            ) : (
              <div className="space-y-2 text-xs md:text-sm">
                {[...criticalRios, ...monitoringRios].slice(0, 4).map((rio) => (
                  <div
                    key={rio.Id}
                    className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-50">
                        {rio.Nombre_del_rio}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {rio.Departamento || 'Sin departamento'} · {rio.Coordenadas || 'Coordenadas no registradas'}
                      </span>
                    </div>
                    <span
                      className={`ml-3 inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusBadgeClass(
                        rio.Estado || ''
                      )}`}
                    >
                      {rio.Estado || 'Sin estado'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Distribución de estados de ríos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-xl border border-primary/10 p-4 md:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold font-display text-neutral-dark">
              Distribución de estados de ríos
            </h2>
            <p className="text-xs md:text-sm text-neutral-dark/60">
              Comparación entre ríos activos, en observación y en estado crítico en la red.
            </p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riverStatusChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#4B5563" style={{ fontSize: '11px' }} />
              <YAxis allowDecimals={false} stroke="#4B5563" style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  fontFamily: 'Inter',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Selected River Details */}
      {selectedRio && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-light">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-neutral-dark">
                  Detalles del Río
                </h3>
                <button
                  onClick={() => setSelectedRio(null)}
                  className="text-neutral-dark/60 hover:text-neutral-dark transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-light/30 rounded-lg">
                  <p className="text-sm text-neutral-dark/60 mb-1">ID</p>
                  <p className="text-lg font-bold text-primary">#{selectedRio.Id}</p>
                </div>
                <div className="p-4 bg-neutral-light/30 rounded-lg">
                  <p className="text-sm text-neutral-dark/60 mb-1">Estado</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadgeClass(selectedRio.Estado || '')}`}>
                    {selectedRio.Estado || 'Sin estado'}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-neutral-light/30 rounded-lg">
                <p className="text-sm text-neutral-dark/60 mb-1">Nombre</p>
                <p className="text-xl font-bold text-neutral-dark">{selectedRio.Nombre_del_rio}</p>
              </div>
              <div className="p-4 bg-neutral-light/30 rounded-lg">
                <p className="text-sm text-neutral-dark/60 mb-1">Departamento</p>
                <p className="text-lg font-semibold text-neutral-dark">{selectedRio.Departamento || 'No especificado'}</p>
              </div>
              <div className="p-4 bg-neutral-light/30 rounded-lg">
                <p className="text-sm text-neutral-dark/60 mb-1">Coordenadas</p>
                <p className="text-lg font-mono text-neutral-dark">{selectedRio.Coordenadas || 'No especificado'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
