export type Category = 
  | 'Food' 
  | 'Entertainment' 
  | 'Transport' 
  | 'Utilities' 
  | 'Shopping' 
  | 'Other';

export const CATEGORIES: Category[] = [
  'Food',
  'Entertainment',
  'Transport',
  'Utilities',
  'Shopping',
  'Other'
];

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string; // ISO string
  note: string;
}

export interface CategoryLimit {
  category: Category;
  amount: number;
}
