import { Transaction, Budget, Goal } from '../types/finance';

export const mockTransactions: Transaction[] = [
  { id: '1', amount: 45.50, category: 'Food & Dining', description: 'Campus Cafeteria Lunch', date: '2024-12-15', type: 'expense' },
  { id: '2', amount: 1200, category: 'Income', description: 'Part-time Job Payment', date: '2024-12-14', type: 'income' },
  { id: '3', amount: 89.99, category: 'Education', description: 'Chemistry Textbook', date: '2024-12-13', type: 'expense' },
  { id: '4', amount: 15.75, category: 'Transportation', description: 'Uber to Campus', date: '2024-12-12', type: 'expense' },
  { id: '5', amount: 12.99, category: 'Entertainment', description: 'Netflix Subscription', date: '2024-12-11', type: 'expense' },
  { id: '6', amount: 67.40, category: 'Shopping', description: 'Amazon Purchase - Supplies', date: '2024-12-10', type: 'expense' },
  { id: '7', amount: 24.30, category: 'Food & Dining', description: 'Coffee Shop Study Session', date: '2024-12-09', type: 'expense' },
  { id: '8', amount: 500, category: 'Income', description: 'Scholarship Disbursement', date: '2024-12-08', type: 'income' },
  { id: '9', amount: 156.00, category: 'Education', description: 'Lab Equipment Fee', date: '2024-12-07', type: 'expense' },
  { id: '10', amount: 32.50, category: 'Health', description: 'Pharmacy - Vitamins', date: '2024-12-06', type: 'expense' },
  { id: '11', amount: 78.20, category: 'Food & Dining', description: 'Grocery Shopping', date: '2024-11-28', type: 'expense' },
  { id: '12', amount: 1200, category: 'Income', description: 'Part-time Job Payment', date: '2024-11-15', type: 'income' },
  { id: '13', amount: 125.00, category: 'Entertainment', description: 'Concert Tickets', date: '2024-11-20', type: 'expense' },
  { id: '14', amount: 45.60, category: 'Transportation', description: 'Monthly Bus Pass', date: '2024-11-18', type: 'expense' },
  { id: '15', amount: 89.99, category: 'Shopping', description: 'Winter Jacket', date: '2024-11-10', type: 'expense' }
];

export const mockBudgets: Budget[] = [
  { id: '1', category: 'Food & Dining', limit: 300, spent: 167.50, period: 'monthly', color: '#3B82F6' },
  { id: '2', category: 'Transportation', limit: 100, spent: 61.35, period: 'monthly', color: '#10B981' },
  { id: '3', category: 'Entertainment', limit: 150, spent: 137.99, period: 'monthly', color: '#F59E0B' },
  { id: '4', category: 'Education', limit: 400, spent: 245.99, period: 'monthly', color: '#8B5CF6' },
  { id: '5', category: 'Shopping', limit: 200, spent: 156.90, period: 'monthly', color: '#EF4444' },
  { id: '6', category: 'Health', limit: 75, spent: 32.50, period: 'monthly', color: '#06B6D4' }
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 2000,
    currentAmount: 850,
    deadline: '2025-06-01',
    category: 'Savings',
    priority: 'high'
  },
  {
    id: '2',
    name: 'New Laptop',
    targetAmount: 1500,
    currentAmount: 650,
    deadline: '2025-03-15',
    category: 'Technology',
    priority: 'medium'
  },
  {
    id: '3',
    name: 'Study Abroad',
    targetAmount: 5000,
    currentAmount: 1200,
    deadline: '2025-08-01',
    category: 'Education',
    priority: 'high'
  },
  {
    id: '4',
    name: 'Car Down Payment',
    targetAmount: 3000,
    currentAmount: 450,
    deadline: '2025-12-01',
    category: 'Transportation',
    priority: 'low'
  }
];