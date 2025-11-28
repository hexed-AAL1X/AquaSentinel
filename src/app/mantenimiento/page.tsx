'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import { Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/api';
import { Mantenimiento } from '@/types';

export default function MantenimientoPage() {
  const [mantenimiento, setMantenimiento] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMantenimiento();
  }, []);

  const fetchMantenimiento = async () => {
    try {
      const response = await api.get('/mantenimiento');
      if (response.data.success) {
        setMantenimiento(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching mantenimiento:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-light/30">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-neutral-dark">Cargando...</div>
        </div>
      </div>
    );
  }

  const latestRecord = mantenimiento[0];
  const totalSensores = latestRecord
    ? latestRecord.Sensores_activos + latestRecord.Sensores_inactivos
    : 0;
  const porcentajeActivos = totalSensores > 0
    ? ((latestRecord?.Sensores_activos || 0) / totalSensores) * 100
    : 0;

  return (
    <div className="min-h-screen bg-neutral-light/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-dark">Mantenimiento de Sensores</h1>
          <p className="text-neutral-dark/60 mt-2">
            Estado y gestión de sensores del sistema
          </p>
        </div>

        {latestRecord ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-dark/60 mb-1">
                      Sensores Activos
                    </p>
                    <p className="text-4xl font-bold text-accent">
                      {latestRecord.Sensores_activos}
                    </p>
                    <p className="text-sm text-accent mt-2">
                      {porcentajeActivos.toFixed(1)}% del total
                    </p>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-full">
                    <CheckCircle className="text-accent" size={32} />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-dark/60 mb-1">
                      Sensores Inactivos
                    </p>
                    <p className="text-4xl font-bold text-secondary">
                      {latestRecord.Sensores_inactivos}
                    </p>
                    <p className="text-sm text-secondary mt-2">
                      Requieren atención
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-full">
                    <AlertTriangle className="text-secondary" size={32} />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-dark/60 mb-1">
                      Total de Sensores
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      {totalSensores}
                    </p>
                    <p className="text-sm text-neutral-dark/60 mt-2">
                      En el sistema
                    </p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Activity className="text-primary" size={32} />
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Estado General">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-dark">
                        Sensores Operativos
                      </span>
                      <span className="text-sm font-bold text-accent">
                        {porcentajeActivos.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-light rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all"
                        style={{ width: `${porcentajeActivos}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-light">
                    <div className="flex items-center space-x-3 mb-3">
                      <CheckCircle className="text-accent" size={20} />
                      <span className="text-sm font-medium text-neutral-dark">
                        {latestRecord.Sensores_activos} sensores funcionando correctamente
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="text-secondary" size={20} />
                      <span className="text-sm font-medium text-neutral-dark">
                        {latestRecord.Sensores_inactivos} sensores requieren mantenimiento
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {latestRecord.Sensores_rotos && (
                <Card title="Sensores con Fallas">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-secondary mb-4">
                      <XCircle size={20} />
                      <span className="font-medium">Sensores que requieren reparación:</span>
                    </div>
                    <div className="bg-neutral-light/50 rounded-lg p-4">
                      <p className="text-sm text-neutral-dark font-mono">
                        {latestRecord.Sensores_rotos}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-neutral-light">
                      <button className="w-full bg-secondary hover:bg-secondary-dark text-white px-4 py-3 rounded-lg transition-colors font-medium">
                        Programar Mantenimiento
                      </button>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <div className="mt-8">
              <Card title="Historial de Mantenimiento">
                <div className="space-y-4">
                  {mantenimiento.map((record, index) => (
                    <div
                      key={record.Id}
                      className="flex items-center justify-between p-4 bg-neutral-light/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <Activity className="text-primary" size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-dark">
                            Registro #{record.Id}
                          </p>
                          <p className="text-sm text-neutral-dark/60">
                            {new Date(record.created_at || '').toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-sm text-neutral-dark/60">Activos</p>
                          <p className="text-lg font-bold text-accent">
                            {record.Sensores_activos}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-neutral-dark/60">Inactivos</p>
                          <p className="text-lg font-bold text-secondary">
                            {record.Sensores_inactivos}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        ) : (
          <Card>
            <p className="text-neutral-dark/60 text-center py-8">
              No hay registros de mantenimiento disponibles
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
