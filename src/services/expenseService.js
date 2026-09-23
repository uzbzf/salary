import { getFromStorage, saveToStorage, generateId } from './storage.js';
import { STORAGE_KEYS } from '../utils/constants.js';

/**
 * Получение всех расходов
 * @returns {Array} Массив расходов
 */
export const getExpenses = () => {
  const expenses = getFromStorage(STORAGE_KEYS.EXPENSES, []);
  // Сортировка по дате (новые сверху)
  return (expenses || []).sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Получение расхода по ID
 * @param {string} id - ID расхода
 * @returns {Object|null} Объект расхода или null
 */
export const getExpenseById = (id) => {
  if (!id) return null;
  
  const expenses = getFromStorage(STORAGE_KEYS.EXPENSES, []);
  return (expenses || []).find((item) => item.id === id) || null;
};

/**
 * Добавление нового расхода
 * @param {Object} data - Данные расхода (category, amount, date, comment)
 * @returns {Object} Созданный объект расхода
 */
export const addExpense = (data) => {
  const expenses = getFromStorage(STORAGE_KEYS.EXPENSES, []);
  
  const newExpense = {
    id: generateId(),
    type: 'expense',
    category: data?.category || 'other',
    amount: data?.amount ?? 0,
    date: data?.date || new Date().toISOString().split('T')[0],
    comment: data?.comment || '',
    createdAt: new Date().toISOString(),
  };
  
  const updatedExpenses = [...(expenses || []), newExpense];
  saveToStorage(STORAGE_KEYS.EXPENSES, updatedExpenses);
  
  return newExpense;
};

/**
 * Обновление существующего расхода
 * @param {string} id - ID расхода
 * @param {Object} data - Обновлённые данные
 * @returns {Object|null} Обновлённый объект расхода или null
 */
export const updateExpense = (id, data) => {
  if (!id) return null;
  
  const expenses = getFromStorage(STORAGE_KEYS.EXPENSES, []);
  const safeExpenses = expenses || [];
  
  const index = safeExpenses.findIndex((item) => item.id === id);
  
  if (index === -1) return null;
  
  const updatedExpense = {
    ...safeExpenses[index],
    category: data?.category ?? safeExpenses[index].category,
    amount: data?.amount ?? safeExpenses[index].amount,
    date: data?.date ?? safeExpenses[index].date,
    comment: data?.comment ?? safeExpenses[index].comment,
    updatedAt: new Date().toISOString(),
  };
  
  const updatedExpenses = [...safeExpenses];
  updatedExpenses[index] = updatedExpense;
  
  saveToStorage(STORAGE_KEYS.EXPENSES, updatedExpenses);
  
  return updatedExpense;
};

/**
 * Удаление расхода
 * @param {string} id - ID расхода
 * @returns {boolean} true, если удаление успешно
 */
export const deleteExpense = (id) => {
  if (!id) return false;
  
  const expenses = getFromStorage(STORAGE_KEYS.EXPENSES, []);
  const safeExpenses = expenses || [];
  
  const filtered = safeExpenses.filter((item) => item.id !== id);
  
  // Если ничего не удалилось — ID не найден
  if (filtered.length === safeExpenses.length) return false;
  
  saveToStorage(STORAGE_KEYS.EXPENSES, filtered);
  
  return true;
};