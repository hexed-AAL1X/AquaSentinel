'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, CheckCircle, Clock, Plus } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useSnackbar } from '@/components/SnackbarProvider';

interface Anomalia {
  Id: number;
  Tipo: string;
  Descripcion: string;
  Severidad: 'Crítica' | 'Alta' | 'Media' | 'Baja';
  Estado: 'Activa' | 'En Proceso' | 'Resuelta';
  Rio_asignado: string;
  Fecha_deteccion: string;
  Valor_detectado?: number;
}

export default function AnomaliasPage() {
  const [anomalias, setAnomalias] = useState<Anomalia[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchAnomalias();
  }, []);

  const fetchAnomalias = async () => {
    try {
      // Mock data - replace with actual API call when endpoint is ready
      const mockData: Anomalia[] = [
        {
          Id: 1,
          Tipo: 'pH Extremo',
          Descripcion: 'Nivel de pH fuera del rango aceptable detectado en el Río Cauca',
          Severidad: 'Crítica',
          Estado: 'Activa',
          Rio_asignado: 'Río Cauca',
          Fecha_deteccion: new Date(Date.now() - 2 * 3600000).toISOString(),
          Valor_detectado: 9.5,
        },
        {
          Id: 2,
          Tipo: 'Turbidez Alta',
          Descripcion: 'Aumento significativo en turbidez, posible contaminación',
          Severidad: 'Alta',
          Estado: 'En Proceso',
          Rio_asignado: 'Río Magdalena',
          Fecha_deteccion: new Date(Date.now() - 5 * 3600000).toISOString(),
          Valor_detectado: 85,
        },
        {
          Id: 3,
          Tipo: 'Temperatura Anormal',
          Descripcion: 'Temperatura del agua superior a la media histórica',
          Severidad: 'Media',
          Estado: 'Resuelta',
          Rio_asignado: 'Río Amazonas',
          Fecha_deteccion: new Date(Date.now() - 24 * 3600000).toISOString(),
          Valor_detectado: 32,
        },
        {
          Id: 4,
          Tipo: 'Oxígeno Disuelto Bajo',
          Descripcion: 'Concentración de oxígeno disuelto por debajo del mínimo',
          Severidad: 'Crítica',
          Estado: 'Activa',
          Rio_asignado: 'Río Orinoco',
          Fecha_deteccion: new Date(Date.now() - 1 * 3600000).toISOString(),
          Valor_detectado: 3.2,
        },
        {
          Id: 5,
          Tipo: 'Contaminante Detectado',
          Descripcion: 'Presencia de metales pesados detectada',
          Severidad: 'Alta',
          Estado: 'En Proceso',
          Rio_asignado: 'Río Cauca',
          Fecha_deteccion: new Date(Date.now() - 12 * 3600000).toISOString(),
          Valor_detectado: 0.8,
        },
      ];
      setAnomalias(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching anomalias:', error);
      showSnackbar({ message: 'Error al cargar anomalías', variant: 'error' });
      setLoading(false);
    }
  };

  const filteredAnomalias = anomalias.filter(a => {
    if (filterSeverity !== 'all' && a.Severidad !== filterSeverity) return false;
    if (filterStatus !== 'all' && a.Estado !== filterStatus) return false;
    return true;
  });

  const getSeverityColor = (severidad: string) => {
    switch (severidad) {
      case 'Crítica': return 'danger';
      case 'Alta': return 'secondary';
      case 'Media': return 'primary';
      case 'Baja': return 'accent';
      default: return 'primary';
    }
  };

  const getSeverityBadgeClass = (severidad: string) => {
    switch (severidad) {
      case 'Crítica': return 'bg-red-100 text-red-800 border-red-300';
      case 'Alta': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Media': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Baja': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusBadgeClass = (estado: string) => {
    switch (estado) {
      case 'Activa': return 'bg-red-100 text-red-800 border-red-300';
      case 'En Proceso': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Resuelta': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const activeAnomalias = anomalias.filter(a => a.Estado === 'Activa');
  const inProcessAnomalias = anomalias.filter(a => a.Estado === 'En Proceso');
  const criticalAnomalias = anomalias.filter(a => a.Severidad === 'Crítica');
  const resolvedAnomalias = anomalias.filter(a => a.Estado === 'Resuelta');
  const totalAnomaliasForDist = Math.max(anomalias.length, 1);
  const attentionAnomalias = anomalias
    .filter(a => a.Estado === 'Activa' || a.Severidad === 'Crítica')
    .slice(0, 4);

  const severityChartData = ['Crítica', 'Alta', 'Media', 'Baja'].map((sev) => ({
    name: sev,
    value: anomalias.filter((a) => a.Severidad === sev).length,
  }));

  const handleResolveAnomalia = (id: number) => {
    setAnomalias(prev =>
      prev.map(a => (a.Id === id ? { ...a, Estado: 'Resuelta' } : a))
    );

    showSnackbar({
      message: `Anomalía #${id} marcada como resuelta`,
      variant: 'success',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-lg text-neutral-dark">Cargando anomalías...</p>
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#dc2626] text-white shadow-2xl border border-white/10 px-6 py-6 md:px-10 md:py-8">
          <div className="absolute inset-y-0 right-0 opacity-25 pointer-events-none hidden md:block">
            <div className="h-full w-64 bg-gradient-to-b from-red-400/40 via-amber-500/30 to-transparent blur-3xl translate-x-12" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <AlertTriangle className="text-red-100" size={26} />
              </div>
              <div>
                <p className="uppercase tracking-[0.35em] text-xs text-red-200/80 mb-1">
                  Anomalías
                </p>
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold font-display">
                  Detección de anomalías
                </h1>
                <p className="text-xs md:text-sm text-red-50/80 mt-1 max-w-xl">
                  Alertas y eventos críticos generados por el sistema de monitoreo hidrológico.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="rounded-2xl bg-white/10 border border-white/20 px-3 py-2 text-[11px] md:text-xs flex flex-col gap-1">
                <span className="font-semibold">Resumen de estado</span>
                <span className="text-red-100/80">
                  Totales: <span className="font-semibold text-white">{anomalias.length}</span>
                </span>
                <span className="text-red-100/80">
                  Activas: <span className="font-semibold text-white">{activeAnomalias.length}</span> · Críticas:{' '}
                  <span className="font-semibold text-white">{criticalAnomalias.length}</span>
                </span>
              </div>
              <button
                className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all text-xs md:text-sm font-semibold shadow-lg hover:shadow-xl"
                onClick={() =>
                  showSnackbar({
                    message: 'Reporte manual de anomalías estará disponible próximamente',
                    variant: 'info',
                  })
                }
              >
                <Plus size={18} />
                <span>Reportar Anomalía</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
 
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Columna principal: filtros + listado de anomalías */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="xl:col-span-2 space-y-4"
        >
          {/* Filter Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-light p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-display text-neutral-dark">Filtrar Anomalías</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                >
                  <option value="all">Todas las Severidades</option>
                  <option value="Crítica">Crítica</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                >
                  <option value="all">Todos los Estados</option>
                  <option value="Activa">Activa</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Resuelta">Resuelta</option>
                </select>
              </div>
            </div>
          </div>

          {/* Anomalies Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredAnomalias.length === 0 ? (
              <div className="rounded-2xl bg-slate-950/95 text-slate-50 shadow-[0_18px_45px_rgba(15,23,42,0.9)] border border-slate-800/80 p-10 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <CheckCircle className="text-emerald-400" size={56} />
                  <h3 className="text-xl md:text-2xl font-bold font-display text-slate-50">No hay anomalías</h3>
                  <p className="text-sm md:text-base text-slate-400">
                    Todos los sistemas operan dentro de los parámetros definidos por AquaSentinel.
                  </p>
                </div>
              </div>
            ) : (
              filteredAnomalias.map((anomalia) => (
                <div
                  key={anomalia.Id}
                  className="rounded-2xl bg-slate-950/95 text-slate-50 shadow-[0_18px_45px_rgba(15,23,42,0.9)] border border-slate-800/80 overflow-hidden hover:border-red-500/70 hover:bg-slate-900/80 transition-all backdrop-blur-sm"
                >
                  <div
                    className={`h-1.5 w-full ${
                      anomalia.Severidad === 'Crítica'
                        ? 'bg-gradient-to-r from-red-500 via-red-400 to-amber-400'
                        : anomalia.Severidad === 'Alta'
                        ? 'bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300'
                        : anomalia.Severidad === 'Media'
                        ? 'bg-gradient-to-r from-yellow-400 via-amber-300 to-sky-400'
                        : 'bg-gradient-to-r from-sky-500 via-blue-400 to-cyan-400'
                    }`}
                  />
                  <div className="p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-3 rounded-xl border ${
                            anomalia.Severidad === 'Crítica'
                              ? 'bg-red-500/20 border-red-500/50'
                              : anomalia.Severidad === 'Alta'
                              ? 'bg-orange-500/20 border-orange-500/50'
                              : anomalia.Severidad === 'Media'
                              ? 'bg-yellow-500/20 border-yellow-500/50'
                              : 'bg-blue-500/20 border-blue-500/50'
                          }`}
                        >
                          <AlertTriangle
                            className={
                              anomalia.Severidad === 'Crítica'
                                ? 'text-red-300'
                                : anomalia.Severidad === 'Alta'
                                ? 'text-orange-300'
                                : anomalia.Severidad === 'Media'
                                ? 'text-yellow-300'
                                : 'text-blue-300'
                            }
                            size={22}
                          />
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-bold text-slate-50 mb-1">
                            {anomalia.Tipo}
                          </h3>
                          <p className="text-xs md:text-sm text-slate-300 mb-2">
                            {anomalia.Descripcion}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] md:text-xs text-slate-400">
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{new Date(anomalia.Fecha_deteccion).toLocaleString()}</span>
                            </div>
                            <span>•</span>
                            <span>{anomalia.Rio_asignado}</span>
                            {anomalia.Valor_detectado && (
                              <>
                                <span>•</span>
                                <span className="font-semibold text-red-300">
                                  Valor: {anomalia.Valor_detectado}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2 text-[11px] md:text-xs">
                        <span
                          className={`px-3 py-1 rounded-full font-semibold border ${getSeverityBadgeClass(
                            anomalia.Severidad
                          )}`}
                        >
                          {anomalia.Severidad}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full font-semibold border ${getStatusBadgeClass(
                            anomalia.Estado
                          )}`}
                        >
                          {anomalia.Estado}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button className="px-4 py-2 text-xs md:text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg font-semibold transition-all">
                        Ver Detalles
                      </button>
                      {anomalia.Estado !== 'Resuelta' && (
                        <button
                          className="px-4 py-2 text-xs md:text-sm bg-red-500 text-white hover:bg-red-400 rounded-lg font-semibold transition-all"
                          onClick={() => handleResolveAnomalia(anomalia.Id)}
                        >
                          Resolver
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Columna lateral: estado + alertas en atención */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="space-y-4"
        >
          {/* Estado de anomalías */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-light p-5 space-y-4">
            <h3 className="text-lg font-bold font-display text-neutral-dark flex items-center">
              <AlertCircle className="mr-2 text-primary" size={18} />
              Estado de alertas
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-dark/70">Anomalías registradas</span>
                <span className="font-semibold text-neutral-dark">{anomalias.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-dark/70">Activas</span>
                <span className="font-semibold text-red-600">{activeAnomalias.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-dark/70">En proceso</span>
                <span className="font-semibold text-amber-600">{inProcessAnomalias.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-dark/70">Resueltas</span>
                <span className="font-semibold text-emerald-600">{resolvedAnomalias.length}</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-neutral-dark/60 mb-1">
                <span>Distribución por estado</span>
                <span>{anomalias.length} en total</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-light/70 overflow-hidden flex">
                <div
                  className="bg-red-500"
                  style={{ width: `${(activeAnomalias.length / totalAnomaliasForDist) * 100}%` }}
                />
                <div
                  className="bg-amber-400"
                  style={{ width: `${(inProcessAnomalias.length / totalAnomaliasForDist) * 100}%` }}
                />
                <div
                  className="bg-emerald-500"
                  style={{ width: `${(resolvedAnomalias.length / totalAnomaliasForDist) * 100}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-neutral-dark/60">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500" /> Activas
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> En proceso
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Resueltas
                </span>
              </div>
            </div>
          </div>

          {/* Alertas en atención */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-red-900 text-slate-50 shadow-2xl border border-slate-700 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm md:text-base font-semibold font-display flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-300" />
                Alertas en atención
              </h3>
              <span className="text-[11px] uppercase tracking-wide text-slate-400">Panel de riesgo</span>
            </div>
            {attentionAnomalias.length === 0 ? (
              <p className="text-xs md:text-sm text-slate-300/80">
                No hay anomalías críticas o activas pendientes de atención inmediata.
              </p>
            ) : (
              <div className="space-y-2 text-xs md:text-sm">
                {attentionAnomalias.map((anomalia) => (
                  <div
                    key={anomalia.Id}
                    className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-50">
                        {anomalia.Tipo}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {anomalia.Rio_asignado}
                      </span>
                    </div>
                    <span className="ml-3 inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold bg-red-500/10 border-red-400/60 text-red-200">
                      {anomalia.Severidad}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Distribución de severidad de anomalías */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-xl border border-primary/10 p-4 md:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold font-display text-neutral-dark">
              Distribución de severidad de anomalías
            </h2>
            <p className="text-xs md:text-sm text-neutral-dark/60">
              Cantidad de alertas por nivel de severidad detectado en la red.
            </p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severityChartData}>
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
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
