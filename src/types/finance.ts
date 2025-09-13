export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  isRecurring?: boolean;
  predictedCategory?: string;
  confidence?: number;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly';
  color: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

export interface PredictiveInsight {
  id: string;
  type: 'warning' | 'suggestion' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
}

export interface SpendingTrend {
  month: string;
  amount: number;
  predicted?: boolean;
}