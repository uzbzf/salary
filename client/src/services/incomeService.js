import * as api from './api.js';

/**
 * Получение списка всех доходов с опциональными фильтрами
 * @param {Object} filters - Объект фильтров (category, startDate, endDate, page, limit)
 * @returns {Promise<Object>} Объект с data (массив доходов) и pagination
 */
export const getIncomes = async (filters = {}) => {
  const result = await api.get('/incomes', filters);
  return {
    data: result.data || [],
    pagination: result.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
  };
};

/**
 * Получение дохода по ID
 * @param {string} id - Идентификатор дохода
 * @returns {Promise<Object|null>} Объект дохода или null
 */
export const getIncomeById = async (id) => {
  try {
    const result = await api.get(`/incomes/${id}`);
    return result.data;
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return null;
    }
    throw error;
  }
};

/**
 * Создание нового дохода
 * @param {Object} incomeData - Данные дохода (amount, date, category, comment)
 * @returns {Promise<Object>} Созданный доход
 */
export const addIncome = async (incomeData) => {
  const result = await api.post('/incomes', incomeData);
  return result.data;
};

/**
 * Обновление существующего дохода
 * @param {string} id - Идентификатор дохода
 * @param {Object} incomeData - Новые данные
 * @returns {Promise<Object>} Обновлённый доход
 */
export const updateIncome = async (id, incomeData) => {
  const result = await api.put(`/incomes/${id}`, incomeData);
  return result.data;
};

/**
 * Удаление дохода
 * @param {string} id - Идентификатор дохода
 * @returns {Promise<boolean>} true, если удалён успешно
 */
export const deleteIncome = async (id) => {
  try {
    await api.del(`/incomes/${id}`);
    return true;
  } catch (error) {
    console.error('Ошибка при удалении дохода:', error.message);
    return false;
  }
};
