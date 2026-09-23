/**
 * Форматирование суммы в рубли
 * @param {number} amount - Сумма
 * @param {string} type - Тип операции (income/expense)
 * @returns {string} Отформатированная строка
 */
export const formatAmount = (amount, type = 'income') => {
  const value = amount ?? 0;
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));

  return type === 'income' ? `+${formatted}` : `−${formatted}`;
};

/**
 * Форматирование даты в локальный формат
 * @param {string} dateString - ISO-строка даты
 * @returns {string} Отформатированная дата
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  
  try {
    const date = new Date(dateString);
    
    // Проверка на валидную дату
    if (isNaN(date.getTime())) return '—';
    
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

/**
 * Форматирование даты с полным названием месяца
 * @param {string} dateString - ISO-строка даты
 * @returns {string} Отформатированная дата
 */
export const formatDateFull = (dateString) => {
  if (!dateString) return '—';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return '—';
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

/**
 * Форматирование месяца для графиков (например, "Янв 2026")
 * @param {Date|string} date - Дата
 * @returns {string} Отформатированный месяц
 */
export const formatMonth = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString('ru-RU', {
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

/**
 * Получение относительной даты (сегодня, вчера, позавчера)
 * @param {string} dateString - ISO-строка даты
 * @returns {string} Относительная дата или отформатированная дата
 */
export const getRelativeDate = (dateString) => {
  if (!dateString) return '—';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return '—';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = today - targetDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays === 2) return 'Позавчера';
    
    return formatDate(dateString);
  } catch {
    return '—';
  }
};

/**
 * Получение ключа месяца для группировки (например, "2026-01")
 * @param {Date|string} date - Дата
 * @returns {string} Ключ месяца
 */
export const getMonthKey = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '';
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    
    return `${year}-${month}`;
  } catch {
    return '';
  }
};