"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, CategoryLimit, CATEGORIES } from './types';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  expenses: Expense[];
  limits: CategoryLimit[];
  isLoaded: boolean;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updateLimit: (category: string, amount: number) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const EXPENSES_KEY = 'spendsync_expenses';
const LIMITS_KEY = 'spendsync_limits';

const DEFAULT_LIMITS: CategoryLimit[] = CATEGORIES.map(category => ({ category, amount: 0 }));

export function AppProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [limits, setLimits] = useState<CategoryLimit[]>(DEFAULT_LIMITS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const storedExpenses = await localforage.getItem<Expense[]>(EXPENSES_KEY);
        if (storedExpenses) {
          setExpenses(storedExpenses);
        }

        const storedLimits = await localforage.getItem<CategoryLimit[]>(LIMITS_KEY);
        if (storedLimits) {
          // Merge with defaults in case new categories were added
          const mergedLimits = DEFAULT_LIMITS.map(def => {
            const existing = storedLimits.find(l => l.category === def.category);
            return existing ? existing : def;
          });
          setLimits(mergedLimits);
        } else {
          setLimits(DEFAULT_LIMITS);
        }
      } catch (err) {
        console.error("Failed to load data from storage", err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: uuidv4()
    };
    const newExpenses = [...expenses, newExpense];
    setExpenses(newExpenses);
    await localforage.setItem(EXPENSES_KEY, newExpenses);
  };

  const deleteExpense = async (id: string) => {
    const newExpenses = expenses.filter(e => e.id !== id);
    setExpenses(newExpenses);
    await localforage.setItem(EXPENSES_KEY, newExpenses);
  };

  const updateLimit = async (category: string, amount: number) => {
    const newLimits = limits.map(l => l.category === category ? { ...l, amount } : l);
    // Add if it didn't exist
    if (!newLimits.find(l => l.category === category)) {
      newLimits.push({ category: category as any, amount });
    }
    setLimits(newLimits);
    await localforage.setItem(LIMITS_KEY, newLimits);
  };

  return (
    <AppContext.Provider value={{ expenses, limits, isLoaded, addExpense, deleteExpense, updateLimit }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
