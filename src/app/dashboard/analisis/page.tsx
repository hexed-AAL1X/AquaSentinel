'use client';

import { useState, Suspense, lazy } from 'react';
import { BarChart3, TrendingUp, Activity, Database } from 'lucide-react';
import MetricCard from '@/components/charts/MetricCard';

const ScientificLineChart = lazy(() => import('@/components/charts/ScientificLineChart'));

export default function AnalisisPage() {
  const [selectedMetric, setSelectedMetric] = useState<string>('ph');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('week');

  // Mock data for charts
  const generateMockData = (baseValue: number, variance: number, points: number) => {
    return Array.from({ length: points }, (_, i) => ({
      timestamp: new Date(Date.now() - (points - i) * 3600000).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      value: baseValue + (Math.random() - 0.5) * variance,
    }));
  };

  const phData = generateMockData(7.2, 1.5, 24);
  const turbidityData = generateMockData(45, 20, 24);
  const temperatureData = generateMockData(22.5, 3, 24);
  const doData = generateMockData(8.5, 2, 24);

  const chartConfigs = {
    ph: { data: phData, title: 'pH del Agua', color: '#0077B6', unit: 'pH' },
    turbidity: { data: turbidityData, title: 'Turbidez', color: '#FF6B35', unit: 'NTU' },
    temperature: { data: temperatureData, title: 'Temperatura', color: '#2A9D8F', unit: '°C' },
    do: { data: doData, title: 'Oxígeno Disuelto', color: '#4cc9f0', unit: 'mg/L' },
  };

  const currentConfig = chartConfigs[selectedMetric as keyof typeof chartConfigs];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-neutral-dark mb-1 tracking-wide">
            CENTRO DE ANÁLISIS CIENTÍFICO
          </h1>
          <p className="text-neutral-dark/60 text-sm md:text-base">
            Visualización avanzada de datos y tendencias
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 bg-accent/10 border border-accent/30 rounded-lg">
            <p className="text-sm text-accent font-semibold">
              Actualización en Tiempo Real
            </p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="pH Promedio"
          value="7.2"
          subtitle="Rango óptimo"
          icon={BarChart3}
          color="primary"
          trend={{ value: 2, isPositive: true }}
        />
        <MetricCard
          title="Turbidez Media"
          value="45"
          subtitle="NTU"
          icon={Activity}
          color="secondary"
          trend={{ value: 5, isPositive: false }}
        />
        <MetricCard
          title="Temperatura"
          value="22.5°C"
          subtitle="Promedio diario"
          icon={TrendingUp}
          color="accent"
        />
        <MetricCard
          title="Datos Analizados"
          value="2.4M"
          subtitle="Registros procesados"
          icon={Database}
          color="success"
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-2xl shadow-xl border border-neutral-light p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-display text-neutral-dark">Panel de Control</h2>
          <div className="flex items-center space-x-4">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold"
            >
              <option value="ph">pH del Agua</option>
              <option value="turbidity">Turbidez</option>
              <option value="temperature">Temperatura</option>
              <option value="do">Oxígeno Disuelto</option>
            </select>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold"
            >
              <option value="day">Últimas 24 horas</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="year">Último año</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-2xl shadow-xl border border-primary/15 p-6">
        <div className="h-96">
          <Suspense fallback={
            <div className="h-full flex items-center justify-center">
              <div className="text-neutral-dark/60">Cargando gráfico...</div>
            </div>
          }>
            <ScientificLineChart
              data={currentConfig.data}
              dataKey={selectedMetric}
              color={currentConfig.color}
              title={currentConfig.title}
              unit={currentConfig.unit}
            />
          </Suspense>
        </div>
      </div>

      {/* Statistical Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-light p-6">
          <h3 className="text-xl font-bold font-display text-neutral-dark mb-4">Análisis Estadístico</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-light/30 rounded-lg">
              <span className="text-sm font-medium text-neutral-dark/70">Media</span>
              <span className="text-lg font-bold text-primary">
                {(currentConfig.data.reduce((sum, d) => sum + d.value, 0) / currentConfig.data.length).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-light/30 rounded-lg">
              <span className="text-sm font-medium text-neutral-dark/70">Máximo</span>
              <span className="text-lg font-bold text-secondary">
                {Math.max(...currentConfig.data.map(d => d.value)).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-light/30 rounded-lg">
              <span className="text-sm font-medium text-neutral-dark/70">Mínimo</span>
              <span className="text-lg font-bold text-accent">
                {Math.min(...currentConfig.data.map(d => d.value)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-neutral-light p-6">
          <h3 className="text-xl font-bold font-display text-neutral-dark mb-4">Tendencias</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-800 mb-1">Tendencia Positiva</p>
              <p className="text-xs text-green-700">Los valores se mantienen dentro del rango óptimo</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-800 mb-1">Estabilidad</p>
              <p className="text-xs text-blue-700">Variación mínima en las últimas mediciones</p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-yellow-800 mb-1">Monitoreo</p>
              <p className="text-xs text-yellow-700">Se recomienda seguimiento continuo</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-neutral-light p-6">
          <h3 className="text-xl font-bold font-display text-neutral-dark mb-4">Predicciones</h3>
          <div className="space-y-4">
            <div className="p-4 bg-neutral-light/30 rounded-lg">
              <p className="text-sm font-medium text-neutral-dark/70 mb-2">Próximas 6 horas</p>
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-green-500" size={20} />
                <span className="text-lg font-bold text-neutral-dark">Estable</span>
              </div>
            </div>
            <div className="p-4 bg-neutral-light/30 rounded-lg">
              <p className="text-sm font-medium text-neutral-dark/70 mb-2">Próximas 24 horas</p>
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-blue-500" size={20} />
                <span className="text-lg font-bold text-neutral-dark">Normal</span>
              </div>
            </div>
            <div className="p-4 bg-neutral-light/30 rounded-lg">
              <p className="text-sm font-medium text-neutral-dark/70 mb-2">Confianza</p>
              <div className="w-full bg-neutral-light rounded-full h-2 mt-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }} />
              </div>
              <span className="text-xs text-neutral-dark/60 mt-1">87% precisión</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Analysis */}
      <div className="bg-gradient-to-br from-white to-neutral-light/50 rounded-2xl shadow-xl border border-neutral-light p-6">
        <h2 className="text-2xl font-bold font-display text-neutral-dark mb-6">Análisis Comparativo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-xl border border-neutral-light">
            <h3 className="text-lg font-bold text-neutral-dark mb-4">Comparación Semanal</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-dark/70">Semana Actual</span>
                <span className="text-lg font-bold text-primary">100%</span>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-3">
                <div className="bg-primary h-3 rounded-full" style={{ width: '100%' }} />
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-neutral-dark/70">Semana Anterior</span>
                <span className="text-lg font-bold text-accent">92%</span>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-3">
                <div className="bg-accent h-3 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-xl border border-neutral-light">
            <h3 className="text-lg font-bold text-neutral-dark mb-4">Eficiencia del Sistema</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-dark/70">Uptime</span>
                <span className="text-lg font-bold text-green-600">99.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-dark/70">Precisión</span>
                <span className="text-lg font-bold text-blue-600">98.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-dark/70">Cobertura</span>
                <span className="text-lg font-bold text-purple-600">95.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
