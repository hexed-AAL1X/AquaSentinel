'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import { MapPin, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import { Mina } from '@/types';

export default function MinasPage() {
  const [minas, setMinas] = useState<Mina[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMinas();
  }, []);

  const fetchMinas = async () => {
    try {
      const response = await api.get('/minas');
      if (response.data.success) {
        setMinas(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching minas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPollutionLevel = (nivel: number) => {
    if (nivel >= 8) return { color: 'bg-secondary', text: 'Alto', textColor: 'text-secondary' };
    if (nivel >= 5) return { color: 'bg-yellow-500', text: 'Medio', textColor: 'text-yellow-600' };
    return { color: 'bg-accent', text: 'Bajo', textColor: 'text-accent' };
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
            <h1 className="text-3xl font-bold text-neutral-dark">Minas Registradas</h1>
            <p className="text-neutral-dark/60 mt-2">
              Monitoreo de niveles de contaminación por minas
            </p>
          </div>
          <button className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors">
            <Plus size={20} />
            <span>Nueva Mina</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {minas.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <p className="text-neutral-dark/60 text-center py-8">
                  No hay minas registradas en el sistema
                </p>
              </Card>
            </div>
          ) : (
            minas.map((mina) => {
              const pollutionLevel = getPollutionLevel(mina.Nivel_de_polucion);
              return (
                <Card key={mina.Id}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-secondary/10 rounded-full">
                          <MapPin className="text-secondary" size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-neutral-dark">
                            {mina.Nombre}
                          </h3>
                          <p className="text-sm text-neutral-dark/60">ID: {mina.Id}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-light">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-neutral-dark/60">
                          Nivel de Contaminación:
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-neutral-light rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full ${pollutionLevel.color} transition-all`}
                            style={{ width: `${(mina.Nivel_de_polucion / 10) * 100}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${pollutionLevel.textColor}`}>
                          {mina.Nivel_de_polucion.toFixed(1)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center space-x-2">
                        <AlertTriangle size={16} className={pollutionLevel.textColor} />
                        <span className={`text-sm font-medium ${pollutionLevel.textColor}`}>
                          {pollutionLevel.text}
                        </span>
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
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
