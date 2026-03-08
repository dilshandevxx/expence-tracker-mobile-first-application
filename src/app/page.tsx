"use client";

import React from 'react';
import { useAppContext } from "@/lib/store";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import Charts from "@/components/Charts";
import { CategoryCards } from "@/components/LimitForm";
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Dashboard() {
  const { isLoaded, expenses } = useAppContext();

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-white animate-spin"></div>
      </div>
    );
  }

  // Calculate quick stats
  const currentMonth = new Date().getMonth();
  const currentMonthExpenses = expenses.filter(e => new Date(e.date).getMonth() === currentMonth);
  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Header Area */}
      <header className="mb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-6">Good Morning, John!</h1>
        
        {/* Metrics Row */}
        <div className="flex gap-4 w-full">
           {/* Total Sales (Spent) */}
           <div className="flex-1 bg-[#27293d] rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden">
             <span className="text-xs text-zinc-300 font-medium mb-2">Total Spent</span>
             <span className="text-2xl text-white font-bold mb-2">${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
             <span className="text-xs text-primary font-medium flex items-center gap-1">
               <ArrowUpRight className="w-3 h-3" /> 1.5%
             </span>
           </div>

           {/* Total Visitors (Transactions) */}
           <div className="flex-1 bg-[#27293d] rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden">
             <span className="text-xs text-zinc-300 font-medium mb-2">Total Trans.</span>
             <span className="text-2xl text-white font-bold mb-2">{currentMonthExpenses.length}</span>
             <span className="text-xs text-primary font-medium flex items-center gap-1">
               <ArrowUpRight className="w-3 h-3" /> 0.3%
             </span>
           </div>
        </div>
      </header>

      {/* Main Stacked Items */}
      <div className="flex flex-col gap-6">
        
        {/* Revenue / Area Chart Widget */}
        <div className="w-full bg-[#27293d] rounded-3xl p-5 border border-transparent">
           <Charts />
        </div>

        {/* Categories / Donut Chart */}
        <div className="w-full bg-[#27293d] rounded-3xl p-5 border border-transparent">
           <CategoryCards />
        </div>

        {/* Tasks Done / Progress Bar */}
        <div className="w-full bg-[#27293d] rounded-2xl p-5 border border-transparent">
           <div className="flex justify-between items-center mb-3">
             <span className="text-white font-medium">Budget Used</span>
             <span className="text-white font-bold">60%</span>
           </div>
           <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
             <div className="h-full w-[60%] bg-gradient-to-r from-orange-400 to-primary rounded-full"></div>
           </div>
        </div>

        {/* Popular Products / Activity List */}
        <div className="w-full flex justify-between items-center mt-2 mb-2">
          <span className="text-white font-medium">Recent Activity</span>
        </div>
        <div className="w-full">
           <ExpenseList />
        </div>

        {/* Quick Add Form */}
        <div className="w-full flex justify-between items-center mt-4 mb-2">
          <span className="text-white font-medium">Quick Add</span>
        </div>
        <div className="w-full bg-[#27293d] rounded-3xl p-5 border border-transparent mb-8">
           <ExpenseForm />
        </div>

      </div>
    </div>
  );
}
