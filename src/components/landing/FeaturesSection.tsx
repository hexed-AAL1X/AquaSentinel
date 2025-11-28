'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Cloud, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: CheckCircle,
    title: 'Detección de Mercurio',
    description:
      '10 sensores en ríos Madre de Dios y Tambopata midiendo mercurio, pH, temperatura y turbidez cada 30 segundos.',
  },
  {
    icon: Cloud,
    title: 'AWS IoT Core',
    description:
      'Latencia de 5ms desde Lima. Protocolos MQTT y HTTP. 360,000 mensajes procesados al mes con SLA del 99.99%.',
  },
  {
    icon: Zap,
    title: 'Alertas Instantáneas',
    description:
      'Notificaciones inmediatas a 226 usuarios concurrentes cuando los niveles de mercurio superan límites seguros.',
  },
  {
    icon: Shield,
    title: 'LoRaWAN + 4G',
    description:
      'Red híbrida con alcance de 15 km en zonas rurales y cobertura 4G/WiFi urbana. Protección IP67.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-neutral-dark mb-4">
            Soluciones Avanzadas de Monitoreo
          </h2>
          <p className="text-xl text-neutral-dark/70 max-w-3xl mx-auto">
            El río Madre de Dios transporta 12 toneladas de mercurio al año.
            El 78% de la población presenta niveles 3x superiores a lo recomendado por la OMS.
            AquaSentinel protege a 5,650 usuarios y 50 instituciones con datos en tiempo real.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex gap-6"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <feature.icon className="text-accent" size={32} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold font-display text-neutral-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-dark/70">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
