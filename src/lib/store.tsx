"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, CategoryLimit, CATEGORIES } from './types';
import { supabase } from './supabase';
import { Session, User } from '@supabase/supabase-js';

interface Profile {
  subscription_status: 'active' | 'inactive';
}

interface AppState {
  expenses: Expense[];
  limits: CategoryLimit[];
  isLoaded: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  updateLimit: (category: string, amount: number) => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

const DEFAULT_LIMITS: CategoryLimit[] = CATEGORIES.map(category => ({ category, amount: 0 }));

export function AppProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [limits, setLimits] = useState<CategoryLimit[]>(DEFAULT_LIMITS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // 1. Get initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        // Clear data on logout
        if (!session) {
          setExpenses([]);
          setLimits(DEFAULT_LIMITS);
          setProfile(null);
          setIsLoaded(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // 3. Load data only when user is authenticated
  useEffect(() => {
    async function loadData() {
      if (!user) return; // Don't fetch if not logged in

      setIsLoaded(false);
      try {
        // Fetch User Profile (Subscription Status)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
           console.error("No profile found or error fetching profile", profileError);
        } else if (profileData) {
           setProfile(profileData as Profile);
        }

        // Fetch expenses
        const { data: storedExpenses, error: expError } = await supabase
          .from('expenses')
          .select('*')
          .order('date', { ascending: false });
          
        if (expError) throw expError;
        if (storedExpenses) {
          setExpenses(storedExpenses);
        }

        // Fetch limits
        const { data: storedLimits, error: limError } = await supabase
          .from('category_limits')
          .select('*');
          
        if (limError) throw limError;
        
        if (storedLimits && storedLimits.length > 0) {
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
        console.error("Failed to load data from Supabase", err);
      } finally {
        setIsLoaded(true);
      }
    }
    
    loadData();
  }, [user]);

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expenseData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setExpenses(prev => [data, ...prev]);
      }
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const updateLimit = async (category: string, amount: number) => {
    if (!user) return;
    try {
      // Optistic UI update
      const newLimits = limits.map(l => l.category === category ? { ...l, amount } : l);
      if (!newLimits.find(l => l.category === category)) {
        newLimits.push({ category: category as any, amount });
      }
      setLimits(newLimits);

      // Perform the remote update using the RPC function we created in the migration
      // The RPC function automatically uses auth.uid()
      const { error } = await supabase.rpc('set_limit', { 
        p_category: category, 
        p_amount: amount 
      });

      if (error) throw error;
      
    } catch (err) {
      console.error("Error updating limit:", err);
      // Optional: Revert optimistic update on failure
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AppContext.Provider value={{ expenses, limits, isLoaded, session, user, profile, addExpense, deleteExpense, updateLimit, signOut }}>
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
