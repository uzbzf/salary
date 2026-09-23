import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Кастомный tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'var(--color-surface)',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
          {label}
        </div>
        {payload.map((entry, index) => {
          const amount = new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(entry.value);

          return (
            <div key={index} style={{ color: entry.color, fontSize: '0.875rem' }}>
              {entry.name}: {amount}
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

function BarChartComponent({ data, title }) {
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
        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📊</div>
        <div style={{ fontSize: '1rem' }}>
          Нет данных для отображения
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={safeData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="month"
            stroke="var(--color-text-secondary)"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis
            stroke="var(--color-text-secondary)"
            style={{ fontSize: '0.875rem' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="income"
            name="Доходы"
            fill="var(--color-success)"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="expense"
            name="Расходы"
            fill="var(--color-danger)"
            radius={[8, 8, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartComponent;