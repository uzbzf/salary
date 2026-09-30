import { useState, useEffect } from 'react';
import { getBalance, getByCategory, getMonthlySummary } from '../../services/summaryService.js';

// Вспомогательная функция для форматирования валюты
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount);
};

export default function Analytics() {
  const [balance, setBalance] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем все сводные данные параллельно
        const [balanceRes, categoryRes, monthlyRes] = await Promise.all([
          getBalance(),
          getByCategory('expense'), // По умолчанию показываем расходы
          getMonthlySummary(6)      // Последние 6 месяцев
        ]);
        
        setBalance(balanceRes);
        setCategoryData(categoryRes);
        setMonthlyData(monthlyRes);
      } catch (error) {
        console.error('Ошибка загрузки аналитики:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Загрузка аналитики...</div>;
  }

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Аналитика</h1>

      {/* Карточки общего баланса */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Общий баланс</p>
          <p className={`text-2xl font-bold ${balance.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(balance.balance)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Всего доходов</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(balance.totalIncome)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Всего расходов</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(balance.totalExpense)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Распределение по категориям */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Расходы по категориям</h2>
          {categoryData.length > 0 ? (
            <ul className="space-y-3">
              {categoryData.map((item) => (
                <li key={item.categoryId} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">{item.categoryLabel}</span>
                  <span className="font-medium">{formatCurrency(item.total)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">Нет данных о расходах</p>
          )}
        </div>

        {/* Помесячная динамика */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Динамика за последние 6 месяцев</h2>
          {monthlyData.length > 0 ? (
            <div className="space-y-4">
              {monthlyData.map((item) => {
                const monthName = new Date(item.year, item.month - 1).toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
                return (
                  <div key={`${item.year}-${item.month}`} className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0">
                    <p className="font-medium capitalize">{monthName}</p>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-green-600">+{formatCurrency(item.income)}</span>
                      <span className="text-red-600">-{formatCurrency(item.expense)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Нет данных за выбранный период</p>
          )}
        </div>
      </div>
    </div>
  );
}
