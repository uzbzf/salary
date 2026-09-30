import { createContext, useContext, useState, useEffect } from "react";
import {
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
} from "../services/incomeService.js";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseService.js";

// Контекст для данных
const DataContext = createContext(null);

/**
 * Хук для использования контекста данных
 * @returns {Object} Объект с данными и методами управления
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
};

/**
 * Провайдер контекста данных
 */
export const DataProvider = ({ children }) => {
  // Храним только массивы данных для удобства использования в компонентах
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных при монтировании
  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем данные параллельно через API
        const [incomesRes, expensesRes] = await Promise.all([
          getIncomes(),
          getExpenses(),
        ]);
        
        // Извлекаем массивы из свойства data
        setIncomes(incomesRes.data || []);
        setExpenses(expensesRes.data || []);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Методы для доходов
  const handleAddIncome = async (incomeData) => {
    const res = await addIncome(incomeData);
    const newItem = res.data;
    setIncomes((prev) => [...prev, newItem]);
    return newItem;
  };

  const handleUpdateIncome = async (id, incomeData) => {
    const res = await updateIncome(id, incomeData);
    const updatedItem = res.data;
    if (updatedItem) {
      setIncomes((prev) =>
        prev.map((inc) => (inc.id === id ? updatedItem : inc))
      );
    }
    return updatedItem;
  };

  const handleDeleteIncome = async (id) => {
    const success = await deleteIncome(id);
    if (success) {
      setIncomes((prev) => prev.filter((inc) => inc.id !== id));
    }
    return success;
  };

  // Методы для расходов
  const handleAddExpense = async (expenseData) => {
    const res = await addExpense(expenseData);
    const newItem = res.data;
    setExpenses((prev) => [...prev, newItem]);
    return newItem;
  };

  const handleUpdateExpense = async (id, expenseData) => {
    const res = await updateExpense(id, expenseData);
    const updatedItem = res.data;
    if (updatedItem) {
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === id ? updatedItem : exp))
      );
    }
    return updatedItem;
  };

  const handleDeleteExpense = async (id) => {
    const success = await deleteExpense(id);
    if (success) {
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    }
    return success;
  };

  // Универсальные методы (теперь тоже асинхронные)
  const addTransaction = async (transactionData) => {
    if (transactionData.type === "income") {
      return await handleAddIncome(transactionData);
    } else {
      return await handleAddExpense(transactionData);
    }
  };

  const updateTransaction = async (id, transactionData) => {
    if (transactionData.type === "income") {
      return await handleUpdateIncome(id, transactionData);
    } else {
      return await handleUpdateExpense(id, transactionData);
    }
  };

  const deleteTransaction = async (id, type) => {
    if (type === "income") {
      return await handleDeleteIncome(id);
    } else {
      return await handleDeleteExpense(id);
    }
  };

  const value = {
    incomes,
    expenses,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
