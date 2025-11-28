'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Filter, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import MetricCard from '@/components/charts/MetricCard';
import { useSnackbar } from '@/components/SnackbarProvider';

interface Report {
  Id: number;
  Titulo: string;
  Tipo: 'Calidad de Agua' | 'Impacto Ambiental' | 'Mantenimiento' | 'Anomalías';
  Fecha_generacion: string;
  Periodo: string;
  Rio_asignado?: string;
  Estado: 'Generado' | 'En Proceso' | 'Pendiente';
  Formato: 'PDF' | 'Excel' | 'CSV';
}

export default function ReportesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [selectedType, setSelectedType] = useState<string>('all');
  const { showSnackbar } = useSnackbar();

  const reports: Report[] = [
    {
      Id: 1,
      Titulo: 'Reporte Mensual de Calidad - Río Cauca',
      Tipo: 'Calidad de Agua',
      Fecha_generacion: new Date().toISOString(),
      Periodo: 'Noviembre 2024',
      Rio_asignado: 'Río Cauca',
      Estado: 'Generado',
      Formato: 'PDF',
    },
    {
      Id: 2,
      Titulo: 'Análisis de Impacto Minero - Región Andina',
      Tipo: 'Impacto Ambiental',
      Fecha_generacion: new Date(Date.now() - 86400000).toISOString(),
      Periodo: 'Q4 2024',
      Estado: 'Generado',
      Formato: 'Excel',
    },
    {
      Id: 3,
      Titulo: 'Informe de Mantenimiento de Sensores',
      Tipo: 'Mantenimiento',
      Fecha_generacion: new Date(Date.now() - 172800000).toISOString(),
      Periodo: 'Noviembre 2024',
      Estado: 'En Proceso',
      Formato: 'PDF',
    },
    {
      Id: 4,
      Titulo: 'Reporte de Anomalías Detectadas',
      Tipo: 'Anomalías',
      Fecha_generacion: new Date(Date.now() - 259200000).toISOString(),
      Periodo: 'Octubre-Noviembre 2024',
      Estado: 'Generado',
      Formato: 'CSV',
    },
  ];

  const filteredReports = reports.filter(r => {
    if (selectedType !== 'all' && r.Tipo !== selectedType) return false;
    return true;
  });

  const generatedReports = reports.filter(r => r.Estado === 'Generado');
  const pendingReports = reports.filter(r => r.Estado === 'Pendiente' || r.Estado === 'En Proceso');

  const getTypeBadgeClass = (tipo: string) => {
    switch (tipo) {
      case 'Calidad de Agua': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Impacto Ambiental': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Mantenimiento': return 'bg-green-100 text-green-800 border-green-300';
      case 'Anomalías': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleDownloadReport = (report: Report) => {
    try {
      const payload = {
        ...report,
        descargadoEn: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-${report.Id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const getStatusBadgeClass = (estado: string) => {
    switch (estado) {
      case 'Generado': return 'bg-green-100 text-green-800 border-green-300';
      case 'En Proceso': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Pendiente': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#4f46e5] text-white shadow-2xl border border-white/10 px-6 py-6 md:px-10 md:py-8">
          <div className="absolute inset-y-0 right-0 opacity-25 pointer-events-none hidden md:block">
            <div className="h-full w-64 bg-gradient-to-b from-indigo-400/40 via-sky-500/30 to-transparent blur-3xl translate-x-12" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <FileText className="text-indigo-100" size={26} />
              </div>
              <div>
                <p className="uppercase tracking-[0.35em] text-xs text-indigo-200/80 mb-1">
                  Reportes
                </p>
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold font-display">
                  Centro de reportes
                </h1>
                <p className="text-xs md:text-sm text-indigo-50/80 mt-1 max-w-xl">
                  Generación, descarga y filtrado de informes técnicos de la plataforma.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="rounded-2xl bg-white/10 border border-white/20 px-3 py-2 text-[11px] md:text-xs flex flex-col gap-1">
                <span className="font-semibold">Resumen de reportes</span>
                <span className="text-indigo-100/80">
                  Totales: <span className="font-semibold text-white">{reports.length}</span>
                </span>
                <span className="text-indigo-100/80">
                  Listos para descarga:{' '}
                  <span className="font-semibold text-white">{generatedReports.length}</span>
                </span>
              </div>
              <button
                className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all text-xs md:text-sm font-semibold shadow-lg hover:shadow-xl"
                onClick={() =>
                  showSnackbar({
                    message: 'Generación avanzada de reportes estará disponible próximamente',
                    variant: 'info',
                  })
                }
              >
                <FileText size={18} />
                <span>Generar Nuevo Reporte</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Reportes Totales"
          value={reports.length}
          subtitle="Generados"
          icon={FileText}
          color="primary"
        />
        <MetricCard
          title="Listos para Descarga"
          value={generatedReports.length}
          subtitle="Disponibles"
          icon={Download}
          color="success"
        />
        <MetricCard
          title="En Proceso"
          value={pendingReports.length}
          subtitle="Generando"
          icon={Calendar}
          color="secondary"
        />
        <MetricCard
          title="Este Mes"
          value={reports.filter(r => new Date(r.Fecha_generacion).getMonth() === new Date().getMonth()).length}
          subtitle="Reportes generados"
          icon={TrendingUp}
          color="accent"
          trend={{ value: 18, isPositive: true }}
        />
      </div>

      {/* Quick Report Generation */}
      <div className="bg-gradient-to-br from-primary to-accent rounded-2xl shadow-xl p-8 text-white">
        <h2 className="text-2xl font-bold font-display mb-4">Generación Rápida de Reportes</h2>
        <p className="mb-6 opacity-90">Crea informes personalizados en segundos</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all cursor-pointer border border-white/20">
            <BarChart3 className="mb-4" size={32} />
            <h3 className="font-bold text-lg mb-2">Calidad de Agua</h3>
            <p className="text-sm opacity-80">Análisis de parámetros fisicoquímicos</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all cursor-pointer border border-white/20">
            <PieChart className="mb-4" size={32} />
            <h3 className="font-bold text-lg mb-2">Impacto Ambiental</h3>
            <p className="text-sm opacity-80">Evaluación de efectos mineros</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all cursor-pointer border border-white/20">
            <TrendingUp className="mb-4" size={32} />
            <h3 className="font-bold text-lg mb-2">Tendencias</h3>
            <p className="text-sm opacity-80">Análisis histórico y proyecciones</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-primary/15 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-display text-neutral-dark flex items-center">
            <Filter className="mr-2" size={24} />
            Filtrar Reportes
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="all">Todos los Tipos</option>
              <option value="Calidad de Agua">Calidad de Agua</option>
              <option value="Impacto Ambiental">Impacto Ambiental</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Anomalías">Anomalías</option>
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
              <option value="quarter">Este Trimestre</option>
              <option value="year">Este Año</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="bg-white rounded-2xl shadow-xl border border-primary/15 overflow-hidden">
        <div className="p-6 border-b border-neutral-light">
          <h2 className="text-2xl font-bold font-display text-neutral-dark">Reportes Generados</h2>
          <p className="text-neutral-dark/60 mt-1">Historial de informes técnicos</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-light/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-neutral-dark uppercase tracking-wider">
                  Título del Reporte
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-neutral-dark uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-neutral-dark uppercase tracking-wider">
                  Periodo
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-neutral-dark uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-neutral-dark uppercase tracking-wider">
                  Formato
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-neutral-dark uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-light">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <FileText className="text-neutral-dark/20" size={48} />
                      <p className="text-neutral-dark/60">No hay reportes disponibles</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report.Id}
                    className="hover:bg-neutral-light/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="text-primary" size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-dark">
                            {report.Titulo}
                          </p>
                          {report.Rio_asignado && (
                            <p className="text-xs text-neutral-dark/60">
                              {report.Rio_asignado}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeBadgeClass(report.Tipo)}`}>
                        {report.Tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-dark/70">
                        {report.Periodo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(report.Estado)}`}>
                        {report.Estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-neutral-dark/70">
                        {report.Formato}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg font-semibold transition-all"
                        disabled={report.Estado !== 'Generado'}
                        onClick={report.Estado === 'Generado' ? () => handleDownloadReport(report) : undefined}
                      >
                        <Download size={16} />
                        <span>Descargar</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
