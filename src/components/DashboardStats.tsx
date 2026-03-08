"use client";

import React, { useMemo } from 'react';
import { useAppContext } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CreditCard, Activity } from 'lucide-react';

export default function DashboardStats() {
  const { expenses } = useAppContext();

  const { thisMonthTotal, lastMonthTotal, average } = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let totalThisMonth = 0;
    let totalLastMonth = 0;

    expenses.forEach(e => {
      const d = new Date(e.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        totalThisMonth += e.amount;
      } else if (d.getMonth() === previousMonth && d.getFullYear() === previousYear) {
        totalLastMonth += e.amount;
      }
    });

    const avg = expenses.length > 0 ? expenses.reduce((a, b) => a + b.amount, 0) / expenses.length : 0;

    return { 
      thisMonthTotal: totalThisMonth, 
      lastMonthTotal: totalLastMonth, 
      average: avg 
    };
  }, [expenses]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="flex flex-col justify-between p-6">
        <div className="flex flex-row items-center justify-between pb-4">
          <h3 className="text-sm font-semibold tracking-wide text-muted-foreground/80 uppercase">This Month</h3>
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center shadow-inner shadow-blue-500/20 border border-blue-500/20">
            <DollarSign className="h-5 w-5 text-blue-400" />
          </div>
        </div>
        <div>
          <div className="text-4xl lg:text-5xl font-black tracking-tighter bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent mb-2">${thisMonthTotal.toFixed(2)}</div>
          <p className="text-sm text-muted-foreground font-medium">
            <span className={thisMonthTotal > lastMonthTotal ? "text-red-400" : "text-emerald-400"}>
              {thisMonthTotal > lastMonthTotal ? '+' : '-'}${Math.abs(thisMonthTotal - lastMonthTotal).toFixed(2)}
            </span> from last month
          </p>
        </div>
      </Card>
      
      <Card className="flex flex-col justify-between p-6">
        <div className="flex flex-row items-center justify-between pb-4">
          <h3 className="text-sm font-semibold tracking-wide text-muted-foreground/80 uppercase">Transactions</h3>
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 flex items-center justify-center shadow-inner shadow-indigo-500/20 border border-indigo-500/20">
            <CreditCard className="h-5 w-5 text-indigo-400" />
          </div>
        </div>
        <div>
          <div className="text-4xl lg:text-5xl font-black tracking-tighter bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent mb-2">
            {expenses.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length}
          </div>
          <p className="text-sm text-muted-foreground font-medium">Recordings this month</p>
        </div>
      </Card>

      <Card className="flex flex-col justify-between p-6">
        <div className="flex flex-row items-center justify-between pb-4">
          <h3 className="text-sm font-semibold tracking-wide text-muted-foreground/80 uppercase">Avg. Expense</h3>
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center shadow-inner shadow-emerald-500/20 border border-emerald-500/20">
            <Activity className="h-5 w-5 text-emerald-400" />
          </div>
        </div>
        <div>
          <div className="text-4xl lg:text-5xl font-black tracking-tighter bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent mb-2">${average.toFixed(2)}</div>
          <p className="text-sm text-muted-foreground font-medium">Across all time records</p>
        </div>
      </Card>
    </div>
  );
}
