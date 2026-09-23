import React, { useState, useEffect } from 'react';
import BalanceCard from '../../components/BalanceCard/BalanceCard.jsx';
import TransactionList from '../../components/TransactionList/TransactionList.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import TransactionForm from '../../components/TransactionForm/TransactionForm.jsx';
import { getBalance, getRecentTransactions } from '../../services/summaryService.js';
import { addIncome } from '../../services/incomeService.js';
import { addExpense } from '../../services/expenseService.js';
import styles from './Dashboard.module.css';

function Dashboard() {
  // Состояние данных
  const [balance, setBalance] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  
  // Состояние модалки
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  // Функция загрузки данных
  const loadData = () => {
    const balanceData = getBalance();
    const recentData = getRecentTransactions(5);
    
    setBalance(balanceData);
    setRecentTransactions(recentData);
  };

  // Обработчик открытия модалки
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Обработчик закрытия модалки
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Обработчик отправки формы
  const handleSubmitForm = (data) => {
    // Добавляем операцию в зависимости от типа
    if (data.type === 'income') {
      addIncome(data);
    } else {
      addExpense(data);
    }
    
    // Обновляем данные на странице
    loadData();
    
    // Закрываем модалку
    setIsModalOpen(false);
  };

  return (
    <div className={styles.dashboard}>
      {/* Заголовок и кнопка добавления */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className={styles.title}>Главная</h1>
        <button className={styles.addButton} onClick={handleOpenModal}>
          <span style={{ fontSize: '1.25rem' }}>+</span>
          Добавить операцию
        </button>
      </div>

      {/* Карточки баланса */}
      <div className={styles.cards}>
        <BalanceCard title="Доходы" amount={balance.totalIncome} color="success" />
        <BalanceCard title="Расходы" amount={balance.totalExpense} color="danger" />
        <BalanceCard title="Баланс" amount={balance.balance} color="primary" />
      </div>

      {/* Секция последних операций */}
      <div className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>Последние операции</h2>
        <TransactionList transactions={recentTransactions} />
      </div>

      {/* Модалка с формой */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Новая операция"
      >
        <TransactionForm
          onSubmit={handleSubmitForm}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;
