'use client';

import { motion } from 'framer-motion';
import { Droplets, Wind, Thermometer, Gauge, Beaker, Waves } from 'lucide-react';

const sensors = [
  { icon: Droplets, name: 'pH' },
  { icon: Thermometer, name: 'Temperatura' },
  { icon: Gauge, name: 'Conductividad' },
  { icon: Beaker, name: 'Mercurio' },
  { icon: Wind, name: 'Oxígeno Disuelto' },
  { icon: Waves, name: 'Turbidez' },
];

export default function MonitoringSection() {
  return (
    <section id="monitoring" className="py-24 bg-gradient-to-b from-white to-neutral-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
          data-aos="fade-down"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-neutral-dark mb-4">
            Amplia Gama de Sensores
          </h2>
          <p className="text-xl text-neutral-dark/70 max-w-3xl mx-auto">
            Sensores especializados instalados en los ríos Madre de Dios y Tambopata.
            Tecnología LoRaWAN para zonas rurales (alcance 15 km) y 4G/WiFi en zonas urbanas.
            Cada sensor realiza 2 lecturas por minuto, garantizando monitoreo continuo.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {sensors.map((sensor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center group cursor-pointer"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <sensor.icon className="text-primary" size={32} />
              </div>
              <span className="text-neutral-dark font-semibold text-center">
                {sensor.name}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
            Conocer Más Sobre los Sensores Disponibles
          </button>
        </motion.div>
      </div>
    </section>
  );
}
