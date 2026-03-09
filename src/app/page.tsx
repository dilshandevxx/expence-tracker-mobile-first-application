"use client";

import React, { useState } from 'react';
import { useAppContext } from "@/lib/store";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import Charts from "@/components/Charts";
import { CategoryCards } from "@/components/LimitForm";
import AuthForm from "@/components/AuthForm";
import { ArrowUpRight, LogOut, CheckCircle, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  const { isLoaded, expenses, user, profile, signOut } = useAppContext();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-white animate-spin"></div>
      </div>
    );
  }

  // Protect the dashboard
  if (!user) {
    return <AuthForm />;
  }

  // Handle Paywall for Inactive Subscriptions
  if (profile?.subscription_status !== 'active') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 w-full max-w-[500px] mx-auto">
        <div className="flex justify-end w-full mb-4">
           <button 
              onClick={signOut}
              className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors border border-red-500/20 flex items-center gap-2"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Log out</span>
            </button>
        </div>
        <div className="w-full bg-[#27293d] p-8 rounded-3xl border border-blue-500/20 shadow-[-10px_-10px_30px_4px_rgba(79,70,229,0.1),_10px_10px_30px_4px_rgba(79,70,229,0.15)] relative overflow-hidden">
          
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-3">Expense Tracker Pro</h2>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              Unlock the ultimate personal finance dashboard. Track unlimited expenses, set category budgets, and analyze your spending live.
            </p>

            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-center text-sm font-medium text-zinc-300">
                <CheckCircle className="w-5 h-5 text-blue-400 mr-3" />
                Live Cloud Sync Across Devices
              </li>
              <li className="flex items-center text-sm font-medium text-zinc-300">
                <CheckCircle className="w-5 h-5 text-blue-400 mr-3" />
                Advanced Visual Analytics & KPIs
              </li>
              <li className="flex items-center text-sm font-medium text-zinc-300">
                <CheckCircle className="w-5 h-5 text-blue-400 mr-3" />
                Bank-level Data Security
              </li>
            </ul>

            <div className="text-3xl font-black text-white mb-6">
              $20<span className="text-lg font-medium text-zinc-400">/mo</span>
            </div>

            <button
               onClick={async () => {
                 setIsCheckingOut(true);
                 try {
                   const res = await fetch('/api/checkout', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ userId: user.id, email: user.email })
                   });
                   const data = await res.json();
                   if (data.url) {
                     window.location.href = data.url;
                   } else {
                     alert("Something went wrong handling checkout: " + data.error);
                     setIsCheckingOut(false);
                   }
                 } catch (err) {
                   console.error(err);
                   setIsCheckingOut(false);
                 }
               }}
               disabled={isCheckingOut}
               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl px-4 py-4 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.3)] text-lg"
            >
              {isCheckingOut ? 'Loading Secure Checkout...' : 'Subscribe to Access'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate quick stats for active subscribers
  const currentMonth = new Date().getMonth();
  const currentMonthExpenses = expenses.filter(e => new Date(e.date).getMonth() === currentMonth);
  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="flex flex-col gap-6 w-full">
      
      <header className="mb-2">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
            Good Morning, <br/><span className="text-sm font-normal text-zinc-400">{user.email?.split('@')[0]}!</span>
          </h1>
          <button 
            onClick={signOut}
            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors border border-red-500/20"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-4 w-full">
           <div className="flex-1 bg-[#27293d] rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden">
             <span className="text-xs text-zinc-300 font-medium mb-2">Total Spent</span>
             <span className="text-2xl text-white font-bold mb-2">${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
             <span className="text-xs text-primary font-medium flex items-center gap-1">
               <ArrowUpRight className="w-3 h-3" /> 1.5%
             </span>
           </div>

           <div className="flex-1 bg-[#27293d] rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden">
             <span className="text-xs text-zinc-300 font-medium mb-2">Total Trans.</span>
             <span className="text-2xl text-white font-bold mb-2">{currentMonthExpenses.length}</span>
             <span className="text-xs text-primary font-medium flex items-center gap-1">
               <ArrowUpRight className="w-3 h-3" /> 0.3%
             </span>
           </div>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        
        <div className="w-full bg-[#27293d] rounded-3xl p-5 border border-transparent">
           <Charts />
        </div>

        <div className="w-full bg-[#27293d] rounded-3xl p-5 border border-transparent">
           <CategoryCards />
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
