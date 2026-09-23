import React, { useState, useEffect } from 'react';
import PieChart from '../../components/PieChart/PieChart.jsx';
import BarChart from '../../components/BarChart/BarChart.jsx';
import { getByCategory, getMonthlySummary } from '../../services/summaryService.js';
import styles from './Analytics.module.css';

function Analytics() {
  // Состояние данных для графиков
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  // Функция загрузки данных
  const loadData = () => {
    const categoryStats = getByCategory();
    const monthlyStats = getMonthlySummary(6);
    
    setCategoryData(categoryStats);
    setMonthlyData(monthlyStats);
  };

  return (
    <div className={styles.analytics}>
      {/* Заголовок страницы */}
      <h1 className={styles.title}>Аналитика</h1>

      {/* Сетка графиков */}
      <div className={styles.chartsGrid}>
        {/* Круговая диаграмма расходов */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Расходы по категориям</h2>
          <div className={styles.chartContent}>
            <PieChart data={categoryData} title="Расходы по категориям" />
          </div>
        </div>

        {/* Столбчатый график доходов/расходов */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Доходы и расходы по месяцам</h2>
          <div className={styles.chartContent}>
            <BarChart data={monthlyData} title="Доходы и расходы по месяцам" />
          </div>
        </div>
      </div>

      {/* Информационное сообщение */}
      {categoryData.length === 0 && monthlyData.every((m) => m.income === 0 && m.expense === 0) && (
        <div style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-lg)',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💡</div>
          <div style={{ fontSize: '1rem' }}>
            Добавьте операции, чтобы увидеть графики
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
