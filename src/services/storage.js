/**
 * Получение данных из localStorage
 * @param {string} key - Ключ хранилища
 * @param {*} defaultValue - Значение по умолчанию, если данные не найдены
 * @returns {*} Распарсенные данные или defaultValue
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    
    if (item === null) {
      return defaultValue;
    }
    
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error getting data from storage (key: ${key}):`, error);
    return defaultValue;
  }
};

/**
 * Сохранение данных в localStorage
 * @param {string} key - Ключ хранилища
 * @param {*} value - Данные для сохранения
 * @returns {boolean} true, если сохранение успешно
 */
export const saveToStorage = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error saving data to storage (key: ${key}):`, error);
    return false;
  }
};

/**
 * Удаление данных из localStorage
 * @param {string} key - Ключ хранилища
 * @returns {boolean} true, если удаление успешно
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data from storage (key: ${key}):`, error);
    return false;
  }
};

/**
 * Генерация уникального идентификатора (UUID)
 * @returns {string} Уникальный идентификатор
 */
export const generateId = () => {
  try {
    // Используем crypto.randomUUID() если доступен
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback: генерация UUID v4 вручную
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  } catch (error) {
    console.error('Error generating ID:', error);
    // Последний fallback
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
};

/**
 * Очистка всего localStorage (используется для отладки)
 * @returns {boolean} true, если очистка успешна
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};