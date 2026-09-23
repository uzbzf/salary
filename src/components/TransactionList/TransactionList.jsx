import React from 'react';
import EmptyState from '../EmptyState/EmptyState.jsx';
import styles from './TransactionList.module.css';

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

// Объединённый маппинг категорий
const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

function TransactionList({ transactions, onEdit, onDelete }) {
  // Fallback для пустого списка
  const safeTransactions = transactions || [];

  // Если список пуст — показываем заглушку
  if (safeTransactions.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="Нет операций"
        description="Добавьте первую операцию, чтобы начать учёт"
      />
    );
  }

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  // Форматирование суммы
  const formatAmount = (amount, type) => {
    const value = amount ?? 0;
    const formatted = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
    
    return type === 'income' ? `+${formatted}` : `−${formatted}`;
  };

  // Получение названия категории
  const getCategoryLabel = (categoryId) => {
    const category = ALL_CATEGORIES.find((cat) => cat.id === categoryId);
    return category?.label || 'Прочее';
  };

  return (
    <table className={styles.table}>
      {/* Заголовки колонок */}
      <thead className={styles.thead}>
        <tr>
          <th className={styles.th}>Тип</th>
          <th className={styles.th}>Категория</th>
          <th className={styles.th}>Сумма</th>
          <th className={styles.th}>Дата</th>
          <th className={styles.th}>Комментарий</th>
          <th className={styles.th}></th>
        </tr>
      </thead>
      
      {/* Тело таблицы */}
      <tbody>
        {safeTransactions.map((transaction) => (
          <tr key={transaction.id} className={styles.tr}>
            {/* Тип операции */}
            <td className={styles.td} data-label="Тип">
              <div className={styles.typeCell}>
                <div
                  className={`${styles.typeIcon} ${
                    transaction.type === 'income' ? styles.typeIconIncome : styles.typeIconExpense
                  }`}
                >
                  {transaction.type === 'income' ? '↑' : '↓'}
                </div>
                <span>{transaction.type === 'income' ? 'Доход' : 'Расход'}</span>
              </div>
            </td>

            {/* Категория */}
            <td className={`${styles.td} ${styles.categoryCell}`} data-label="Категория">
              {getCategoryLabel(transaction.category)}
            </td>

            {/* Сумма */}
            <td
              className={`${styles.td} ${styles.amountCell} ${
                transaction.type === 'income' ? styles.amountIncome : styles.amountExpense
              }`}
              data-label="Сумма"
            >
              {formatAmount(transaction.amount, transaction.type)}
            </td>

            {/* Дата */}
            <td className={`${styles.td} ${styles.dateCell}`} data-label="Дата">
              {formatDate(transaction.date)}
            </td>

            {/* Комментарий */}
            <td className={`${styles.td} ${styles.commentCell}`} data-label="Комментарий">
              {transaction.comment || '—'}
            </td>

            {/* Действия */}
            <td className={styles.td} data-label="Действия">
              <div className={styles.actionsCell}>
                {onEdit && (
                  <button
                    className={styles.actionButton}
                    onClick={() => onEdit(transaction)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                )}
                {onDelete && (
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => onDelete(transaction.id)}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TransactionList;
