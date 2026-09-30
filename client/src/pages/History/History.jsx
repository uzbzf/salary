import { useState, useEffect, useMemo } from 'react';
import { getIncomes } from '../../services/incomeService.js';
import { getExpenses } from '../../services/expenseService.js';
// ✅ Исправленный путь к компоненту внутри его папки
import TransactionList from '../../components/TransactionList/TransactionList.jsx';

export default function History() {
  // Инициализируем состояния с правильной структурой { data: [] }
  const [incomes, setIncomes] = useState({ data: [] });
  const [expenses, setExpenses] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'income', 'expense'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomesRes, expensesRes] = await Promise.all([
          getIncomes(),
          getExpenses()
        ]);
        setIncomes(incomesRes);
        setExpenses(expensesRes);
      } catch (error) {
        console.error('Ошибка загрузки истории:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Безопасный доступ к массивам через ?.data
  const allTransactions = useMemo(() => {
    const combined = [
      ...(incomes?.data || []).map((item) => ({ ...item, type: 'income' })),
      ...(expenses?.data || []).map((item) => ({ ...item, type: 'expense' }))
    ];
    
    // Сортируем по дате (новые сверху)
    return combined.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [incomes, expenses]);

  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return allTransactions;
    return allTransactions.filter((item) => item.type === filter);
  }, [allTransactions, filter]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Загрузка истории...</div>;
  }

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">История операций</h1>
        
        {/* Фильтры */}
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded transition-colors ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          >
            Все
          </button>
          <button 
            onClick={() => setFilter('income')}
            className={`px-3 py-1 rounded transition-colors ${filter === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          >
            Доходы
          </button>
          <button 
            onClick={() => setFilter('expense')}
            className={`px-3 py-1 rounded transition-colors ${filter === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          >
            Расходы
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        {filteredTransactions.length > 0 ? (
          <TransactionList transactions={filteredTransactions} showDelete={true} />
        ) : (
          <p className="text-center text-gray-500 py-8">Операций не найдено</p>
        )}
      </div>
    </div>
  );
}
