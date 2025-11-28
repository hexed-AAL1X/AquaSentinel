'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
  timestamp: string;
  value: number;
}

interface ScientificLineChartProps {
  data: DataPoint[];
  dataKey: string;
  color: string;
  title: string;
  unit?: string;
}

export default function ScientificLineChart({ data, dataKey, color, title, unit = '' }: ScientificLineChartProps) {
  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-semibold text-neutral-dark mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
          <XAxis 
            dataKey="timestamp" 
            stroke="#333333"
            style={{ fontSize: '12px', fontFamily: 'Inter' }}
          />
          <YAxis 
            stroke="#333333"
            style={{ fontSize: '12px', fontFamily: 'Inter' }}
            label={{ value: unit, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: `2px solid ${color}`, 
              borderRadius: '8px',
              fontFamily: 'Inter'
            }}
          />
          <Legend 
            wrapperStyle={{ fontFamily: 'Inter', fontSize: '14px' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={3}
            fill={`url(#gradient-${dataKey})`}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
