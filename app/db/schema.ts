import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  text: text("text").notNull().unique(), // Unique constraint is important!
});
