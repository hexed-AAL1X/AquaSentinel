'use client';

import { motion } from 'framer-motion';
import { Activity, Smartphone, Monitor, Database, Wifi, Server } from 'lucide-react';

export default function EcosystemSection() {
  return (
    <section id="ecosystem" className="py-24 bg-primary relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
            }}
            animate={{
              y: [null, Math.random() * 100 + '%'],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            data-aos="fade-right"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">
              El Ecosistema AquaSentinel
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Red de 10 sensores IoT en Puerto Maldonado monitoreando mercurio en tiempo real.
              Conectados vía AWS IoT Core con protocolos MQTT y HTTP.
              Sistema escalable a 50 sensores en 3 años para cubrir más cuencas amazónicas.
            </p>
            <button className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-all transform hover:scale-105">
              Conocer Más Sobre el Ecosistema
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
            data-aos="fade-left"
          >
            {/* Ecosystem diagram */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Activity, label: 'Sensores' },
                { icon: Smartphone, label: 'Móvil' },
                { icon: Server, label: 'Estación' },
                { icon: Database, label: 'Base de Datos' },
                { icon: Monitor, label: 'Dashboard' },
                { icon: Wifi, label: 'IoT' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                  data-aos="flip-up"
                  data-aos-delay={index * 100}
                >
                  <item.icon className="text-white mb-2" size={40} />
                  <span className="text-white text-sm font-medium text-center">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Connection lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: -1 }}
            >
              <motion.line
                x1="50%"
                y1="16%"
                x2="50%"
                y2="84%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
                viewport={{ once: true }}
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
