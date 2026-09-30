import { useState, useEffect } from 'react';
import { addIncome, updateIncome } from '../../services/incomeService.js';
import { addExpense, updateExpense } from '../../services/expenseService.js';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants.js';
import styles from './TransactionForm.module.css';

export default function TransactionForm({ transaction = null, type = 'expense', onSuccess, onCancel }) {
  // Если передан transaction, это режим редактирования
  const isEditing = !!transaction;
  
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    comment: '',
    isRecurring: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Заполняем форму данными для редактирования
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount || '',
        date: transaction.date || new Date().toISOString().split('T')[0],
        category: transaction.category || '',
        comment: transaction.comment || '',
        isRecurring: transaction.isRecurring || false
      });
    }
  }, [transaction]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        amount: Number(formData.amount)
      };

      let result;
      
      if (isEditing) {
        // Режим редактирования
        if (type === 'income') {
          result = await updateIncome(transaction.id, data);
        } else {
          result = await updateExpense(transaction.id, data);
        }
      } else {
        // Режим создания
        if (type === 'income') {
          result = await addIncome(data);
        } else {
          result = await addExpense(data);
        }
      }

      // Уведомляем родительский компонент об успехе
      if (onSuccess) {
        onSuccess(result);
      }

      // Сбрасываем форму только если это не редактирование
      if (!isEditing) {
        setFormData({
          amount: '',
          date: new Date().toISOString().split('T')[0],
          category: '',
          comment: '',
          isRecurring: false
        });
      }
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
      setError(err.message || 'Произошла ошибка при сохранении операции');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>
        {isEditing ? 'Редактировать операцию' : `Добавить ${type === 'income' ? 'доход' : 'расход'}`}
      </h2>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.field}>
        <label htmlFor="amount" className={styles.label}>
          Сумма
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          min="0.01"
          step="0.01"
          className={styles.input}
          placeholder="Введите сумму"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="date" className={styles.label}>
          Дата
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="category" className={styles.label}>
          Категория
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className={styles.select}
        >
          <option value="">Выберите категорию</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="comment" className={styles.label}>
          Комментарий
        </label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Добавьте комментарий (необязательно)"
          rows="3"
        />
      </div>

      {type === 'expense' && (
        <div className={styles.checkboxField}>
          <input
            type="checkbox"
            id="isRecurring"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
            className={styles.checkbox}
          />
          <label htmlFor="isRecurring" className={styles.checkboxLabel}>
            Регулярный расход
          </label>
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="submit"
          disabled={loading}
          className={styles.submitBtn}
        >
          {loading ? 'Сохранение...' : isEditing ? 'Обновить' : 'Добавить'}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={styles.cancelBtn}
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}
