import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(),
  competitionId: integer("competitionId").notNull(),
});
