"use client";

import React from 'react';
import { useAppContext } from '@/lib/store';
import { AlertTriangle } from 'lucide-react';

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
    <div className="w-full px-6 flex flex-col gap-3 mb-4 z-50">
      {exceededCategories.map(cat => (
        <div key={cat.category} className="relative overflow-hidden bg-gradient-to-br from-red-500/10 via-[#27293d] to-[#27293d] border border-red-500/20 shadow-[0_4px_20px_rgba(239,68,68,0.15)] rounded-2xl p-4 flex items-start gap-4 transition-all">
          
          {/* Glowing Red Background Blur Effect */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-500/20 blur-3xl rounded-full mix-blend-screen pointer-events-none" />
          
          <div className="bg-red-500/20 p-2.5 rounded-xl text-red-400 border border-red-500/20 shadow-inner relative z-10 flex items-center justify-center">
             <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
          </div>
          
          <div className="flex-1 relative z-10 pt-0.5">
             <h4 className="text-red-400 font-semibold text-sm drop-shadow-md">
               Budget Exceeded
             </h4>
             <p className="text-zinc-300 text-xs mt-1.5 leading-relaxed">
               Your spending in <span className="text-white font-bold px-1.5 py-0.5 bg-red-500/20 rounded-md border border-red-500/30 mx-0.5">{cat.category}</span> is now over the limit!
             </p>
          </div>
          
          {/* Watermark Icon */}
          <div className="absolute -bottom-4 -right-2 p-4 opacity-[0.03] pointer-events-none rotate-12">
             <AlertTriangle className="w-24 h-24 text-red-500" />
          </div>
        </div>
      ))}
    </div>
  );
}
