import { Transaction, PredictiveInsight, SpendingTrend } from '../types/finance';

// AI categorization rules
const categoryKeywords = {
  'Food & Dining': ['restaurant', 'food', 'meal', 'pizza', 'coffee', 'lunch', 'dinner', 'breakfast', 'snack', 'cafeteria'],
  'Education': ['book', 'tuition', 'course', 'textbook', 'supplies', 'lab', 'library', 'academic', 'school'],
  'Transportation': ['gas', 'uber', 'bus', 'train', 'parking', 'taxi', 'metro', 'fuel', 'car'],
  'Entertainment': ['movie', 'game', 'music', 'netflix', 'spotify', 'concert', 'party', 'club'],
  'Shopping': ['amazon', 'store', 'clothes', 'shopping', 'retail', 'purchase', 'buy'],
  'Health': ['pharmacy', 'doctor', 'medical', 'health', 'medicine', 'clinic', 'hospital'],
  'Utilities': ['internet', 'phone', 'electricity', 'water', 'bill', 'utility'],
  'Other': []
};

export const categorizeExpense = (description: string): { category: string; confidence: number } => {
  const desc = description.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (category === 'Other') continue;
    
    const matches = keywords.filter(keyword => desc.includes(keyword)).length;
    if (matches > 0) {
      const confidence = Math.min(0.95, 0.6 + (matches * 0.15));
      return { category, confidence };
    }
  }
  
  return { category: 'Other', confidence: 0.3 };
};

export const generatePredictiveInsights = (
  transactions: Transaction[], 
  budgets: any[], 
  currentDate: Date
): PredictiveInsight[] => {
  const insights: PredictiveInsight[] = [];
  const thisMonth = currentDate.getMonth();
  const thisMonthTransactions = transactions.filter(t => 
    new Date(t.date).getMonth() === thisMonth && t.type === 'expense'
  );
  
  // Budget overspend warnings
  budgets.forEach(budget => {
    const spent = thisMonthTransactions
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (spent > budget.limit * 0.8) {
      insights.push({
        id: `budget-${budget.id}`,
        type: spent > budget.limit ? 'warning' : 'suggestion',
        title: `${budget.category} Budget Alert`,
        description: `You've spent $${spent.toFixed(2)} of your $${budget.limit} ${budget.category} budget`,
        confidence: 0.9,
        actionable: true
      });
    }
  });
  
  // Spending pattern insights
  const avgDailySpending = thisMonthTransactions.reduce((sum, t) => sum + t.amount, 0) / new Date().getDate();
  const daysInMonth = new Date(currentDate.getFullYear(), thisMonth + 1, 0).getDate();
  const projectedSpending = avgDailySpending * daysInMonth;
  
  if (projectedSpending > 1000) {
    insights.push({
      id: 'high-spending',
      type: 'warning',
      title: 'High Spending Alert',
      description: `Based on current trends, you're projected to spend $${projectedSpending.toFixed(2)} this month`,
      confidence: 0.85,
      actionable: true
    });
  }
  
  return insights;
};

export const predictSpendingTrend = (transactions: Transaction[]): SpendingTrend[] => {
  const monthlySpending: { [key: string]: number } = {};
  
  transactions.forEach(t => {
    if (t.type === 'expense') {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlySpending[month] = (monthlySpending[month] || 0) + t.amount;
    }
  });
  
  const trends: SpendingTrend[] = Object.entries(monthlySpending).map(([month, amount]) => ({
    month,
    amount
  }));
  
  // Add predicted next month
  const lastThreeMonths = trends.slice(-3);
  if (lastThreeMonths.length >= 2) {
    const avgIncrease = lastThreeMonths.reduce((sum, trend, i) => {
      if (i === 0) return sum;
      return sum + (trend.amount - lastThreeMonths[i - 1].amount);
    }, 0) / (lastThreeMonths.length - 1);
    
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const predicted = Math.max(0, lastThreeMonths[lastThreeMonths.length - 1].amount + avgIncrease);
    
    trends.push({
      month: nextMonth.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      amount: predicted,
      predicted: true
    });
  }
  
  return trends.slice(-6); // Return last 6 months including prediction
};