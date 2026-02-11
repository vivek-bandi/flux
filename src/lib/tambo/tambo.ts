import { UserProfileCard } from "@/components/tambo/user-profile-card";
import { FinanceDashboard } from "@/components/tambo/finance-dashboard";
import { ExpenseRecorder } from "@/components/tambo/expense-recorder";
import { getUserProfileById, updateUserNoteById, recordExpense, setBudgetAction } from "@/server/actions";
import type { TamboComponent } from "@tambo-ai/react";
import { z } from "zod";

/**
 * Create Tambo tools bound to a specific user.
 *
 * Tools must be created fresh with the authenticated user's ID because
 * server actions called through Tambo don't have access to cookies for auth.
 * This approach ensures each tool invocation is scoped to the correct user
 * and can safely operate on their data via RLS-protected database operations.
 *
 * @param userId - The authenticated user's ID
 * @param userEmail - The user's email address
 * @param userName - Optional display name (falls back to email prefix)
 * @returns Array of tools bound to the specified user
 */
export function createTools(
  userId: string,
  userEmail: string,
  userName?: string,
) {
  return [
    {
      name: "getUserProfile",
      description:
        "View your profile including name, email, and any saved notes",
      tool: async () => {
        // Validate user profile exists (creates if needed)
        await getUserProfileById(
          userId,
          userEmail,
          userName || userEmail.split("@")[0],
        );
        // Return empty - component fetches its own data
        return {};
      },
      inputSchema: z.object({}),
      outputSchema: z.object({}).strict(),
    },
    {
      name: "updateUserNote",
      description: "Save or update a note in your profile",
      tool: async (input: { note: string }) => {
        await updateUserNoteById(userId, input.note, userEmail, userName);
        // Return empty - component will re-fetch to show updates
        return {};
      },
      inputSchema: z.object({
        note: z
          .string()
          .max(500, "Note must be 500 characters or less")
          .describe("The note content to save."),
      }),
      outputSchema: z.object({}).strict(),
    },
    {
      name: "recordExpense",
      description: "Record spending or expenses. Say things like 'I spent ₹500 on groceries' or 'Movie ticket cost ₹300'",
      tool: async (input: { amount: number; category: string; description?: string }) => {
        const result = await recordExpense(userId, {
          amount: input.amount,
          category: input.category,
          description: input.description,
        });
        // Return just success status - component will show confirmation
        return { success: result.success, message: result.message };
      },
      inputSchema: z.object({
        amount: z
          .number()
          .positive("Amount must be greater than 0")
          .describe("The amount spent in INR (e.g., 500 for ₹500)"),
        category: z
          .enum([
            "groceries",
            "transport",
            "entertainment",
            "utilities",
            "healthcare",
            "food",
            "shopping",
            "other",
          ])
          .describe("Category of the expense"),
        description: z
          .string()
          .optional()
          .describe("Optional description of what was purchased"),
      }),
      outputSchema: z.object({
        success: z.boolean(),
        message: z.string().optional(),
      }),
    },
    {
      name: "viewDashboard",
      description: "View your spending overview - see how much you spent this month, breakdown by categories, and your budget status",
      tool: async () => {
        // Trigger dashboard display - component fetches its own data
        // Return empty to avoid showing JSON in chat
        return {};
      },
      inputSchema: z.object({}),
      outputSchema: z.object({}).strict(),
    },
    {
      name: "setBudget",
      description: "Set or change your monthly budget for a category. For example: set ₹5000 budget for groceries",
      tool: async (input: { category: string; limit: number }) => {
        await setBudgetAction(userId, input.category, input.limit);
        // Return empty - component will refresh to show updates
        return {};
      },
      inputSchema: z.object({
        category: z
          .enum([
            "groceries",
            "transport",
            "entertainment",
            "utilities",
            "healthcare",
            "food",
            "shopping",
            "other",
          ])
          .describe("Category to set budget for"),
        limit: z
          .number()
          .positive("Budget limit must be greater than 0")
          .describe("Monthly budget limit in INR"),
      }),
      outputSchema: z.object({}).strict(),
    },
    {
      name: "getBudgetAlerts",
      description: "Check which spending categories are near their budget or over budget",
      tool: async () => {
        // Trigger alerts display - component fetches its own data
        return {};
      },
      inputSchema: z.object({}),
      outputSchema: z.object({}).strict(),
    },
  ];
}

/**
 * Component registry with associated tools.
 *
 * The associatedTools property links tools to components, telling Tambo's AI
 * that when these tools are called, it should display the component.
 */
export function createComponents(
  userId: string,
  userEmail: string,
  userName?: string,
): TamboComponent[] {
  const tools = createTools(userId, userEmail, userName);

  return [
    {
      name: "UserProfileCard",
      description:
        "Shows your profile with name, email, and saved notes",
      component: UserProfileCard,
      propsSchema: z.object({}),
      associatedTools: [tools[0]], // getUserProfile tool
    },
    {
      name: "ExpenseRecorder",
      description: "Shows confirmation when you record a new expense with amount, category, and details",
      component: ExpenseRecorder,
      propsSchema: z.object({
        amount: z.number().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        error: z.string().optional(),
        message: z.string().optional(),
      }),
      associatedTools: [tools[2]], // recordExpense tool
    },
    {
      name: "FinanceDashboard",
      description: "Shows your complete spending dashboard with monthly totals, category breakdown, budget progress, and recent expenses",
      component: FinanceDashboard,
      propsSchema: z.object({}),
      associatedTools: [tools[3], tools[4], tools[5]], // viewDashboard, setBudget, getBudgetAlerts tools
    },
  ];
}
