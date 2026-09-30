import { useState } from 'react';
import { deleteIncome } from '../../services/incomeService.js';
import { deleteExpense } from '../../services/expenseService.js';
import styles from './TransactionList.module.css';

// Функция форматирования даты
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Функция форматирования суммы
const formatAmount = (amount, type) => {
  const formatted = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(amount);
  
  return type === 'expense' ? `-${formatted}` : `+${formatted}`;
};

export default function TransactionList({ transactions = [], showDelete = false, onTransactionDeleted }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (transaction) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
      return;
    }

    setDeletingId(transaction.id);
    
    try {
      let success = false;
      
      if (transaction.type === 'income') {
        success = await deleteIncome(transaction.id);
      } else {
        success = await deleteExpense(transaction.id);
      }

      if (success) {
        // Уведомляем родительский компонент об удалении
        if (onTransactionDeleted) {
          onTransactionDeleted(transaction.id);
        }
      } else {
        alert('Не удалось удалить операцию');
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      alert('Произошла ошибка при удалении операции');
    } finally {
      setDeletingId(null);
    }
  };

  if (!transactions || transactions.length === 0) {
    return <p className={styles.empty}>Операций не найдено</p>;
  }

  return (
    <div className={styles.list}>
      {transactions.map((transaction) => (
        <div key={transaction.id} className={`${styles.item} ${styles[transaction.type]}`}>
          <div className={styles.info}>
            <div className={styles.category}>
              {transaction.category}
              {transaction.isRecurring && <span className={styles.recurring}>🔄</span>}
            </div>
            {transaction.comment && <div className={styles.comment}>{transaction.comment}</div>}
            <div className={styles.date}>{formatDate(transaction.date)}</div>
          </div>
          
          <div className={styles.actions}>
            <div className={`${styles.amount} ${styles[transaction.type]}`}>
              {formatAmount(transaction.amount, transaction.type)}
            </div>
            
            {showDelete && (
              <button
                onClick={() => handleDelete(transaction)}
                disabled={deletingId === transaction.id}
                className={styles.deleteBtn}
                title="Удалить"
              >
                {deletingId === transaction.id ? '⏳' : '🗑️'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
