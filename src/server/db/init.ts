import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Load .env.local
config({ path: ".env.local" });

/**
 * Initialize the database with RLS policies and required setup.
 * Should be run once during deployment.
 */
async function initializeDatabase(): Promise<void> {
  const connection = postgres(process.env.DATABASE_URL!, {
    prepare: false,
  });
  const db = drizzle(connection);

  console.log("🔧 Initializing database...");

  try {
    // ===== Enable Extensions =====
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    console.log("✓ UUID extension enabled");

    // ===== Enable RLS on all tables =====
    await db.execute(sql`ALTER TABLE "user_profiles" ENABLE ROW LEVEL SECURITY;`);
    await db.execute(sql`ALTER TABLE "expenses" ENABLE ROW LEVEL SECURITY;`);
    await db.execute(sql`ALTER TABLE "budgets" ENABLE ROW LEVEL SECURITY;`);
    console.log("✓ RLS enabled on all tables");

    // ===== Drop existing policies (if any) =====
    const tables = ["user_profiles", "expenses", "budgets"];
    for (const table of tables) {
      await db.execute(sql.raw(`DROP POLICY IF EXISTS "Users can view own ${table === "user_profiles" ? "profile" : table}" ON "${table}";`));
      await db.execute(sql.raw(`DROP POLICY IF EXISTS "Users can insert own ${table === "user_profiles" ? "profile" : table}" ON "${table}";`));
      await db.execute(sql.raw(`DROP POLICY IF EXISTS "Users can update own ${table === "user_profiles" ? "profile" : table}" ON "${table}";`));
      await db.execute(sql.raw(`DROP POLICY IF EXISTS "Users can delete own ${table === "user_profiles" ? "profile" : table}" ON "${table}";`));
    }
    console.log("✓ Cleaned up old policies");

    // ===== USER_PROFILES Policies =====
    await db.execute(sql`
      CREATE POLICY "Users can view own profile"
        ON "user_profiles"
        FOR SELECT
        USING (auth.uid() = id);
    `);
    
    await db.execute(sql`
      CREATE POLICY "Users can insert own profile"
        ON "user_profiles"
        FOR INSERT
        WITH CHECK (auth.uid() = id);
    `);
    
    await db.execute(sql`
      CREATE POLICY "Users can update own profile"
        ON "user_profiles"
        FOR UPDATE
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);
    `);
    console.log("✓ Created user_profiles policies");

    // ===== EXPENSES Policies =====
    await db.execute(sql`
      CREATE POLICY "Users can view own expenses"
        ON "expenses"
        FOR SELECT
        USING (auth.uid() = user_id);
    `);
    
    await db.execute(sql`
      CREATE POLICY "Users can insert own expenses"
        ON "expenses"
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    `);
    
    await db.execute(sql`
      CREATE POLICY "Users can update own expenses"
        ON "expenses"
        FOR UPDATE
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    `);
    
    await db.execute(sql`
      CREATE POLICY "Users can delete own expenses"
        ON "expenses"
        FOR DELETE
        USING (auth.uid() = user_id);
    `);
    console.log("✓ Created expenses policies");

    // ===== BUDGETS Policies =====
    await db.execute(sql`
      CREATE POLICY "Users can view own budgets"
        ON "budgets"
        FOR SELECT
        USING (auth.uid() = user_id);
    `);
    
    await db.execute(sql`
      CREATE POLICY "Users can insert own budgets"
        ON "budgets"
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    `);
    
    await db.execute(sql`
      CREATE POLICY "Users can update own budgets"
        ON "budgets"
        FOR UPDATE
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    `);
    
    await db.execute(sql`
      CREATE POLICY "Users can delete own budgets"
        ON "budgets"
        FOR DELETE
        USING (auth.uid() = user_id);
    `);
    console.log("✓ Created budgets policies");

    console.log("\n✅ Database initialized successfully!");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Failed to initialize database:", error);
      process.exit(1);
    });
}
