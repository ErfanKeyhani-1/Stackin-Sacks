import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/tailwind.css';

interface Transaction {
  amount: number;
  description: string;
}

const App: React.FC = () => {
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [newAmount, setNewAmount] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [isIncome, setIsIncome] = useState<boolean>(true);
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const balance = totalIncome - totalExpenses;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const incomeRes = await axios.get('http://localhost:5000/income');
      const expenseRes = await axios.get('http://localhost:5000/expenses');
      setIncomes(incomeRes.data);
      setExpenses(expenseRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newAmount);
    if (isNaN(amount)) return;

    const transaction = { amount, description: newDescription };
    const endpoint = isIncome ? '/income' : '/expenses';

    try {
      await axios.post(`http://localhost:5000${endpoint}`, transaction);
      fetchData();
      setNewAmount('');
      setNewDescription('');
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">Welcome to StackingSacks!</h1>

      <div className="w-full max-w-md mb-8 bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Your Money Moves</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-400">Balance</p>
            <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Income</p>
            <p className="text-xl font-bold text-green-400">${totalIncome.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Expenses</p>
            <p className="text-xl font-bold text-red-400">${totalExpenses.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm mb-8">
        <input
          type="number"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          placeholder="Amount"
          className="w-full p-2 mb-4 bg-gray-800 rounded"
        />
        <input
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 mb-4 bg-gray-800 rounded"
        />
        <div className="flex justify-between mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={isIncome}
              onChange={() => setIsIncome(true)}
              className="mr-2"
            />
            Income
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={!isIncome}
              onChange={() => setIsIncome(false)}
              className="mr-2"
            />
            Expense
          </label>
        </div>
        <button type="submit" className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700">
          Add Transaction
        </button>
      </form>

      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Your Money Moves</h2>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Incomes</h3>
          {incomes.map((income, index) => (
            <div key={index} className="bg-green-800 p-2 mb-2 rounded">
              ${income.amount} - {income.description}
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Expenses</h3>
          {expenses.map((expense, index) => (
            <div key={index} className="bg-red-800 p-2 mb-2 rounded">
              ${expense.amount} - {expense.description}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;