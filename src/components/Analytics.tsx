import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  Zap
} from 'lucide-react';
import { Transaction, SpendingTrend } from '../types/finance';
import { predictSpendingTrend } from '../utils/aiEngine';

interface AnalyticsProps {
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  // Calculate analytics data
  const spendingTrends = predictSpendingTrend(transactions);
  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income');
  
  // Category spending analysis
  const categorySpending = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategories = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6);
  
  // Monthly comparison
  const thisMonth = new Date().getMonth();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  
  const thisMonthSpending = expenses
    .filter(t => new Date(t.date).getMonth() === thisMonth)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const lastMonthSpending = expenses
    .filter(t => new Date(t.date).getMonth() === lastMonth)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyChange = thisMonthSpending - lastMonthSpending;
  const monthlyChangePercent = lastMonthSpending > 0 ? (monthlyChange / lastMonthSpending) * 100 : 0;

  const SpendingChart: React.FC = () => {
    const maxSpending = Math.max(...spendingTrends.map(t => t.amount));
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Spending Trends
          </h2>
          <div className="flex items-center text-sm text-gray-600">
            <Zap className="w-4 h-4 mr-1 text-amber-500" />
            AI Prediction Included
          </div>
        </div>
        <div className="space-y-4">
          {spendingTrends.map((trend, index) => (
            <div key={trend.month} className="flex items-center">
              <div className="w-20 text-sm font-medium text-gray-600">
                {trend.month}
              </div>
              <div className="flex-1 mx-4">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        trend.predicted 
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500' 
                          : 'bg-gradient-to-r from-blue-400 to-blue-600'
                      }`}
                      style={{ width: `${(trend.amount / maxSpending) * 100}%` }}
                    ></div>
                  </div>
                  {trend.predicted && (
                    <span className="ml-2 text-xs text-amber-600 font-medium">Predicted</span>
                  )}
                </div>
              </div>
              <div className="w-20 text-right text-sm font-semibold text-gray-900">
                ${trend.amount.toFixed(0)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CategoryChart: React.FC = () => {
    const total = topCategories.reduce((sum, [, amount]) => sum + amount, 0);
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-green-500" />
          Category Breakdown
        </h2>
        <div className="space-y-4">
          {topCategories.map(([category, amount], index) => {
            const percentage = (amount / total) * 100;
            const colors = [
              'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
              'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'
            ];
            
            return (
              <div key={category} className="flex items-center">
                <div className={`w-4 h-4 rounded ${colors[index]} mr-3`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${colors[index]} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-sm font-semibold text-gray-900">
                  ${amount.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const InsightCard: React.FC<{
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative';
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, changeType, icon, color }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? 
                <TrendingUp className="w-4 h-4 mr-1" /> : 
                <TrendingDown className="w-4 h-4 mr-1" />
              }
              {change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const avgDailySpending = thisMonthSpending / new Date().getDate();
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Predictive Analytics</h1>
        <p className="text-gray-600">AI-powered insights into your spending patterns and financial trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightCard
          title="Monthly Spending"
          value={`$${thisMonthSpending.toFixed(2)}`}
          change={`${monthlyChangePercent >= 0 ? '+' : ''}${monthlyChangePercent.toFixed(1)}%`}
          changeType={monthlyChangePercent < 0 ? 'positive' : 'negative'}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <InsightCard
          title="Daily Average"
          value={`$${avgDailySpending.toFixed(2)}`}
          icon={<Calendar className="w-6 h-6 text-white" />}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <InsightCard
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          changeType={savingsRate > 20 ? 'positive' : 'negative'}
          change={savingsRate > 20 ? 'Excellent' : 'Needs Improvement'}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <InsightCard
          title="Top Category"
          value={topCategories[0] ? topCategories[0][0] : 'N/A'}
          icon={<PieChart className="w-6 h-6 text-white" />}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart />
        <CategoryChart />
      </div>

      {/* AI Predictions */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-amber-600" />
          AI Financial Predictions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <h3 className="font-medium text-gray-900 mb-2">Next Month Spending</h3>
            <p className="text-2xl font-bold text-amber-700">
              ${spendingTrends[spendingTrends.length - 1]?.amount.toFixed(2) || 'N/A'}
            </p>
            <p className="text-xs text-gray-600 mt-1">Based on current trends</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <h3 className="font-medium text-gray-900 mb-2">Budget Risk</h3>
            <p className="text-2xl font-bold text-amber-700">
              {monthlyChangePercent > 15 ? 'High' : monthlyChangePercent > 5 ? 'Medium' : 'Low'}
            </p>
            <p className="text-xs text-gray-600 mt-1">Overspending likelihood</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <h3 className="font-medium text-gray-900 mb-2">Savings Opportunity</h3>
            <p className="text-2xl font-bold text-amber-700">
              ${(thisMonthSpending * 0.1).toFixed(2)}
            </p>
            <p className="text-xs text-gray-600 mt-1">Potential monthly savings</p>
          </div>
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Financial Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Spending Patterns</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Peak spending day</span>
                <span className="font-medium">Fridays</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average transaction</span>
                <span className="font-medium">${(totalExpenses / expenses.length).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Most frequent category</span>
                <span className="font-medium">{topCategories[0]?.[0] || 'N/A'}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Recommendations</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Consider setting a stricter budget for {topCategories[0]?.[0] || 'your top category'}</p>
              <p>• Your savings rate could improve by reducing discretionary spending</p>
              <p>• Track daily expenses to identify micro-spending patterns</p>
              <p>• Set up automated savings transfers to reach your goals faster</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;