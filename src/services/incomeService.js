import { getFromStorage, saveToStorage, generateId } from './storage.js';
import { STORAGE_KEYS } from '../utils/constants.js';

/**
 * Получение всех доходов
 * @returns {Array} Массив доходов
 */
export const getIncomes = () => {
  const incomes = getFromStorage(STORAGE_KEYS.INCOMES, []);
  // Сортировка по дате (новые сверху)
  return (incomes || []).sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Получение дохода по ID
 * @param {string} id - ID дохода
 * @returns {Object|null} Объект дохода или null
 */
export const getIncomeById = (id) => {
  if (!id) return null;
  
  const incomes = getFromStorage(STORAGE_KEYS.INCOMES, []);
  return (incomes || []).find((item) => item.id === id) || null;
};

/**
 * Добавление нового дохода
 * @param {Object} data - Данные дохода (category, amount, date, comment)
 * @returns {Object} Созданный объект дохода
 */
export const addIncome = (data) => {
  const incomes = getFromStorage(STORAGE_KEYS.INCOMES, []);
  
  const newIncome = {
    id: generateId(),
    type: 'income',
    category: data?.category || 'other',
    amount: data?.amount ?? 0,
    date: data?.date || new Date().toISOString().split('T')[0],
    comment: data?.comment || '',
    createdAt: new Date().toISOString(),
  };
  
  const updatedIncomes = [...(incomes || []), newIncome];
  saveToStorage(STORAGE_KEYS.INCOMES, updatedIncomes);
  
  return newIncome;
};

/**
 * Обновление существующего дохода
 * @param {string} id - ID дохода
 * @param {Object} data - Обновлённые данные
 * @returns {Object|null} Обновлённый объект дохода или null
 */
export const updateIncome = (id, data) => {
  if (!id) return null;
  
  const incomes = getFromStorage(STORAGE_KEYS.INCOMES, []);
  const safeIncomes = incomes || [];
  
  const index = safeIncomes.findIndex((item) => item.id === id);
  
  if (index === -1) return null;
  
  const updatedIncome = {
    ...safeIncomes[index],
    category: data?.category ?? safeIncomes[index].category,
    amount: data?.amount ?? safeIncomes[index].amount,
    date: data?.date ?? safeIncomes[index].date,
    comment: data?.comment ?? safeIncomes[index].comment,
    updatedAt: new Date().toISOString(),
  };
  
  const updatedIncomes = [...safeIncomes];
  updatedIncomes[index] = updatedIncome;
  
  saveToStorage(STORAGE_KEYS.INCOMES, updatedIncomes);
  
  return updatedIncome;
};

/**
 * Удаление дохода
 * @param {string} id - ID дохода
 * @returns {boolean} true, если удаление успешно
 */
export const deleteIncome = (id) => {
  if (!id) return false;
  
  const incomes = getFromStorage(STORAGE_KEYS.INCOMES, []);
  const safeIncomes = incomes || [];
  
  const filtered = safeIncomes.filter((item) => item.id !== id);
  
  // Если ничего не удалилось — ID не найден
  if (filtered.length === safeIncomes.length) return false;
  
  saveToStorage(STORAGE_KEYS.INCOMES, filtered);
  
  return true;
};