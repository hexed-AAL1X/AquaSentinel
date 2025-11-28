'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, MapPin, TrendingUp } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: MapPin, value: 10, label: 'Sensores Activos', suffix: '' },
  { icon: Users, value: 50, label: 'Instituciones Asociadas', suffix: '+' },
  { icon: TrendingUp, value: 2880, label: 'Lecturas Diarias/Sensor', suffix: '' },
  { icon: Award, value: 5, label: 'Latencia en ms', suffix: '' },
];

export default function StatsSection() {
  const counterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    counterRefs.current.forEach((counter, index) => {
      if (counter) {
        const stat = stats[index];
        gsap.fromTo(
          counter,
          { innerText: 0 },
          {
            innerText: stat.value,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: counter,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            snap: { innerText: 1 },
            onUpdate: function () {
              if (counter) {
                const value = Math.ceil(parseFloat(counter.innerText));
                counter.innerText = value.toLocaleString() + stat.suffix;
              }
            },
          }
        );
      }
    });
  }, []);

  return (
    <section className="py-20 bg-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <stat.icon className="text-white" size={32} />
              </div>
              <div
                ref={(el) => {
                  counterRefs.current[index] = el;
                }}
                className="text-4xl md:text-5xl font-bold font-display text-white mb-2"
              >
                0
              </div>
              <div className="text-white/90 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
