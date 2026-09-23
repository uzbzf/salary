import { getIncomes } from './incomeService.js';
import { getExpenses } from './expenseService.js';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants.js';
import { getMonthKey } from '../utils/formatters.js';

/**
 * Вычисление общего баланса (доходы - расходы)
 * @returns {Object} Объект с totalIncome, totalExpense, balance
 */
export const getBalance = () => {
  const incomes = getIncomes();
  const expenses = getExpenses();
  
  const totalIncome = (incomes || []).reduce((sum, item) => sum + (item.amount ?? 0), 0);
  const totalExpense = (expenses || []).reduce((sum, item) => sum + (item.amount ?? 0), 0);
  const balance = totalIncome - totalExpense;
  
  return {
    totalIncome,
    totalExpense,
    balance,
  };
};

/**
 * Группировка расходов по категориям для круговой диаграммы
 * @returns {Array} Массив объектов { name, value } для PieChart
 */
export const getByCategory = () => {
  const expenses = getExpenses();
  const safeExpenses = expenses || [];
  
  // Группировка по категориям
  const categoryMap = {};
  
  safeExpenses.forEach((expense) => {
    const categoryId = expense.category || 'other';
    const amount = expense.amount ?? 0;
    
    if (!categoryMap[categoryId]) {
      categoryMap[categoryId] = 0;
    }
    
    categoryMap[categoryId] += amount;
  });
  
  // Преобразование в формат для графика
  const result = Object.entries(categoryMap).map(([categoryId, value]) => {
    const category = EXPENSE_CATEGORIES.find((cat) => cat.id === categoryId);
    const name = category?.label || 'Прочее';
    
    return {
      name,
      value,
      categoryId,
    };
  });
  
  // Сортировка по убыванию суммы
  return result.sort((a, b) => b.value - a.value);
};

/**
 * Группировка доходов и расходов по месяцам для столбчатого графика
 * @param {number} monthsCount - Количество месяцев для отображения (по умолчанию 6)
 * @returns {Array} Массив объектов { month, income, expense } для BarChart
 */
export const getMonthlySummary = (monthsCount = 6) => {
  const incomes = getIncomes();
  const expenses = getExpenses();
  
  const safeIncomes = incomes || [];
  const safeExpenses = expenses || [];
  
  // Получаем текущую дату
  const now = new Date();
  
  // Создаём массив ключей месяцев (например, ["2026-09", "2026-08", ...])
  const monthKeys = [];
  for (let i = monthsCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthKeys.push(getMonthKey(date));
  }
  
  // Инициализация структуры данных
  const monthlyData = {};
  monthKeys.forEach((key) => {
    monthlyData[key] = {
      income: 0,
      expense: 0,
    };
  });
  
  // Подсчёт доходов по месяцам
  safeIncomes.forEach((income) => {
    const monthKey = getMonthKey(income.date);
    if (monthlyData[monthKey]) {
      monthlyData[monthKey].income += income.amount ?? 0;
    }
  });
  
  // Подсчёт расходов по месяцам
  safeExpenses.forEach((expense) => {
    const monthKey = getMonthKey(expense.date);
    if (monthlyData[monthKey]) {
      monthlyData[monthKey].expense += expense.amount ?? 0;
    }
  });
  
  // Преобразование в формат для графика
  const result = monthKeys.map((key) => {
    // Извлекаем месяц и год из ключа (например, "2026-09" -> "Сен 2026")
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const monthLabel = date.toLocaleDateString('ru-RU', {
      month: 'short',
      year: 'numeric',
    });
    
    return {
      month: monthLabel,
      income: monthlyData[key].income,
      expense: monthlyData[key].expense,
    };
  });
  
  return result;
};

/**
 * Получение последних операций (доходы + расходы, отсортированные по дате)
 * @param {number} limit - Количество операций (по умолчанию 5)
 * @returns {Array} Массив последних операций
 */
export const getRecentTransactions = (limit = 5) => {
  const incomes = getIncomes();
  const expenses = getExpenses();
  
  const safeIncomes = incomes || [];
  const safeExpenses = expenses || [];
  
  // Объединяем все операции
  const allTransactions = [...safeIncomes, ...safeExpenses];
  
  // Сортировка по дате (новые сверху)
  allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Возвращаем первые N операций
  return allTransactions.slice(0, limit);
};
