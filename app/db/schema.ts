import { pgTable, serial, text, integer, timestamp, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  text: text("text").notNull().unique(), // Unique constraint is important!
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const games = pgTable("games", {
  id: text("id").primaryKey(), // 4-letter room code
  status: text("status").$type<"waiting" | "playing" | "scoring" | "finished">().default("waiting").notNull(),
  currentPromptId: integer("current_prompt_id").references(() => prompts.id),
  roundNumber: integer("round_number").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  gameId: text("game_id").references(() => games.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  score: integer("score").default(0).notNull(),
  role: text("role").default("player"), // "host" or "player"
  isOnline: timestamp("last_seen").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // This ensures a name can't be duplicated within the SAME game
  nameIdx: uniqueIndex("name_game_idx").on(table.gameId, table.name),
}));

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  gameId: text("game_id").references(() => games.id, { onDelete: "cascade" }).notNull(),
  playerId: integer("player_id").references(() => players.id, { onDelete: "cascade" }).notNull(),
  roundNumber: integer("round_number").notNull(),
  word: text("word").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameMetadata = pgTable("game_metadata", {
  id: serial("id").primaryKey(),
  gameId: text("game_id").notNull(),
  totalRounds: integer("total_rounds").default(0),
  totalPlayers: integer("total_players").default(0),
  winningScore: integer("winning_score").default(0),
  mostMatchedWord: text("most_matched_word"),
  matchCount: integer("match_count"),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const answersRelations = relations(answers, ({ one }) => ({
  game: one(games, {
    fields: [answers.gameId],
    references: [games.id],
  }),
  player: one(players, {
    fields: [answers.playerId],
    references: [players.id],
  }),
}));

export const gamesRelations = relations(games, ({ many, one }) => ({
  players: many(players),
  answers: many(answers),
  currentPrompt: one(prompts, {
    fields: [games.currentPromptId],
    references: [prompts.id],
  }),
}));

export const playersRelations = relations(players, ({ one }) => ({
  game: one(games, { // Make sure 'games' (the table variable) is imported/defined above
    fields: [players.gameId],
    references: [games.id],
  }),
}));

export const promptsRelations = relations(prompts, ({ many }) => ({
  games: many(games),
}));
