"use server";

import { createClient } from "@/lib/supabase/supabase-server";
import {
  createUserProfile,
  getOrCreateProfile,
  getProfileFromDb,
  updateNoteInDb,
  addExpense,
  getExpensesByMonth,
  getCategorySpending,
  getTotalSpending,
  setBudget,
  getBudgetStatus,
  updateExpense,
  deleteExpense,
  deleteBudget,
} from "./queries";

interface ProfileResult {
  name: string;
  email: string;
  note: string | null;
  lastUpdated?: string;
}

export async function getUserProfileById(
  userId: string,
  email: string,
  name: string,
): Promise<ProfileResult> {
  const profile = await getOrCreateProfile(userId, email, name);

  if (!profile) {
    throw new Error("Failed to get or create profile");
  }

  return {
    name: profile.name || "",
    email: profile.email || "",
    note: profile.note || null,
    lastUpdated: profile.updatedAt?.toISOString(),
  };
}

/**
 * Get the current authenticated user's profile.
 * Reads user from session cookies, safe for client components to call.
 */
export async function getCurrentUserProfile(): Promise<ProfileResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const profile = await getOrCreateProfile(
    user.id,
    user.email || "unknown@example.com",
    user.user_metadata?.name || "User",
  );

  if (!profile) {
    throw new Error("Failed to get or create profile");
  }

  return {
    name: profile.name || "",
    email: profile.email || "",
    note: profile.note || null,
    lastUpdated: profile.updatedAt?.toISOString(),
  };
}

/**
 * Update user note by ID (for use with Tambo tools where cookies aren't available).
 * Auto-creates the profile if it doesn't exist before updating.
 * @returns Updated user profile data.
 */
export async function updateUserNoteById(
  userId: string,
  note: string,
  email?: string,
  name?: string,
): Promise<ProfileResult> {
  // Check if profile exists first
  let profile = await getProfileFromDb(userId);

  // Auto-create profile if it doesn't exist (with fallback values)
  if (!profile) {
    const fallbackEmail = email || "unknown@example.com";
    const fallbackName = name || "User";
    const newProfile = await createUserProfile(
      userId,
      fallbackName,
      fallbackEmail,
    );
    if (!newProfile) {
      throw new Error("Failed to create profile");
    }
    profile = newProfile;
  }

  const updated = await updateNoteInDb(userId, note);

  if (!updated) {
    throw new Error("Failed to update note");
  }

  return {
    name: updated.name || "",
    email: updated.email || "",
    note: updated.note || null,
    lastUpdated: updated.updatedAt?.toISOString(),
  };
}

// ============ FINANCE SERVER ACTIONS ============

/**
 * Record a new expense (called from Tambo voice input).
 * Auto-categorizes based on description.
 */
export async function recordExpense(
  userId: string,
  data: {
    amount: number;
    category: string;
    description?: string;
    date?: Date;
  },
) {
  try {
    const expense = await addExpense(userId, data);

    return {
      success: true,
      expense: {
        id: expense.id,
        amount: parseFloat(expense.amount as unknown as string),
        category: expense.category,
        description: expense.description,
        date: expense.date?.toISOString(),
      },
      message: `Recorded ₹${data.amount} spent on ${data.category}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to record expense",
    };
  }
}

/**
 * Get dashboard data for the current month.
 */
export async function getDashboardData(userId: string) {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const [expenses, categorySpending, totalSpent, budgetStatus] =
      await Promise.all([
        getExpensesByMonth(userId, year, month),
        getCategorySpending(userId, year, month),
        getTotalSpending(userId, year, month),
        getBudgetStatus(userId, year, month),
      ]);

    return {
      success: true,
      data: {
        currentMonth: `${year}-${String(month).padStart(2, "0")}`,
        expenses: expenses.map((e) => ({
          id: e.id,
          amount: parseFloat(e.amount as unknown as string),
          category: e.category,
          description: e.description,
          date: e.date?.toISOString(),
        })),
        categoryBreakdown: categorySpending.map((item) => ({
          category: item.category,
          total: parseFloat(item.total as unknown as string),
          count: item.count,
        })),
        totalSpent,
        budgetStatus,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch dashboard",
    };
  }
}

/**
 * Set a budget for a category.
 */
export async function setBudgetAction(
  userId: string,
  category: string,
  limit: number,
) {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    await setBudget(userId, category, limit, year, month);

    return {
      success: true,
      message: `Budget set: ₹${limit} for ${category}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to set budget",
    };
  }
}

/**
 * Get budget alerts for categories.
 */
export async function getBudgetAlerts(userId: string) {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const budgetStatus = await getBudgetStatus(userId, year, month);

    const alerts = budgetStatus
      .filter((b) => b.percentage >= 75)
      .map((b) => ({
        category: b.category,
        percentage: Math.round(b.percentage),
        spent: b.spent,
        budget: b.budget,
        exceeded: b.exceeded,
        message: b.exceeded
          ? `Over budget for ${b.category}: ₹${b.spent.toFixed(2)} / ₹${b.budget.toFixed(2)}`
          : `You're ${Math.round(b.percentage)}% of your ${b.category} budget`,
      }));

    return {
      success: true,
      alerts,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch alerts",
    };
  }
}

/**
 * Update an existing expense.
 */
export async function updateExpenseAction(
  userId: string,
  expenseId: string,
  data: {
    amount?: number;
    category?: string;
    description?: string;
    date?: Date;
  },
) {
  try {
    const updated = await updateExpense(userId, expenseId, data);

    if (!updated) {
      return {
        success: false,
        error: "Expense not found or you don't have permission to update it",
      };
    }

    return {
      success: true,
      expense: {
        id: updated.id,
        amount: parseFloat(updated.amount as unknown as string),
        category: updated.category,
        description: updated.description,
        date: updated.date?.toISOString(),
      },
      message: "Expense updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update expense",
    };
  }
}

/**
 * Delete an expense.
 */
export async function deleteExpenseAction(
  userId: string,
  expenseId: string,
) {
  try {
    const deleted = await deleteExpense(userId, expenseId);

    if (!deleted) {
      return {
        success: false,
        error: "Expense not found or you don't have permission to delete it",
      };
    }

    return {
      success: true,
      message: `Deleted expense: ₹${parseFloat(deleted.amount as unknown as string).toFixed(2)} - ${deleted.category}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete expense",
    };
  }
}

/**
 * Delete a budget.
 */
export async function deleteBudgetAction(
  userId: string,
  budgetId: string,
) {
  try {
    const deleted = await deleteBudget(userId, budgetId);

    if (!deleted) {
      return {
        success: false,
        error: "Budget not found or you don't have permission to delete it",
      };
    }

    return {
      success: true,
      message: `Deleted budget for ${deleted.category}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete budget",
    };
  }
}
