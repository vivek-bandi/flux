"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getDashboardData } from "@/server/actions";
import { useTamboStreamStatus } from "@tambo-ai/react";
import { AlertCircle, Wallet } from "lucide-react";

interface DashboardData {
  currentMonth: string;
  expenses: Array<{
    id: string;
    amount: number;
    category: string;
    description: string | null;
    date: string;
  }>;
  categoryBreakdown: Array<{
    category: string;
    total: number;
    count: number;
  }>;
  totalSpent: number;
  budgetStatus: Array<{
    category: string;
    budget: number;
    spent: number;
    remaining: number;
    percentage: number;
    exceeded: boolean;
  }>;
}

export function FinanceDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { streamStatus } = useTamboStreamStatus();

  useEffect(() => {
    async function loadData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      // Wait for streaming to complete before fetching
      // This prevents premature data fetching during component generation
      if (streamStatus.isStreaming) {
        return;
      }

      try {
        const result = await getDashboardData(user.id);
        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.id, streamStatus.isStreaming]);

  // Show streaming state while AI is generating the component
  if (loading || streamStatus.isStreaming) {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
        Failed to load dashboard
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Total Spending */}
      <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Spent This Month</p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              ₹{data.totalSpent.toFixed(2)}
            </p>
          </div>
          <Wallet className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 opacity-50" />
        </div>
      </div>

      {/* Budget Status */}
      {data.budgetStatus.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Budget Status</h3>
          {data.budgetStatus.map((budget) => (
            <div
              key={budget.category}
              className={`p-4 border rounded-lg ${
                budget.exceeded
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                  : budget.percentage >= 75
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
                    : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {budget.category}
                </span>
                {budget.exceeded && <AlertCircle className="w-4 h-4 text-red-500" />}
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  ₹{budget.spent.toFixed(2)} / ₹{budget.budget.toFixed(2)}
                </span>
                <span
                  className={`font-semibold ${
                    budget.exceeded
                      ? "text-red-600 dark:text-red-400"
                      : budget.percentage >= 75
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {Math.round(budget.percentage)}%
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    budget.exceeded
                      ? "bg-red-500"
                      : budget.percentage >= 75
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Breakdown */}
      {data.categoryBreakdown.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Spending by Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.categoryBreakdown.map((item) => (
              <div
                key={item.category}
                className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{item.category}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ₹{item.total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{item.count} transactions</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Expenses */}
      {data.expenses.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent Expenses</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {data.expenses.slice(0, 5).map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {expense.category}
                  </p>
                  {expense.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">{expense.description}</p>
                  )}
                </div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  -₹{expense.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.expenses.length === 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center text-gray-600 dark:text-gray-400">
          No expenses recorded yet. Say "I spent..." to add one!
        </div>
      )}
    </div>
  );
}
