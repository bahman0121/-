import React, { useState, useMemo } from 'react';
import TransactionForm from './components/TransactionForm';
import TrashIcon from './components/icons/TrashIcon';
import type { Transaction, NewTransaction } from './types';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleAddTransaction = (transaction: NewTransaction) => {
    const totalPurchasePrice = transaction.purchasePricePerKg * transaction.weight;
    const totalSellingPrice = transaction.sellingPricePerKg * transaction.weight;
    const profit = totalSellingPrice - totalPurchasePrice;

    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
      totalPurchasePrice,
      totalSellingPrice,
      profit,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const totalProfit = useMemo(() => {
    return transactions.reduce((acc, curr) => acc + curr.profit, 0);
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            حسابدار ساده
          </h1>
          <p className="mt-2 text-gray-400">سود و زیان معاملات خود را به راحتی محاسبه کنید</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TransactionForm onAddTransaction={handleAddTransaction} />
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">لیست معاملات</h2>
                <div className="text-left">
                  <span className="text-gray-400 block text-sm">سود کل</span>
                  <span className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(totalProfit)} تومان
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                {transactions.length > 0 ? (
                  <table className="w-full text-right">
                    <thead className="border-b border-gray-600">
                      <tr>
                        <th className="p-3 text-sm font-semibold text-gray-400 text-right">محصول</th>
                        <th className="p-3 text-sm font-semibold text-gray-400 text-right hidden sm:table-cell">وزن</th>
                        <th className="p-3 text-sm font-semibold text-gray-400 text-right hidden lg:table-cell">خرید/کیلو</th>
                        <th className="p-3 text-sm font-semibold text-gray-400 text-right hidden lg:table-cell">فروش/کیلو</th>
                        <th className="p-3 text-sm font-semibold text-gray-400 text-right hidden md:table-cell">خرید کل</th>
                        <th className="p-3 text-sm font-semibold text-gray-400 text-right hidden md:table-cell">فروش کل</th>
                        <th className="p-3 text-sm font-semibold text-gray-400 text-right">سود/زیان</th>
                        <th className="p-3 text-sm font-semibold text-gray-400"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-700/50 animate-fade-in">
                          <td className="p-3 font-medium">{t.productName}</td>
                          <td className="p-3 text-gray-300 hidden sm:table-cell">{formatCurrency(t.weight)}</td>
                          <td className="p-3 text-gray-300 hidden lg:table-cell">{formatCurrency(t.purchasePricePerKg)}</td>
                          <td className="p-3 text-gray-300 hidden lg:table-cell">{formatCurrency(t.sellingPricePerKg)}</td>
                          <td className="p-3 text-gray-300 hidden md:table-cell">{formatCurrency(t.totalPurchasePrice)}</td>
                          <td className="p-3 text-gray-300 hidden md:table-cell">{formatCurrency(t.totalSellingPrice)}</td>
                          <td className={`p-3 font-semibold ${t.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(t.profit)}
                          </td>
                          <td className="p-3 text-center">
                            <button 
                              onClick={() => handleDeleteTransaction(t.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              aria-label="حذف معامله"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">هنوز معامله‌ای ثبت نشده است.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;