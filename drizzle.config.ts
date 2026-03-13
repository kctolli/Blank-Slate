import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  // Path to your schema file
  schema: "./app/db/schema.ts",
  // Where migration files will be stored
  out: "./drizzle",
  // The database dialect
  dialect: "postgresql",
  dbCredentials: {
    // This pulls from your .env file
    url: process.env.DATABASE_URL!,
  },
});
