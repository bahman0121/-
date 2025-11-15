import React, { useState } from 'react';
import type { NewTransaction } from '../types';

interface TransactionFormProps {
  onAddTransaction: (transaction: NewTransaction) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [productName, setProductName] = useState('');
  const [weight, setWeight] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [priceMode, setPriceMode] = useState<'perKg' | 'total'>('perKg');
  const [error, setError] = useState('');

  const handlePriceModeChange = (mode: 'perKg' | 'total') => {
    if (mode !== priceMode) {
      setPurchasePrice('');
      setSellingPrice('');
      setError('');
      setPriceMode(mode);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !weight || !purchasePrice || !sellingPrice) {
      setError('لطفاً تمام فیلدها را پر کنید.');
      return;
    }

    const weightNum = parseFloat(weight);
    const purchasePriceNum = parseFloat(purchasePrice);
    const sellingPriceNum = parseFloat(sellingPrice);

    if (isNaN(weightNum) || isNaN(purchasePriceNum) || isNaN(sellingPriceNum) || weightNum <= 0 || purchasePriceNum < 0 || sellingPriceNum < 0) {
      setError('لطفاً مقادیر عددی معتبر وارد کنید.');
      return;
    }
    
    let purchasePricePerKgNum: number;
    let sellingPricePerKgNum: number;

    if (priceMode === 'perKg') {
      purchasePricePerKgNum = purchasePriceNum;
      sellingPricePerKgNum = sellingPriceNum;
    } else { // 'total' mode
      purchasePricePerKgNum = purchasePriceNum / weightNum;
      sellingPricePerKgNum = sellingPriceNum / weightNum;
    }

    if (isNaN(purchasePricePerKgNum) || isNaN(sellingPricePerKgNum) || purchasePricePerKgNum < 0 || sellingPricePerKgNum < 0) {
        setError('مقادیر قیمت نامعتبر است. لطفا ورودی‌ها را بررسی کنید.');
        return;
    }

    onAddTransaction({
      productName,
      weight: weightNum,
      purchasePricePerKg: purchasePricePerKgNum,
      sellingPricePerKg: sellingPricePerKgNum,
    });

    setProductName('');
    setWeight('');
    setPurchasePrice('');
    setSellingPrice('');
    setError('');
  };

  const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder: string;
  }> = ({ label, value, onChange, type = 'text', placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
      />
    </div>
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-bold mb-4 text-white">ثبت معامله جدید</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="نوع محصول" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: سیب" />
        <InputField label="وزن (کیلوگرم)" value={weight} onChange={(e) => setWeight(e.target.value)} type="number" placeholder="مثال: 100" />
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">نحوه ورود قیمت</label>
          <div className="flex rounded-md shadow-sm bg-gray-700 p-1">
            <button
              type="button"
              onClick={() => handlePriceModeChange('perKg')}
              className={`w-full py-2 px-4 text-sm font-medium rounded-md transition-colors ${priceMode === 'perKg' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
              قیمت هر کیلو
            </button>
            <button
              type="button"
              onClick={() => handlePriceModeChange('total')}
              className={`w-full py-2 px-4 text-sm font-medium rounded-md transition-colors ${priceMode === 'total' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
              قیمت کل
            </button>
          </div>
        </div>

        <InputField 
          label={priceMode === 'perKg' ? "قیمت خرید هر کیلو (تومان)" : "قیمت خرید کل (تومان)"} 
          value={purchasePrice} 
          onChange={(e) => setPurchasePrice(e.target.value)} 
          type="number" 
          placeholder={priceMode === 'perKg' ? "مثال: 5,000" : "مثال: 500,000"}
        />
        <InputField 
          label={priceMode === 'perKg' ? "قیمت فروش هر کیلو (تومان)" : "قیمت فروش کل (تومان)"}
          value={sellingPrice} 
          onChange={(e) => setSellingPrice(e.target.value)} 
          type="number" 
          placeholder={priceMode === 'perKg' ? "مثال: 7,000" : "مثال: 700,000"}
        />
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
          ثبت
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;