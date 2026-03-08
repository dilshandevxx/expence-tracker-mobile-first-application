"use client";

import React, { useState } from 'react';
import { useAppContext } from '@/lib/store';
import { CATEGORIES } from '@/lib/types';
import { Plus, Wallet, Tag, AlignLeft, Calendar } from 'lucide-react';

export default function ExpenseForm() {
  const { addExpense } = useAppContext();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    addExpense({
      amount: Number(amount),
      category,
      date,
      note,
    });

    // Reset form
    setAmount('');
    setNote('');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Amount Input */}
        <div className="group relative">
           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
             <Wallet className="h-5 w-5 text-zinc-500" />
           </div>
           <input 
             type="number" 
             value={amount}
             onChange={(e) => setAmount(e.target.value)}
             className="w-full bg-[#1e1e2d] border border-transparent rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-primary transition-all font-medium text-lg"
             placeholder="Amount ($)"
             required
             step="0.01"
           />
        </div>

        {/* Row: Category & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="group relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Tag className="h-4 w-4 text-zinc-500" />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-[#1e1e2d] border border-transparent rounded-2xl py-3 pl-11 pr-4 text-white appearance-none focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-[#27293d]">{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Calendar className="h-4 w-4 text-zinc-500" />
            </div>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#1e1e2d] border border-transparent rounded-2xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm [color-scheme:dark]"
              required
            />
          </div>
        </div>

        {/* Note Input */}
        <div className="group relative">
           <div className="absolute top-3.5 left-0 pl-4 flex items-start pointer-events-none">
             <AlignLeft className="h-4 w-4 text-zinc-500" />
           </div>
           <textarea 
             value={note}
             onChange={(e) => setNote(e.target.value)}
             className="w-full bg-[#1e1e2d] border border-transparent rounded-2xl py-3 pl-11 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm resize-none h-14"
             placeholder="Optional note..."
           />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="mt-2 w-full py-4 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
        >
          <Plus className="w-5 h-5"/> Add Transaction
        </button>
      </form>
    </div>
  );
}
