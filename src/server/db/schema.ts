import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  timestamp, 
  uuid, 
  numeric, 
  date,
  index,
  unique,
  check,
} from "drizzle-orm/pg-core";

export const userProfiles = pgTable(
  "user_profiles",
  {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    note: text("note"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => ({
    emailIdx: index("idx_user_profiles_email").on(table.email),
  }),
);

// Finance Management Tables

export const expenses = pgTable(
  "expenses",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    category: text("category").notNull(),
    description: text("description"),
    date: timestamp("date", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => ({
    userDateIdx: index("idx_expenses_user_date").on(table.userId, table.date),
    amountCheck: check("check_positive_amount", sql`${table.amount} > 0`),
  }),
);

export const budgets = pgTable(
  "budgets",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id").notNull(),
    category: text("category").notNull(),
    limit: numeric("limit", { precision: 10, scale: 2 }).notNull(),
    month: date("month").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => ({
    userMonthIdx: index("idx_budgets_user_month").on(table.userId, table.month),
    uniqueBudget: unique("unique_budget_user_category_month").on(
      table.userId,
      table.category,
      table.month,
    ),
    limitCheck: check("check_positive_limit", sql`${table.limit} > 0`),
  }),
);
