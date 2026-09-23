import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Цветовая палитра для категорий
const COLORS = [
  '#4f46e5', // primary
  '#10b981', // success
  '#f59e0b', // warning
  '#ef4444', // danger
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
  '#f97316', // orange
  '#14b8a6', // teal
];

// Кастомный tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const amount = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(data.value);

    return (
      <div style={{
        backgroundColor: 'var(--color-surface)',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
          {data.name}
        </div>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          {amount}
        </div>
      </div>
    );
  }
  return null;
};

function PieChartComponent({ data, title }) {
  // Fallback для пустых данных
  const safeData = data || [];

  // Если данных нет — показываем заглушку
  if (safeData.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        color: 'var(--color-text-secondary)',
        textAlign: 'center',
        padding: 'var(--spacing-xl)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🥧</div>
        <div style={{ fontSize: '1rem' }}>
          Нет данных для отображения
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={safeData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {safeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponent;