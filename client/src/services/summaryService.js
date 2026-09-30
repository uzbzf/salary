import * as api from './api.js';

/**
 * Получение общего баланса (доходы, расходы, разница)
 * @param {string} [startDate] - Начальная дата фильтра (YYYY-MM-DD)
 * @param {string} [endDate] - Конечная дата фильтра (YYYY-MM-DD)
 * @returns {Promise<Object>} Объект с totalIncome, totalExpense, balance
 */
export const getBalance = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const result = await api.get('/summary', params);
  return result.data;
};

/**
 * Получение сумм по категориям для круговой диаграммы
 * @param {string} [type='expense'] - Тип операции ('income' или 'expense')
 * @param {string} [startDate] - Начальная дата фильтра (YYYY-MM-DD)
 * @param {string} [endDate] - Конечная дата фильтра (YYYY-MM-DD)
 * @returns {Promise<Array>} Массив объектов [{ categoryId, categoryLabel, total }]
 */
export const getByCategory = async (type = 'expense', startDate, endDate) => {
  const params = { type };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const result = await api.get('/summary/by-category', params);
  return result.data;
};

/**
 * Получение помесячной сводки доходов и расходов
 * @param {number} [monthsCount=6] - Количество последних месяцев
 * @returns {Promise<Array>} Массив объектов [{ year, month, income, expense }]
 */
export const getMonthlySummary = async (monthsCount = 6) => {
  const result = await api.get('/summary/by-month', { months: monthsCount });
  return result.data;
};