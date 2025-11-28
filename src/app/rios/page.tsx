'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import AlertBadge from '@/components/AlertBadge';
import { Droplets, Plus, Edit, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { Rio } from '@/types';

export default function RiosPage() {
  const [rios, setRios] = useState<Rio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRios();
  }, []);

  const fetchRios = async () => {
    try {
      const response = await api.get('/rios');
      if (response.data.success) {
        setRios(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching rios:', error);
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

  return (
    <div className="min-h-screen bg-neutral-light/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-dark">Ríos Monitoreados</h1>
            <p className="text-neutral-dark/60 mt-2">
              Gestión y monitoreo de ríos del sistema
            </p>
          </div>
          <button className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors">
            <Plus size={20} />
            <span>Nuevo Río</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rios.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <p className="text-neutral-dark/60 text-center py-8">
                  No hay ríos registrados en el sistema
                </p>
              </Card>
            </div>
          ) : (
            rios.map((rio) => (
              <Card key={rio.Id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Droplets className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-neutral-dark">
                          {rio.Nombre_del_rio}
                        </h3>
                        <p className="text-sm text-neutral-dark/60">ID: {rio.Id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-light">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-neutral-dark/60">Estado:</span>
                      <AlertBadge
                        level={
                          rio.Estado?.toLowerCase().includes('alerta')
                            ? 'danger'
                            : rio.Estado?.toLowerCase().includes('monitor')
                            ? 'normal'
                            : 'warning'
                        }
                        text={rio.Estado || 'Sin estado'}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <button className="flex-1 flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition-colors">
                      <Edit size={16} />
                      <span>Editar</span>
                    </button>
                    <button className="flex items-center justify-center bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
