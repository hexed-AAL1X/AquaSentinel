'use client';

import { useEffect, useRef, useState } from 'react';
import { Award, Users, MapPin, TrendingUp } from 'lucide-react';

const stats = [
  { icon: MapPin, value: 10, label: 'Sensores Activos', suffix: '' },
  { icon: Users, value: 50, label: 'Instituciones Asociadas', suffix: '+' },
  { icon: TrendingUp, value: 2880, label: 'Lecturas Diarias/Sensor', suffix: '' },
  { icon: Award, value: 5, label: 'Latencia en ms', suffix: '' },
];

function useCountUp(target: number, active: boolean, suffix: string) {
  const [text, setText] = useState(`0${suffix}`);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const duration = 1200;
    let frame = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const value = Math.round(target * p);
      setText(`${value.toLocaleString()}${suffix}`);
      if (p < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, suffix]);

  return text;
}

function StatCard({
  icon: Icon,
  value,
  label,
  suffix,
  active,
}: {
  icon: typeof MapPin;
  value: number;
  label: string;
  suffix: string;
  active: boolean;
}) {
  const text = useCountUp(value, active, suffix);
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
        <Icon className="text-white" size={32} aria-hidden />
      </div>
      <div className="text-4xl md:text-5xl font-bold font-display text-white mb-2">{text}</div>
      <div className="text-white/90 font-medium">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 bg-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
