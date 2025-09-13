import React, { useState } from 'react';
import { Plus, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { Budget } from '../types/finance';

interface BudgetManagerProps {
  budgets: Budget[];
  onAddBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  onUpdateBudget: (id: string, budget: Partial<Budget>) => void;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({ budgets, onAddBudget, onUpdateBudget }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    period: 'monthly' as 'monthly' | 'weekly',
    color: '#3B82F6'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBudget({
      category: newBudget.category,
      limit: parseFloat(newBudget.limit),
      period: newBudget.period,
      color: newBudget.color
    });
    setNewBudget({
      category: '',
      limit: '',
      period: 'monthly',
      color: '#3B82F6'
    });
    setShowAddForm(false);
  };

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage >= 100) return { status: 'exceeded', color: 'bg-red-500', textColor: 'text-red-700' };
    if (percentage >= 80) return { status: 'warning', color: 'bg-amber-500', textColor: 'text-amber-700' };
    return { status: 'good', color: 'bg-green-500', textColor: 'text-green-700' };
  };

  const BudgetCard: React.FC<{ budget: Budget }> = ({ budget }) => {
    const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
    const { status, color, textColor } = getBudgetStatus(budget);
    const remaining = budget.limit - budget.spent;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
            <p className="text-sm text-gray-600 capitalize">{budget.period} budget</p>
          </div>
          <div className="flex items-center gap-2">
            {status === 'exceeded' ? (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            ) : status === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <span className={`text-sm font-medium ${textColor}`}>
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Spent</span>
            <span className="font-medium">${budget.spent.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Limit</span>
            <span className="font-medium">${budget.limit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Remaining</span>
            <span className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(remaining).toFixed(2)} {remaining < 0 ? 'over' : 'left'}
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              status === 'exceeded' ? 'bg-red-500' :
              status === 'warning' ? 'bg-amber-500' : 
              'bg-gradient-to-r from-green-400 to-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => onUpdateBudget(budget.id, { limit: budget.limit + 50 })}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Increase Budget
          </button>
          <div className="flex items-center text-sm text-gray-500">
            <TrendingUp className="w-3 h-3 mr-1" />
            Track spending
          </div>
        </div>
      </div>
    );
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = (totalSpent / totalBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Manager</h1>
          <p className="text-gray-600">Set limits and track your spending across categories</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Budget
        </button>
      </div>

      {/* Overall Budget Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Overall Budget Status</h2>
          <span className={`text-lg font-bold ${
            overallPercentage > 100 ? 'text-red-600' :
            overallPercentage > 80 ? 'text-amber-600' : 'text-green-600'
          }`}>
            {overallPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900">${totalBudget.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining</p>
            <p className={`text-2xl font-bold ${
              totalBudget - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${Math.abs(totalBudget - totalSpent).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="w-full bg-white rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-300 ${
              overallPercentage > 100 ? 'bg-red-500' :
              overallPercentage > 80 ? 'bg-amber-500' : 
              'bg-gradient-to-r from-blue-400 to-purple-500'
            }`}
            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Add Budget Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Budget</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newBudget.category}
                onChange={(e) => setNewBudget(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select category</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Education">Education</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Limit</label>
              <input
                type="number"
                step="0.01"
                value={newBudget.limit}
                onChange={(e) => setNewBudget(prev => ({ ...prev, limit: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
              <select
                value={newBudget.period}
                onChange={(e) => setNewBudget(prev => ({ ...prev, period: e.target.value as 'monthly' | 'weekly' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="color"
                value={newBudget.color}
                onChange={(e) => setNewBudget(prev => ({ ...prev, color: e.target.value }))}
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
              >
                Create Budget
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map(budget => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
        {budgets.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500 mb-4">No budgets created yet.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Create your first budget
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;