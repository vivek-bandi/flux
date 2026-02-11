"use server";

import { eq, sql, sum, and, gte, lte, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "./db";
import { userProfiles, expenses, budgets } from "./db/schema";

const UserIdSchema = z.string().uuid("Invalid user ID");

async function setAuthContext(userId: string) {
  const claims = JSON.stringify({ sub: userId, role: "authenticated" });
  await db.execute(
    sql`select set_config('request.jwt.claims', ${claims}, true);`,
  );
}

/**
 * Get or create a user profile.
 * @returns The user profile (existing or newly created).
 */
export async function getOrCreateProfile(
  userId: string,
  email: string,
  name: string,
) {
  const validatedId = UserIdSchema.parse(userId);
  await setAuthContext(validatedId);

  const profile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, validatedId))
    .limit(1);

  if (profile.length === 0) {
    const created = await db
      .insert(userProfiles)
      .values({ id: validatedId, name, email })
      .onConflictDoNothing()
      .returning();
    return created[0];
  }

  return profile[0];
}

/**
 * Create a user profile after signup.
 * @returns The created profile or null if already exists.
 */
export async function createUserProfile(
  userId: string,
  name: string,
  email: string,
) {
  const validatedId = UserIdSchema.parse(userId);
  await setAuthContext(validatedId);

  const created = await db
    .insert(userProfiles)
    .values({ id: validatedId, name, email })
    .onConflictDoNothing()
    .returning();

  return created[0] || null;
}

/**
 * Fetch a user's profile by ID.
 * @returns The user profile or null if not found.
 */
export async function getProfileFromDb(userId: string) {
  const validatedId = UserIdSchema.parse(userId);
  await setAuthContext(validatedId);

  const profile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, validatedId))
    .limit(1);

  return profile[0] || null;
}

/**
 * Update a user's note.
 * @returns The updated profile.
 */
export async function updateNoteInDb(
  userId: string,
  note: string,
): Promise<typeof userProfiles.$inferSelect | undefined> {
  const validatedId = UserIdSchema.parse(userId);
  await setAuthContext(validatedId);

  const updated = await db
    .update(userProfiles)
    .set({ note, updatedAt: new Date() })
    .where(eq(userProfiles.id, validatedId))
    .returning();

  return updated[0];
}

// ============ FINANCE QUERIES ============

const ExpenseSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  date: z.date().optional(),
});

/**
 * Add a new expense for the user.
 */
export async function addExpense(
  userId: string,
  data: {
    amount: number;
    category: string;
    description?: string;
    date?: Date;
  },
) {
  const validatedId = UserIdSchema.parse(userId);
  const validated = ExpenseSchema.parse(data);
  await setAuthContext(validatedId);

  const expense = await db
    .insert(expenses)
    .values({
      userId: validatedId,
      amount: validated.amount.toString(),
      category: validated.category,
      description: validated.description,
      date: validated.date || new Date(),
    })
    .returning();

  return expense[0];
}

/**
 * Get expenses for a specific month.
 */
export async function getExpensesByMonth(
  userId: string,
  year: number,
  month: number,
) {
  const validatedId = UserIdSchema.parse(userId);
  await setAuthContext(validatedId);

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const result = await db
    .select()
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, validatedId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate),
      ),
    )
    .orderBy(desc(expenses.date));

  return result;
}

/**
 * Get spending breakdown by category for a month.
 */
export async function getCategorySpending(
  userId: string,
  year: number,
  month: number,
) {
  const validatedId = UserIdSchema.parse(userId);
  await setAuthContext(validatedId);

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const result = await db
    .select({
      category: expenses.category,
      total: sum(expenses.amount),
      count: sql<number>`count(*)`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, validatedId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate),
      ),
    )
    .groupBy(expenses.category);

  return result;
}

/**
 * Get total spending for a month.
 */
export async function getTotalSpending(
  userId: string,
  year: number,
  month: number,
) {
  const validatedId = UserIdSchema.parse(userId);
  await setAuthContext(validatedId);

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const result = await db
    .select({
      total: sum(expenses.amount),
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, validatedId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate),
      ),
    );

  return parseFloat(result[0]?.total || "0");
}

/**
 * Set a budget for a category in a specific month.
 */
export async function setBudget(
  userId: string,
  category: string,
  limit: number,
  year: number,
  month: number,
) {
  const validatedId = UserIdSchema.parse(userId);
  await setAuthContext(validatedId);

  const monthDate = new Date(year, month - 1, 1)
    .toISOString()
    .split("T")[0];

  // Check if budget exists
  const existing = await db
    .select()
    .from(budgets)
    .where(
      and(
        eq(budgets.userId, validatedId),
        eq(budgets.category, category),
        eq(budgets.month, monthDate),
      ),
    );

  if (existing.length > 0) {
    // Update existing budget
    const updated = await db
      .update(budgets)
      .set({ limit: limit.toString(), updatedAt: new Date() })
      .where(eq(budgets.id, existing[0].id))
      .returning();
    return updated[0];
  }

  // Create new budget
  const created = await db
    .insert(budgets)
    .values({
      userId: validatedId,
      category,
      limit: limit.toString(),
      month: monthDate,
    })
    .returning();

  return created[0];
}

/**
 * Get budget status for all categories in a month.
 */
export async function getBudgetStatus(
  userId: string,
  year: number,
  month: number,
) {
  const validatedId = UserIdSchema.parse(userId);
  await setAuthContext(validatedId);

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  const monthDate = new Date(year, month - 1, 1)
    .toISOString()
    .split("T")[0];

  // Get all budgets for this month
  const userBudgets = await db
    .select()
    .from(budgets)
    .where(
      and(eq(budgets.userId, validatedId), eq(budgets.month, monthDate)),
    );

  // Get spending by category
  const spending = await db
    .select({
      category: expenses.category,
      total: sum(expenses.amount),
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, validatedId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate),
      ),
    )
    .groupBy(expenses.category);

  // Merge budget and spending data
  const status = userBudgets.map((budget) => {
    const spent = parseFloat(
      spending.find((s) => s.category === budget.category)?.total || "0",
    );
    const budgetLimit = parseFloat(budget.limit);
    const percentage = (spent / budgetLimit) * 100;
    const exceeded = spent > budgetLimit;

    return {
      category: budget.category,
      budget: budgetLimit,
      spent,
      remaining: budgetLimit - spent,
      percentage: Math.min(percentage, 100),
      exceeded,
    };
  });

  return status;
}

/**
 * Update an existing expense.
 */
export async function updateExpense(
  userId: string,
  expenseId: string,
  data: {
    amount?: number;
    category?: string;
    description?: string;
    date?: Date;
  },
) {
  const validatedId = UserIdSchema.parse(userId);
  const validatedExpenseId = z.string().uuid().parse(expenseId);
  await setAuthContext(validatedId);

  const updateData: any = { updatedAt: new Date() };
  if (data.amount !== undefined) updateData.amount = data.amount.toString();
  if (data.category !== undefined) updateData.category = data.category;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.date !== undefined) updateData.date = data.date;

  const updated = await db
    .update(expenses)
    .set(updateData)
    .where(
      and(
        eq(expenses.id, validatedExpenseId),
        eq(expenses.userId, validatedId),
      ),
    )
    .returning();

  return updated[0] || null;
}

/**
 * Delete an expense.
 */
export async function deleteExpense(userId: string, expenseId: string) {
  const validatedId = UserIdSchema.parse(userId);
  const validatedExpenseId = z.string().uuid().parse(expenseId);
  await setAuthContext(validatedId);

  const deleted = await db
    .delete(expenses)
    .where(
      and(
        eq(expenses.id, validatedExpenseId),
        eq(expenses.userId, validatedId),
      ),
    )
    .returning();

  return deleted[0] || null;
}

/**
 * Delete a budget.
 */
export async function deleteBudget(userId: string, budgetId: string) {
  const validatedId = UserIdSchema.parse(userId);
  const validatedBudgetId = z.string().uuid().parse(budgetId);
  await setAuthContext(validatedId);

  const deleted = await db
    .delete(budgets)
    .where(
      and(
        eq(budgets.id, validatedBudgetId),
        eq(budgets.userId, validatedId),
      ),
    )
    .returning();

  return deleted[0] || null;
}
