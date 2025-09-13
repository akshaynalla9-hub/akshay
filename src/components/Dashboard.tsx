import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  PiggyBank,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Transaction, Budget, Goal, PredictiveInsight } from '../types/finance';

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  insights: PredictiveInsight[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, budgets, goals, insights }) => {
  // Calculate metrics
  const thisMonth = new Date().getMonth();
  const thisMonthTransactions = transactions.filter(t => new Date(t.date).getMonth() === thisMonth);
  const totalIncome = thisMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = thisMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  
  const totalBudgetUsed = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const budgetUsagePercent = (totalBudgetUsed / totalBudgetLimit) * 100;
  
  const totalGoalProgress = goals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount), 0) / goals.length * 100;

  const StatCard: React.FC<{
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative';
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, changeType, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? 
                <ArrowUpRight className="w-4 h-4 mr-1" /> : 
                <ArrowDownRight className="w-4 h-4 mr-1" />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
        <p className="text-gray-600">Your complete financial overview at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Monthly Balance"
          value={`$${netBalance.toFixed(2)}`}
          change={netBalance > 0 ? "+15.3%" : "-8.2%"}
          changeType={netBalance > 0 ? 'positive' : 'negative'}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Income"
          value={`$${totalIncome.toFixed(2)}`}
          change="+12.5%"
          changeType="positive"
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toFixed(2)}`}
          change="-3.1%"
          changeType="positive"
          icon={<CreditCard className="w-6 h-6 text-white" />}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
        <StatCard
          title="Budget Usage"
          value={`${budgetUsagePercent.toFixed(1)}%`}
          icon={<PiggyBank className="w-6 h-6 text-white" />}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
            AI Financial Insights
          </h2>
          <div className="space-y-3">
            {insights.slice(0, 3).map(insight => (
              <div 
                key={insight.id} 
                className={`flex items-start p-4 rounded-lg border-l-4 ${
                  insight.type === 'warning' ? 'bg-red-50 border-red-400' :
                  insight.type === 'suggestion' ? 'bg-amber-50 border-amber-400' :
                  'bg-green-50 border-green-400'
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{insight.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  <div className="flex items-center mt-2">
                    <div className="text-xs text-gray-500">
                      Confidence: {(insight.confidence * 100).toFixed(0)}%
                    </div>
                    {insight.actionable && (
                      <span className="ml-4 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Actionable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h2>
        <div className="space-y-4">
          {budgets.slice(0, 4).map(budget => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isOverBudget = percentage > 100;
            
            return (
              <div key={budget.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{budget.category}</span>
                  <span className={`text-sm ${isOverBudget ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                    ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isOverBudget ? 'bg-red-500' : 'bg-gradient-to-r from-blue-400 to-blue-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goals Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-green-500" />
          Goals Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.slice(0, 4).map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            
            return (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{goal.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                    goal.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {goal.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {progress.toFixed(1)}% complete • Due {new Date(goal.deadline).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;