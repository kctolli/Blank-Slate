import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  text: text("text").notNull().unique(), // Unique constraint is important!
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const games = pgTable("games", {
  id: text("id").primaryKey(), // 4-letter room code
  status: text("status").$type<"waiting" | "playing" | "finished">().default("waiting").notNull(),
  currentPromptId: integer("current_prompt_id").references(() => prompts.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  gameId: text("game_id").references(() => games.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  score: integer("score").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  gameId: text("game_id").references(() => games.id, { onDelete: "cascade" }).notNull(),
  playerId: integer("player_id").references(() => players.id, { onDelete: "cascade" }).notNull(),
  roundNumber: integer("round_number").notNull(),
  word: text("word").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
