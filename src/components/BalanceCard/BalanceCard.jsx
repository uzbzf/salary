import React from 'react';
import styles from './BalanceCard.module.css';

// Маппинг цветов на CSS-классы
const COLOR_MAP = {
  success: styles.success,
  danger: styles.danger,
  primary: styles.primary,
  warning: styles.warning,
};

function BalanceCard({ title, amount, color = 'primary' }) {
  // Fallback для amount
  const displayAmount = amount ?? 0;
  
  // Форматирование суммы с разделителями тысяч
  const formattedAmount = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(displayAmount);

  // Получаем CSS-класс для цвета
  const colorClass = COLOR_MAP[color] || styles.primary;

  return (
    <div className={`${styles.card} ${colorClass}`}>
      <div className={styles.title}>{title}</div>
      <div className={styles.amount}>{formattedAmount}</div>
    </div>
  );
}

export default BalanceCard;