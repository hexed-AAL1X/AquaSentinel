'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, TrendingUp, Database, Plus, Download } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import api from '@/lib/api';
import { useSnackbar } from '@/components/SnackbarProvider';
import { LecturaSensor } from '@/types';

type Medicion = LecturaSensor & {
  Rio_asignado?: string;
  Sensor_id?: string;
};

export default function MedicionesPage() {
  const [mediciones, setMediciones] = useState<Medicion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRio, setFilterRio] = useState<string>('all');
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchMediciones();
  }, []);

  const fetchMediciones = async () => {
    try {
      const response = await api.get('/lecturas-sensor');
      if (response.data.success) {
        const data = (response.data.data || []) as LecturaSensor[];
        const mapped: Medicion[] = data.map((item, index) => ({
          ...item,
          // Sin relación directa a sensores o ríos por ahora, usamos el Id como identificador de vista
          Sensor_id: item.Id ?? `SENS-${String(index + 1).padStart(3, '0')}`,
        }));
        setMediciones(mapped);
      }
    } catch (error) {
      console.error('Error fetching mediciones:', error);
      showSnackbar({ message: 'Error al cargar mediciones', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filteredMediciones = filterRio === 'all' 
    ? mediciones 
    : mediciones.filter(m => m.Rio_asignado === filterRio);

  const averageReading = mediciones.length > 0
    ? (mediciones.reduce((sum, m) => sum + m.Lectura_obtenida, 0) / mediciones.length).toFixed(2)
    : '0';

  const todayReadings = mediciones.filter(m => {
    const today = new Date().toDateString();
    const readingDate = new Date(m.Fecha_de_lectura).toDateString();
    return today === readingDate;
  }).length;

  const optimalReadings = mediciones.filter(m => m.Lectura_obtenida < 30).length;
  const moderateReadings = mediciones.filter(m => m.Lectura_obtenida >= 30 && m.Lectura_obtenida < 70).length;
  const highReadings = mediciones.filter(m => m.Lectura_obtenida >= 70).length;
  const totalReadingsForDist = Math.max(mediciones.length, 1);
  const attentionReadings = mediciones
    .filter(m => m.Lectura_obtenida >= 70)
    .slice(0, 4);

  const measurementsByDayMap: Record<string, { date: string; count: number; sum: number }> = {};

  mediciones.forEach((m) => {
    const key = new Date(m.Fecha_de_lectura).toISOString().slice(0, 10);
    if (!measurementsByDayMap[key]) {
      measurementsByDayMap[key] = { date: key, count: 0, sum: 0 };
    }
    measurementsByDayMap[key].count += 1;
    measurementsByDayMap[key].sum += m.Lectura_obtenida;
  });

  const measurementTrendData = Object.values(measurementsByDayMap)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-10)
    .map((d) => ({
      day: d.date.slice(5),
      avg: Number((d.sum / d.count).toFixed(2)),
      count: d.count,
    }));

  const handleExportData = () => {
    try {
      const payload = {
        generadoEn: new Date().toISOString(),
        total: mediciones.length,
        mediciones,
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mediciones-aquasentinel.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSnackbar({ message: 'Exportación de datos iniciada', variant: 'info' });
    } catch (error) {
      console.error('Error exporting mediciones:', error);
      showSnackbar({ message: 'No se pudieron exportar los datos', variant: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-lg text-neutral-dark">Cargando mediciones...</p>
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#16a34a] text-white shadow-2xl border border-white/10 px-6 py-6 md:px-10 md:py-8">
          <div className="absolute inset-y-0 right-0 opacity-20 pointer-events-none hidden md:block">
            <div className="h-full w-64 bg-gradient-to-b from-emerald-400/40 via-lime-500/30 to-transparent blur-3xl translate-x-12" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Database className="text-emerald-100" size={26} />
              </div>
              <div>
                <p className="uppercase tracking-[0.35em] text-xs text-emerald-200/80 mb-1">
                  Mediciones
                </p>
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold font-display">
                  Registro de mediciones
                </h1>
                <p className="text-xs md:text-sm text-emerald-50/80 mt-1 max-w-xl">
                  Datos históricos y en tiempo real de sensores de calidad del agua.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="rounded-2xl bg-white/10 border border-white/20 px-3 py-2 text-[11px] md:text-xs flex flex-col gap-1">
                <span className="font-semibold">Resumen rápido</span>
                <span className="text-emerald-100/80">
                  Total registros: <span className="font-semibold text-white">{mediciones.length}</span>
                </span>
                <span className="text-emerald-100/80">
                  Hoy: <span className="font-semibold text-white">{todayReadings}</span> lecturas
                </span>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 transition-all shadow-lg hover:shadow-xl text-xs md:text-sm font-semibold"
                  onClick={handleExportData}
                >
                  <Download size={18} />
                  <span>Exportar Datos</span>
                </button>
                <button
                  className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all text-xs md:text-sm font-semibold"
                  onClick={() =>
                    showSnackbar({
                      message: 'Registro manual de mediciones estará disponible próximamente',
                      variant: 'info',
                    })
                  }
                >
                  <Plus size={18} />
                  <span>Nueva Medición</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Columna principal: filtro + tabla */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="xl:col-span-2 space-y-4"
        >
          {/* Filtro */}
          <div className="bg-white rounded-2xl shadow-xl border border-primary/15 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-display text-neutral-dark">Filtrar Mediciones</h2>
              <select
                value={filterRio}
                onChange={(e) => setFilterRio(e.target.value)}
                className="px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              >
                <option value="all">Todos los Ríos</option>
                {Array.from(new Set(mediciones.map(m => m.Rio_asignado))).map(rio => (
                  <option key={rio} value={rio || ''}>{rio}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabla de datos de sensores */}
          <div className="rounded-2xl bg-slate-950/95 text-slate-50 shadow-[0_18px_45px_rgba(15,23,42,0.9)] border border-slate-800/80 overflow-hidden backdrop-blur-sm">
            <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-emerald-500/10 via-slate-900/60 to-transparent">
              <h2 className="text-xl md:text-2xl font-bold font-display text-slate-50">Datos de Sensores</h2>
              <p className="text-[13px] text-slate-400 mt-1">Lecturas ordenadas cronológicamente por sensor y río</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400/90 uppercase tracking-[0.16em]">
                      Sensor
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400/90 uppercase tracking-[0.16em]">
                      Río Asignado
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400/90 uppercase tracking-[0.16em]">
                      Lectura
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400/90 uppercase tracking-[0.16em]">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400/90 uppercase tracking-[0.16em]">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredMediciones.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <Activity className="text-neutral-dark/20" size={48} />
                          <p className="text-neutral-dark/60">No hay mediciones registradas</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredMediciones.slice(0, 20).map((medicion) => (
                      <tr
                        key={medicion.Id}
                        className="hover:bg-slate-900/70 transition-colors"
                      >
                        <td className="px-6 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-emerald-500/15 rounded-lg flex items-center justify-center border border-emerald-500/30">
                              <Activity className="text-emerald-300" size={18} />
                            </div>
                            <span className="text-sm font-semibold text-slate-50">
                              {medicion.Sensor_id}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-xs md:text-sm text-slate-300/90">
                            {medicion.Rio_asignado}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-base md:text-lg font-bold text-emerald-300">
                            {medicion.Lectura_obtenida.toFixed(2)}
                          </span>
                          <span className="text-xs md:text-sm text-slate-400 ml-1">ppm</span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-xs md:text-sm text-slate-300/90">
                            {new Date(medicion.Fecha_de_lectura).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            medicion.Lectura_obtenida < 30 
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : medicion.Lectura_obtenida < 70
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                              : 'bg-red-100 text-red-800 border-red-300'
                          }`}>
                            {medicion.Lectura_obtenida < 30 ? 'Óptimo' : medicion.Lectura_obtenida < 70 ? 'Moderado' : 'Alto'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Columna lateral: estado + lecturas en atención */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="space-y-4"
        >
          {/* Estado de lecturas */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-light p-5 space-y-4">
            <h3 className="text-lg font-bold font-display text-neutral-dark flex items-center">
              <Activity className="mr-2 text-primary" size={18} />
              Estado de las lecturas
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-dark/70">Lecturas óptimas</span>
                <span className="font-semibold text-emerald-600">{optimalReadings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-dark/70">Lecturas moderadas</span>
                <span className="font-semibold text-amber-600">{moderateReadings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-dark/70">Lecturas altas</span>
                <span className="font-semibold text-red-600">{highReadings}</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-neutral-dark/60 mb-1">
                <span>Distribución de estados</span>
                <span>{mediciones.length} en total</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-light/70 overflow-hidden flex">
                <div
                  className="bg-emerald-500"
                  style={{ width: `${(optimalReadings / totalReadingsForDist) * 100}%` }}
                />
                <div
                  className="bg-amber-400"
                  style={{ width: `${(moderateReadings / totalReadingsForDist) * 100}%` }}
                />
                <div
                  className="bg-rose-500"
                  style={{ width: `${(highReadings / totalReadingsForDist) * 100}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-neutral-dark/60">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Óptimas
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Moderadas
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> Altas
                </span>
              </div>
            </div>
          </div>

          {/* Panel lecturas en atención */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900 text-slate-50 shadow-2xl border border-slate-700 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm md:text-base font-semibold font-display flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-300" />
                Lecturas en atención
              </h3>
              <span className="text-[11px] uppercase tracking-wide text-slate-400">Panel de riesgo</span>
            </div>
            {attentionReadings.length === 0 ? (
              <p className="text-xs md:text-sm text-slate-300/80">
                No hay lecturas en rango alto. El sistema se mantiene estable.
              </p>
            ) : (
              <div className="space-y-2 text-xs md:text-sm">
                {attentionReadings.map((m) => (
                  <div
                    key={m.Id}
                    className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-50">
                        {m.Sensor_id}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {m.Rio_asignado || 'Sin río asignado'}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-rose-300">
                      {m.Lectura_obtenida.toFixed(2)} ppm
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Tendencia reciente de mediciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-xl border border-primary/10 p-4 md:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold font-display text-neutral-dark">
              Tendencia reciente de mediciones
            </h2>
            <p className="text-xs md:text-sm text-neutral-dark/60">
              Promedio diario de lectura y número de registros en los últimos días.
            </p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={measurementTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#4B5563" style={{ fontSize: '11px' }} />
              <YAxis
                yAxisId="left"
                stroke="#16a34a"
                style={{ fontSize: '11px' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#0f766e"
                style={{ fontSize: '11px' }}
              />
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
                yAxisId="left"
                type="monotone"
                dataKey="avg"
                name="Promedio (ppm)"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#22c55e' }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="count"
                name="Nº mediciones"
                stroke="#0f766e"
                strokeWidth={2}
                dot={{ r: 3, fill: '#0f766e' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
