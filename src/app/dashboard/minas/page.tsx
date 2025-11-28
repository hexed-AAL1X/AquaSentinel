'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mountain, MapPin, AlertTriangle, TrendingDown, Plus, Factory } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import api from '@/lib/api';
import { useSnackbar } from '@/components/SnackbarProvider';
import { Mina } from '@/types';

export default function MinasPage() {
  const [minas, setMinas] = useState<Mina[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMina, setSelectedMina] = useState<Mina | null>(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchMinas();
  }, []);

  const fetchMinas = async () => {
    try {
      const response = await api.get('/minas');
      if (response.data.success) {
        const data = (response.data.data || []) as Mina[];
        const mapped: Mina[] = data.map((m) => {
          let impacto = m.Impacto_ambiental;
          if (!impacto && typeof m.Nivel_de_polucion === 'number') {
            if (m.Nivel_de_polucion >= 70) impacto = 'Alto';
            else if (m.Nivel_de_polucion >= 30) impacto = 'Medio';
            else impacto = 'Bajo';
          }
          return { ...m, Impacto_ambiental: impacto };
        });
        setMinas(mapped);
      }
    } catch (error) {
      console.error('Error fetching minas:', error);
      showSnackbar({ message: 'Error al cargar datos de minas', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getImpactoColor = (impacto: string) => {
    const lower = impacto?.toLowerCase() || '';
    if (lower.includes('alto') || lower.includes('crítico')) return 'danger';
    if (lower.includes('medio') || lower.includes('moderado')) return 'secondary';
    if (lower.includes('bajo') || lower.includes('mínimo')) return 'success';
    return 'primary';
  };

  const getImpactoBadgeClass = (impacto: string) => {
    const lower = impacto?.toLowerCase() || '';
    if (lower.includes('alto') || lower.includes('crítico')) 
      return 'bg-red-100 text-red-800 border-red-300';
    if (lower.includes('medio') || lower.includes('moderado')) 
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (lower.includes('bajo') || lower.includes('mínimo')) 
      return 'bg-green-100 text-green-800 border-green-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const highImpactMinas = minas.filter(m => m.Impacto_ambiental?.toLowerCase().includes('alto'));
  const mediumImpactMinas = minas.filter(m => m.Impacto_ambiental?.toLowerCase().includes('medio'));
  const lowImpactMinas = minas.filter(m => {
    const lower = m.Impacto_ambiental?.toLowerCase() || '';
    return lower.includes('bajo') || lower.includes('mínimo');
  });
  const totalMinasForDist = Math.max(minas.length, 1);
  const attentionMinas = highImpactMinas.slice(0, 4);

  const impactChartData = [
    { name: 'Alto', value: highImpactMinas.length },
    { name: 'Medio', value: mediumImpactMinas.length },
    { name: 'Bajo/Mínimo', value: lowImpactMinas.length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-lg text-neutral-dark">Cargando datos de minas...</p>
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#f97316] text-white shadow-2xl border border-white/10 px-6 py-6 md:px-10 md:py-8">
          <div className="absolute inset-y-0 right-0 opacity-25 pointer-events-none hidden md:block">
            <div className="h-full w-64 bg-gradient-to-b from-amber-400/40 via-orange-500/30 to-transparent blur-3xl translate-x-12" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Factory className="text-amber-100" size={26} />
              </div>
              <div>
                <p className="uppercase tracking-[0.35em] text-xs text-amber-200/80 mb-1">
                  Minas
                </p>
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold font-display">
                  Monitoreo de minas
                </h1>
                <p className="text-xs md:text-sm text-amber-50/80 mt-1 max-w-xl">
                  Control del impacto ambiental y seguimiento de operaciones mineras registradas.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="rounded-2xl bg-white/10 border border-white/20 px-3 py-2 text-[11px] md:text-xs flex flex-col gap-1">
                <span className="font-semibold">Resumen de operaciones</span>
                <span className="text-amber-100/80">
                  Total minas: <span className="font-semibold text-white">{minas.length}</span>
                </span>
                <span className="text-amber-100/80">
                  Impacto alto: <span className="font-semibold text-white">{highImpactMinas.length}</span> · medio:{' '}
                  <span className="font-semibold text-white">{mediumImpactMinas.length}</span>
                </span>
              </div>
              <button
                className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all text-xs md:text-sm font-semibold shadow-lg hover:shadow-xl"
                onClick={() =>
                  showSnackbar({
                    message: 'Creación de nuevas minas estará disponible próximamente',
                    variant: 'info',
                  })
                }
              >
                <Plus size={18} />
                <span>Nueva Mina</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Columna principal: tabla de minas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="xl:col-span-2"
        >
          <div className="rounded-2xl bg-slate-950/95 text-slate-50 shadow-[0_18px_45px_rgba(15,23,42,0.9)] border border-slate-800/80 overflow-hidden backdrop-blur-sm">
            <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-transparent">
              <h2 className="text-xl md:text-2xl font-bold font-display text-slate-50">Operaciones Mineras</h2>
              <p className="text-[13px] text-slate-400 mt-1">Registro y monitoreo de actividades extractivas</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400/90 uppercase tracking-[0.16em]">
                      Nombre de la Mina
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400/90 uppercase tracking-[0.16em]">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400/90 uppercase tracking-[0.16em]">
                      Minerales
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400/90 uppercase tracking-[0.16em]">
                      Impacto Ambiental
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400/90 uppercase tracking-[0.16em]">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {minas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <Mountain className="text-neutral-dark/20" size={48} />
                          <p className="text-neutral-dark/60">No hay minas registradas</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    minas.map((mina) => (
                      <tr
                        key={mina.Id}
                        className="hover:bg-slate-900/70 transition-colors cursor-pointer"
                        onClick={() => setSelectedMina(mina)}
                      >
                        <td className="px-6 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-amber-500/15 rounded-lg flex items-center justify-center border border-amber-500/30">
                              <Mountain className="text-amber-300" size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-50">
                                {mina.Nombre_de_la_mina || mina.Nombre}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center space-x-2">
                            <MapPin className="text-slate-400" size={14} />
                            <span className="text-xs md:text-sm text-slate-300/90">
                              {mina.Ubicacion || 'No especificado'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-xs md:text-sm text-slate-300/90">
                            {mina.Tipo_de_minerales || 'No especificado'}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getImpactoBadgeClass(mina.Impacto_ambiental || '')}`}>
                            {mina.Impacto_ambiental || 'No evaluado'}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <button className="text-amber-300 hover:text-amber-200 font-semibold text-xs md:text-sm transition-colors">
                            Ver detalles →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Columna lateral: estado + operaciones en atención */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="space-y-4"
        >
          {/* Estado de minas */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-light p-5 space-y-4">
            <h3 className="text-lg font-bold font-display text-neutral-dark flex items-center">
              <Mountain className="mr-2 text-primary" size={18} />
              Estado de operaciones mineras
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-dark/70">Operaciones registradas</span>
                <span className="font-semibold text-neutral-dark">{minas.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-dark/70">Impacto alto</span>
                <span className="font-semibold text-red-600">{highImpactMinas.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-dark/70">Impacto medio</span>
                <span className="font-semibold text-amber-600">{mediumImpactMinas.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-dark/70">Impacto bajo / mínimo</span>
                <span className="font-semibold text-emerald-600">{lowImpactMinas.length}</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-neutral-dark/60 mb-1">
                <span>Distribución de impacto</span>
                <span>{minas.length} en total</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-light/70 overflow-hidden flex">
                <div
                  className="bg-red-500"
                  style={{ width: `${(highImpactMinas.length / totalMinasForDist) * 100}%` }}
                />
                <div
                  className="bg-amber-400"
                  style={{ width: `${(mediumImpactMinas.length / totalMinasForDist) * 100}%` }}
                />
                <div
                  className="bg-emerald-500"
                  style={{ width: `${(lowImpactMinas.length / totalMinasForDist) * 100}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-neutral-dark/60">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500" /> Alto
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Medio
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Bajo / mínimo
                </span>
              </div>
            </div>
          </div>

          {/* Operaciones en atención */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-900 text-slate-50 shadow-2xl border border-slate-700 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm md:text-base font-semibold font-display flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-300" />
                Operaciones en atención
              </h3>
              <span className="text-[11px] uppercase tracking-wide text-slate-400">Panel de riesgo</span>
            </div>
            {attentionMinas.length === 0 ? (
              <p className="text-xs md:text-sm text-slate-300/80">
                No hay minas con impacto alto. La red se mantiene estable.
              </p>
            ) : (
              <div className="space-y-2 text-xs md:text-sm">
                {attentionMinas.map((mina) => (
                  <div
                    key={mina.Id}
                    className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-50">
                        {mina.Nombre_de_la_mina || mina.Nombre}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {mina.Ubicacion || 'Ubicación no especificada'}
                      </span>
                    </div>
                    <span className="ml-3 inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold bg-red-500/10 border-red-400/60 text-red-200">
                      Alto impacto
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Distribución de impacto ambiental */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-xl border border-primary/10 p-4 md:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold font-display text-neutral-dark">
              Distribución de impacto ambiental
            </h2>
            <p className="text-xs md:text-sm text-neutral-dark/60">
              Número de operaciones con impacto alto, medio y bajo/mínimo.
            </p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={impactChartData}>
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
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Selected Mina Details */}
      {selectedMina && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-light">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-neutral-dark">
                  Detalles de la Mina
                </h3>
                <button
                  onClick={() => setSelectedMina(null)}
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
                  <p className="text-lg font-bold text-primary">#{selectedMina.Id}</p>
                </div>
                <div className="p-4 bg-neutral-light/30 rounded-lg">
                  <p className="text-sm text-neutral-dark/60 mb-1">Impacto Ambiental</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getImpactoBadgeClass(selectedMina.Impacto_ambiental || '')}`}>
                    {selectedMina.Impacto_ambiental || 'No evaluado'}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-neutral-light/30 rounded-lg">
                <p className="text-sm text-neutral-dark/60 mb-1">Nombre</p>
                <p className="text-xl font-bold text-neutral-dark">
                  {selectedMina.Nombre_de_la_mina || selectedMina.Nombre}
                </p>
              </div>
              <div className="p-4 bg-neutral-light/30 rounded-lg">
                <p className="text-sm text-neutral-dark/60 mb-1">Ubicación</p>
                <p className="text-lg font-semibold text-neutral-dark">{selectedMina.Ubicacion || 'No especificado'}</p>
              </div>
              <div className="p-4 bg-neutral-light/30 rounded-lg">
                <p className="text-sm text-neutral-dark/60 mb-1">Tipo de Minerales</p>
                <p className="text-lg font-semibold text-neutral-dark">{selectedMina.Tipo_de_minerales || 'No especificado'}</p>
              </div>
              <div className="p-4 bg-neutral-light/30 rounded-lg">
                <p className="text-sm text-neutral-dark/60 mb-1">Coordenadas</p>
                <p className="text-lg font-mono text-neutral-dark">{selectedMina.Coordenadas || 'No especificado'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
