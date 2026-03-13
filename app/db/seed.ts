import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import starterPrompts from "./starterPrompts";
import * as schema from "./schema";

// Bun automatically loads .env.local, so process.env.DATABASE_URL will be available
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🚀 Connection established to Neon...");
  console.log("🌱 Seeding 500 prompts into Postgres...");

  try {
    // We use .insert().values().onConflictDoNothing() 
    // to prevent errors if you run this script twice.
    await db.insert(schema.prompts)
      .values(starterPrompts)
      .onConflictDoNothing();
      
    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    // No explicit close needed for neon-http
    process.exit(0);
  }
}

seed();
