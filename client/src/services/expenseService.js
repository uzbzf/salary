import * as api from './api.js';

/**
 * Получение списка всех расходов с опциональными фильтрами
 * @param {Object} filters - Объект фильтров (category, startDate, endDate, isRecurring, page, limit)
 * @returns {Promise<Object>} Объект с data (массив расходов) и pagination
 */
export const getExpenses = async (filters = {}) => {
  const result = await api.get('/expenses', filters);
  return {
    data: result.data || [],
    pagination: result.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
  };
};

/**
 * Получение расхода по ID
 * @param {string} id - Идентификатор расхода
 * @returns {Promise<Object|null>} Объект расхода или null
 */
export const getExpenseById = async (id) => {
  try {
    const result = await api.get(`/expenses/${id}`);
    return result.data;
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return null;
    }
    throw error;
  }
};

/**
 * Создание нового расхода
 * @param {Object} expenseData - Данные расхода (amount, date, category, comment, isRecurring)
 * @returns {Promise<Object>} Созданный расход
 */
export const addExpense = async (expenseData) => {
  const result = await api.post('/expenses', expenseData);
  return result.data;
};

/**
 * Обновление существующего расхода
 * @param {string} id - Идентификатор расхода
 * @param {Object} expenseData - Новые данные
 * @returns {Promise<Object>} Обновлённый расход
 */
export const updateExpense = async (id, expenseData) => {
  const result = await api.put(`/expenses/${id}`, expenseData);
  return result.data;
};

/**
 * Удаление расхода
 * @param {string} id - Идентификатор расхода
 * @returns {Promise<boolean>} true, если удалён успешно
 */
export const deleteExpense = async (id) => {
  try {
    await api.del(`/expenses/${id}`);
    return true;
  } catch (error) {
    console.error('Ошибка при удалении расхода:', error.message);
    return false;
  }
};