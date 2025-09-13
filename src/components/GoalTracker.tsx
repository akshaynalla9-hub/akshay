import React, { useState } from 'react';
import { Plus, Target, Calendar, TrendingUp, Star, Clock } from 'lucide-react';
import { Goal } from '../types/finance';

interface GoalTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onUpdateGoal: (id: string, goal: Partial<Goal>) => void;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ goals, onAddGoal, onUpdateGoal }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGoal({
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      deadline: newGoal.deadline,
      category: newGoal.category,
      priority: newGoal.priority
    });
    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      category: '',
      priority: 'medium'
    });
    setShowAddForm(false);
  };

  const addToGoal = (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      onUpdateGoal(goalId, { 
        currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount)
      });
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const GoalCard: React.FC<{ goal: Goal }> = ({ goal }) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const daysLeft = getDaysUntilDeadline(goal.deadline);
    const isOverdue = daysLeft < 0;
    const isUrgent = daysLeft <= 30 && daysLeft > 0;
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                goal.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {goal.priority}
              </span>
            </div>
            <p className="text-sm text-gray-600">{goal.category}</p>
          </div>
          <Target className={`w-6 h-6 ${
            progress >= 100 ? 'text-green-500' :
            progress >= 75 ? 'text-blue-500' :
            progress >= 50 ? 'text-amber-500' : 'text-gray-400'
          }`} />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                progress >= 100 ? 'bg-green-500' :
                'bg-gradient-to-r from-blue-400 to-blue-600'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Current</span>
            <span className="font-medium">${goal.currentAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Target</span>
            <span className="font-medium">${goal.targetAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Remaining</span>
            <span className="font-medium text-blue-600">
              ${(goal.targetAmount - goal.currentAmount).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(goal.deadline).toLocaleDateString()}
          </div>
          <div className={`flex items-center text-sm ${
            isOverdue ? 'text-red-600' :
            isUrgent ? 'text-amber-600' : 'text-gray-600'
          }`}>
            <Clock className="w-4 h-4 mr-1" />
            {isOverdue ? `${Math.abs(daysLeft)} days overdue` :
             daysLeft === 0 ? 'Due today' :
             `${daysLeft} days left`}
          </div>
        </div>

        {progress < 100 && (
          <div className="flex gap-2">
            <button
              onClick={() => addToGoal(goal.id, 25)}
              className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              Add $25
            </button>
            <button
              onClick={() => addToGoal(goal.id, 100)}
              className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
            >
              Add $100
            </button>
          </div>
        )}

        {progress >= 100 && (
          <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg">
            <Star className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-700 font-medium">Goal Completed!</span>
          </div>
        )}
      </div>
    );
  };

  const completedGoals = goals.filter(g => (g.currentAmount / g.targetAmount) * 100 >= 100);
  const activeGoals = goals.filter(g => (g.currentAmount / g.targetAmount) * 100 < 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goal Tracker</h1>
          <p className="text-gray-600">Set financial goals and track your progress</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Goals</p>
              <p className="text-2xl font-bold text-blue-900">{goals.length}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Completed</p>
              <p className="text-2xl font-bold text-green-900">{completedGoals.length}</p>
            </div>
            <Star className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">Active</p>
              <p className="text-2xl font-bold text-amber-900">{activeGoals.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Total Target</p>
              <p className="text-2xl font-bold text-purple-900">
                ${goals.reduce((sum, g) => sum + g.targetAmount, 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Goal</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
              <input
                type="text"
                value={newGoal.name}
                onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Emergency Fund"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
              <input
                type="number"
                step="0.01"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Amount</label>
              <input
                type="number"
                step="0.01"
                value={newGoal.currentAmount}
                onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select category</option>
                <option value="Savings">Savings</option>
                <option value="Education">Education</option>
                <option value="Technology">Technology</option>
                <option value="Travel">Travel</option>
                <option value="Transportation">Transportation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={newGoal.priority}
                onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
              >
                Create Goal
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

      {/* Goals Grid */}
      <div className="space-y-6">
        {activeGoals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeGoals.map(goal => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        )}

        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedGoals.map(goal => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        )}

        {goals.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No financial goals set yet.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Create your first goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalTracker;