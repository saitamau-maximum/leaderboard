import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey().notNull(),
  teamId: integer("teamId").notNull(),
  competitionId: integer("competitionId").notNull(),
  score: integer("score").notNull(),
  status: text("status").notNull(),
  submittedAt: text("submittedAt").notNull(),
});
