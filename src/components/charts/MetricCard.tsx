'use client';

import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'danger';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function MetricCard({ title, value, subtitle, icon: Icon, color, trend }: MetricCardProps) {
  const colorClasses = {
    primary: 'from-[#0077B6] to-[#005a8d]',
    secondary: 'from-[#FF6B35] to-[#cc5529]',
    accent: 'from-[#2A9D8F] to-[#1f7e71]',
    success: 'from-[#10b981] to-[#059669]',
    danger: 'from-[#ef4444] to-[#dc2626]',
  };

  const iconBgClasses = {
    primary: 'bg-[#0077B6]/10',
    secondary: 'bg-[#FF6B35]/10',
    accent: 'bg-[#2A9D8F]/10',
    success: 'bg-green-500/10',
    danger: 'bg-red-500/10',
  };

  const iconColorClasses = {
    primary: 'text-[#0077B6]',
    secondary: 'text-[#FF6B35]',
    accent: 'text-[#2A9D8F]',
    success: 'text-green-500',
    danger: 'text-red-500',
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/95 shadow-md border border-neutral-light hover:shadow-lg transition-all duration-300 group">
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="relative p-4">
        {/* Icon */}
        <div className={`inline-flex p-2.5 rounded-xl ${iconBgClasses[color]} mb-3`}>
          <Icon className={`w-5 h-5 ${iconColorClasses[color]}`} />
        </div>

        {/* Title */}
        <h3 className="text-[11px] font-semibold text-neutral-dark/60 uppercase tracking-[0.18em] mb-1">
          {title}
        </h3>

        {/* Value */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-neutral-dark mb-0.5">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-neutral-dark/50">
                {subtitle}
              </p>
            )}
          </div>

          {/* Trend */}
          {trend && (
            <div className={`flex items-center text-xs font-semibold ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`h-0.5 bg-gradient-to-r ${colorClasses[color]}`} />
    </div>
  );
}
