import React, { useState, useEffect } from 'react';
import styles from './TransactionForm.module.css';

// Fallback-категории (позже заменим на импорт из constants.js)
const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Зарплата' },
  { id: 'freelance', label: 'Подработка' },
  { id: 'bonus', label: 'Премия' },
  { id: 'debt_return', label: 'Возврат долга' },
  { id: 'deposit_interest', label: 'Проценты по вкладу' },
  { id: 'gift', label: 'Подарок' },
  { id: 'other', label: 'Прочее' },
];

const EXPENSE_CATEGORIES = [
  { id: 'groceries', label: 'Продукты' },
  { id: 'utilities', label: 'Коммуналка' },
  { id: 'rent', label: 'Аренда' },
  { id: 'subscriptions', label: 'Подписки' },
  { id: 'transport', label: 'Транспорт' },
  { id: 'health', label: 'Здоровье' },
  { id: 'clothing', label: 'Одежда' },
  { id: 'entertainment', label: 'Развлечения' },
  { id: 'communication', label: 'Связь' },
  { id: 'other', label: 'Прочее' },
];

function TransactionForm({ onSubmit, onCancel, editData }) {
  // Состояние формы
  const [formData, setFormData] = useState({
    type: editData?.type || 'income',
    category: editData?.category || '',
    amount: editData?.amount || '',
    date: editData?.date || new Date().toISOString().split('T')[0],
    comment: editData?.comment || '',
  });

  // Состояние ошибок валидации
  const [errors, setErrors] = useState({});

  // Обновление формы при изменении editData
  useEffect(() => {
    if (editData) {
      setFormData({
        type: editData.type || 'income',
        category: editData.category || '',
        amount: editData.amount || '',
        date: editData.date || new Date().toISOString().split('T')[0],
        comment: editData.comment || '',
      });
    }
  }, [editData]);

  // Получение списка категорий в зависимости от типа
  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Обработчик изменения полей
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Сброс ошибки при изменении поля
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Обработчик изменения типа операции
  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: '', // Сбрасываем категорию при смене типа
    }));
  };

  // Валидация формы
  const validate = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Выберите категорию';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Введите корректную сумму';
    }

    if (!formData.date) {
      newErrors.date = 'Укажите дату';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Преобразуем сумму в число
    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    onSubmit?.(submitData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Переключатель типа операции */}
      <div className={styles.typeSwitcher}>
        <button
          type="button"
          className={`${styles.typeButton} ${
            formData.type === 'income' ? `${styles.typeButtonActive} ${styles.typeButtonIncome}` : ''
          }`}
          onClick={() => handleTypeChange('income')}
        >
          ↑ Доход
        </button>
        <button
          type="button"
          className={`${styles.typeButton} ${
            formData.type === 'expense' ? `${styles.typeButtonActive} ${styles.typeButtonExpense}` : ''
          }`}
          onClick={() => handleTypeChange('expense')}
        >
          ↓ Расход
        </button>
      </div>

      {/* Категория */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Категория</label>
        <select
          className={styles.select}
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="">Выберите категорию</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && <div className={styles.error}>{errors.category}</div>}
      </div>

      {/* Сумма и дата */}
      <div className={styles.row}>
        {/* Сумма */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Сумма (₽)</label>
          <input
            type="number"
            className={styles.input}
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
          />
          {errors.amount && <div className={styles.error}>{errors.amount}</div>}
        </div>

        {/* Дата */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Дата</label>
          <input
            type="date"
            className={styles.input}
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
          {errors.date && <div className={styles.error}>{errors.date}</div>}
        </div>
      </div>

      {/* Комментарий */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Комментарий</label>
        <textarea
          className={styles.textarea}
          value={formData.comment}
          onChange={(e) => handleChange('comment', e.target.value)}
          placeholder="Необязательное описание операции"
        />
      </div>

      {/* Кнопки действий */}
      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={() => onCancel?.()}>
          Отмена
        </button>
        <button type="submit" className={styles.submitButton}>
          {editData ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;