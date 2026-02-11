"use client";

import { useEffect, useState } from "react";
import { useTamboStreamStatus } from "@tambo-ai/react";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ExpenseRecorderProps {
  amount?: number; // Optional during streaming
  category?: string; // Optional during streaming
  description?: string;
  error?: string;
  message?: string;
}

export function ExpenseRecorder({
  amount,
  category,
  description,
  error,
  message,
}: ExpenseRecorderProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const { streamStatus } = useTamboStreamStatus();

  useEffect(() => {
    setIsAnimating(true);
  }, [amount, category]);

  // Show loading state during streaming if required props aren't ready
  if (streamStatus.isStreaming || !amount || !category) {
    return (
      <div className="w-full p-4 bg-gray-50 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <p className="font-semibold text-red-600 dark:text-red-400">Error</p>
            <p className="text-sm text-red-500 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg transform transition-all duration-500 ${
        isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
      }`}
    >
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-green-600 dark:text-green-400">
            {message ?? "Expense recorded!"}
          </p>
          <div className="mt-2 space-y-1 text-sm text-green-600 dark:text-green-300">
            <p>
              <span className="font-medium">₹{amount?.toFixed(2)}</span>
              <span className="mx-2">•</span>
              <span className="capitalize font-medium">{category}</span>
            </p>
            {description && <p className="text-green-500 dark:text-green-400">{description}</p>}
            <p className="text-xs text-green-500 dark:text-green-500 mt-2">
              Today at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
