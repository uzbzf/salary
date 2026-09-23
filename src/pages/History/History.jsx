import React, { useState, useEffect } from 'react';
import TransactionList from '../../components/TransactionList/TransactionList.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import TransactionForm from '../../components/TransactionForm/TransactionForm.jsx';
import { getIncomes } from '../../services/incomeService.js';
import { getExpenses } from '../../services/expenseService.js';
import { updateIncome, deleteIncome } from '../../services/incomeService.js';
import { updateExpense, deleteExpense } from '../../services/expenseService.js';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants.js';
import styles from './History.module.css';

function History() {
  // Состояние данных
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  
  // Состояние фильтров
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    period: 'all',
  });
  
  // Состояние модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  // Применение фильтров при изменении данных или фильтров
  useEffect(() => {
    applyFilters();
  }, [allTransactions, filters]);

  // Функция загрузки данных
  const loadData = () => {
    const incomes = getIncomes();
    const expenses = getExpenses();
    
    // Объединяем и сортируем по дате (новые сверху)
    const combined = [...(incomes || []), ...(expenses || [])];
    combined.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setAllTransactions(combined);
  };

  // Применение фильтров
  const applyFilters = () => {
    let result = [...allTransactions];
    
    // Фильтр по типу
    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }
    
    // Фильтр по категории
    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }
    
    // Фильтр по периоду
    if (filters.period !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (filters.period) {
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
          startDate = new Date(now.getFullYear(), quarterMonth, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        result = result.filter((t) => {
          const transactionDate = new Date(t.date);
          return transactionDate >= startDate;
        });
      }
    }
    
    setFilteredTransactions(result);
  };

  // Обработчик изменения фильтра
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  // Сброс всех фильтров
  const handleReset = () => {
    setFilters({ type: 'all', category: 'all', period: 'all' });
  };

  // Обработчик открытия модалки для добавления
  const handleOpenModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // Обработчик закрытия модалки
  const handleCloseModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(false);
  };

  // Обработчик редактирования операции
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // Обработчик удаления операции
  const handleDelete = (id) => {
    if (!confirm('Вы уверены, что хотите удалить эту операцию?')) {
      return;
    }
    
    // Находим операцию для определения типа
    const transaction = allTransactions.find((t) => t.id === id);
    
    if (!transaction) return;
    
    // Удаляем в зависимости от типа
    if (transaction.type === 'income') {
      deleteIncome(id);
    } else {
      deleteExpense(id);
    }
    
    // Обновляем данные
    loadData();
  };

  // Обработчик отправки формы
  const handleSubmitForm = (data) => {
    if (editingTransaction) {
      // Режим редактирования
      if (editingTransaction.type === 'income') {
        updateIncome(editingTransaction.id, data);
      } else {
        updateExpense(editingTransaction.id, data);
      }
    } else {
      // Режим добавления
      if (data.type === 'income') {
        addIncome(data);
      } else {
        addExpense(data);
      }
    }
    
    // Обновляем данные
    loadData();
    
    // Закрываем модалку
    handleCloseModal();
  };

  // Объединённый список категорий для фильтра
  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  return (
    <div className={styles.history}>
      {/* Заголовок и кнопка добавления */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className={styles.title}>История</h1>
        <button className={styles.addButton} onClick={handleOpenModal}>
          <span style={{ fontSize: '1.25rem' }}>+</span>
          Добавить операцию
        </button>
      </div>

      {/* Панель фильтров */}
      <div className={styles.filters}>
        {/* Фильтр по типу операции */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Тип операции</label>
          <select
            className={styles.filterInput}
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        {/* Фильтр по категории */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория</label>
          <select
            className={styles.filterInput}
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">Все</option>
            {allCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Фильтр по периоду */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Период</label>
          <select
            className={styles.filterInput}
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
          >
            <option value="all">Всё время</option>
            <option value="month">Этот месяц</option>
            <option value="quarter">Этот квартал</option>
            <option value="year">Этот год</option>
          </select>
        </div>

        {/* Кнопка сброса фильтров */}
        <button className={styles.resetButton} onClick={handleReset}>
          Сбросить
        </button>
      </div>

      {/* Список транзакций */}
      <div className={styles.listContainer}>
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Модалка с формой */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Редактирование операции' : 'Новая операция'}
      >
        <TransactionForm
          onSubmit={handleSubmitForm}
          onCancel={handleCloseModal}
          editData={editingTransaction}
        />
      </Modal>
    </div>
  );
}

export default History;