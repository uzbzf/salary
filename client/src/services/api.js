// Базовый URL из переменной окружения (с фолбэком на локальный адрес)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

/**
 * Базовая функция для выполнения HTTP-запросов
 * @param {string} path - Путь эндпоинта (например, '/incomes')
 * @param {Object} options - Настройки fetch (method, body, headers и т.д.)
 * @returns {Promise<Object>} Распарсенный JSON-ответ
 */
const request = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const result = await response.json();

    // Если статус ответа не 2xx, бэкенд возвращает { error: { code, message } }
    if (!response.ok) {
      const errorData = result.error || { code: 'UNKNOWN_ERROR', message: 'Неизвестная ошибка сервера' };
      const error = new Error(errorData.message);
      error.code = errorData.code;
      throw error;
    }

    // Возвращаем весь результат (он содержит data и, возможно, pagination)
    return result;
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${path}]:`, error.message);
    throw error;
  }
};

/**
 * GET-запрос с поддержкой query-параметров
 * @param {string} path - Путь эндпоинта
 * @param {Object} [params] - Объект с параметрами для query-строки
 */
export const get = async (path, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${path}?${queryString}` : path;
  return request(url, { method: 'GET' });
};

/**
 * POST-запрос
 * @param {string} path - Путь эндпоинта
 * @param {Object} body - Тело запроса
 */
export const post = async (path, body) => {
  return request(path, { method: 'POST', body: JSON.stringify(body) });
};

/**
 * PUT-запрос
 * @param {string} path - Путь эндпоинта
 * @param {Object} body - Тело запроса
 */
export const put = async (path, body) => {
  return request(path, { method: 'PUT', body: JSON.stringify(body) });
};

/**
 * DELETE-запрос
 * @param {string} path - Путь эндпоинта
 */
export const del = async (path) => {
  return request(path, { method: 'DELETE' });
};