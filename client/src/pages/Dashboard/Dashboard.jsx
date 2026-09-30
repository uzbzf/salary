import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import TransactionForm from '../../components/TransactionForm/TransactionForm.jsx';
import BalanceCard from '../../components/BalanceCard/BalanceCard.jsx';
import TransactionList from '../../components/TransactionList/TransactionList.jsx';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { incomes, expenses, isLoading, deleteTransaction } = useData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense');

  const totalIncome = useMemo(() => {
    return (incomes || []).reduce((sum, item) => sum + Number(item.amount), 0);
  }, [incomes]);

  const totalExpense = useMemo(() => {
    return (expenses || []).reduce((sum, item) => sum + Number(item.amount), 0);
  }, [expenses]);

  const balance = totalIncome - totalExpense;

  const recentTransactions = useMemo(() => {
    const combined = [
      ...(incomes || []).map((item) => ({ ...item, type: 'income' })),
      ...(expenses || []).map((item) => ({ ...item, type: 'expense' }))
    ];
    return combined
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [incomes, expenses]);

  const openAddIncome = () => {
    setModalType('income');
    setIsModalOpen(true);
  };

  const openAddExpense = () => {
    setModalType('expense');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (transaction) => {
    if (window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
      await deleteTransaction(transaction.id, transaction.type);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка данных...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Главная</h1>
        <div className={styles.actions}>
          <button onClick={openAddIncome} className={`${styles.btn} ${styles.btnIncome}`}>
            + Доход
          </button>
          <button onClick={openAddExpense} className={`${styles.btn} ${styles.btnExpense}`}>
            + Расход
          </button>
        </div>
      </div>
      
      <div className={styles.cardsGrid}>
        <BalanceCard title="Баланс" amount={balance} color="balance" />
        <BalanceCard title="Доходы" amount={totalIncome} color="income" />
        <BalanceCard title="Расходы" amount={totalExpense} color="expense" />
      </div>

      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Последние операции</h2>
          <Link to="/history" className={styles.link}>
            Смотреть все →
          </Link>
        </div>
        <TransactionList 
          transactions={recentTransactions} 
          showDelete={true} 
          onDelete={handleDelete} 
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <TransactionForm 
          type={modalType} 
          onSuccess={handleFormSuccess} 
          onCancel={handleCloseModal} 
        />
      </Modal>
    </div>
  );
}
