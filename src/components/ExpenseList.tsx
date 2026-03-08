"use client";

import React from 'react';
import { useAppContext } from '@/lib/store';
import { Trash2, TrendingDown } from 'lucide-react';

export default function ExpenseList() {
  const { expenses, deleteExpense } = useAppContext();

  // Sort by date descending
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Specific colors matching the dark reference ui for the avatar/icons
  const categoryColors: Record<string, string> = {
    "Food": "#f97316", // Orange
    "Transport": "#10b981", // Emerald
    "Entertainment": "#8b5cf6", // Purple
    "Shopping": "#3b82f6", // Blue
    "Utilities": "#f43f5e", // Rose
    "Other": "#a8a29e" // Stone
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        {sortedExpenses.length === 0 ? (
           <div className="h-[150px] flex flex-col items-center justify-center text-zinc-500">
             <p>No transactions recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedExpenses.slice(0, 10).map(expense => (
              <div key={expense.id} className="group flex items-center justify-between rounded-2xl bg-[#27293d] p-4 transition-all">
                <div className="flex items-center gap-4">
                  
                  {/* Avatar / Icon Block */}
                  <div 
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg"
                    style={{ backgroundColor: categoryColors[expense.category] || categoryColors['Other'] }}
                  >
                    {expense.category.substring(0, 1)}
                  </div>
                  
                  <div>
                    <p className="font-semibold text-white">{expense.category}</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {expense.note ? expense.note : new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                    </p>
                  </div>
                 </div>
                 
                <div className="flex flex-col items-end gap-1">
                  <span className="font-semibold text-red-400 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3"/> ${expense.amount.toFixed(2)}
                  </span>
                  
                  <button 
                    className="text-xs text-zinc-500 hover:text-red-500 flex items-center gap-1 transition-colors mt-1 opacity-0 group-hover:opacity-100" 
                    onClick={() => deleteExpense(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
