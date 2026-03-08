"use client";

import React from 'react';
import { useAppContext } from '@/lib/store';
import { AlertCircle } from 'lucide-react';

export default function GlobalAlerts() {
  const { expenses, limits, isLoaded } = useAppContext();

  if (!isLoaded) return null;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Find categories where spending exceeds limits
  const exceededCategories = limits.filter(limit => {
    const limitAmount = Number(limit.amount);
    if (isNaN(limitAmount) || limitAmount <= 0) return false;

    const spent = expenses
      .filter(e => e.category === limit.category && 
                   new Date(e.date).getMonth() === currentMonth && 
                   new Date(e.date).getFullYear() === currentYear)
      .reduce((sum, e) => sum + Number(e.amount), 0);

    return spent > limitAmount;
  });

  if (exceededCategories.length === 0) return null;

  return (
    <div className="w-full px-6 flex flex-col gap-3 mb-2 z-50">
      {exceededCategories.map(cat => (
        <div key={cat.category} className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
          <div className="bg-red-500/20 p-2 rounded-full text-red-400">
             <AlertCircle className="w-5 h-5 flex-shrink-0" />
          </div>
          <div className="flex-1">
             <h4 className="text-white font-medium text-sm">Budget Warning</h4>
             <p className="text-zinc-400 text-xs mt-0.5">
               You have exceeded your monthly limit for <span className="text-red-400 font-semibold">{cat.category}</span>.
             </p>
          </div>
        </div>
      ))}
    </div>
  );
}
