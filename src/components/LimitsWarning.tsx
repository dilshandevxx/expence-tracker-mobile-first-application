"use client";

import React, { useMemo } from 'react';
import { useAppContext } from '@/lib/store';
import { AlertTriangle } from 'lucide-react';

export default function LimitsWarning() {
  const { expenses, limits } = useAppContext();

  const warnings = useMemo(() => {
    // simple logic: only check this month's expenses or all-time (for simplicity here we do current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const categorySums: Record<string, number> = {};
    
    expenses.forEach(exp => {
      const expDate = new Date(exp.date);
      if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
        categorySums[exp.category] = (categorySums[exp.category] || 0) + exp.amount;
      }
    });

    const exceeded: { category: string, excess: number }[] = [];
    
    limits.forEach(limit => {
      if (limit.amount > 0) {
        const spent = categorySums[limit.category] || 0;
        if (spent > limit.amount) {
          exceeded.push({ 
            category: limit.category, 
            excess: spent - limit.amount 
          });
        }
      }
    });

    return exceeded;
  }, [expenses, limits]);

  if (warnings.length === 0) return null;

  return (
    <div className="space-y-4">
      {warnings.map((w, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-semibold text-sm">Limit Exceeded: {w.category}</p>
            <p className="text-sm opacity-90">
              You have exceeded your monthly limit for {w.category} by ${w.excess.toFixed(2)}. 
              Stop spending money on {w.category}!
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
