import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const teams = sqliteTable(
  "teams",
  {
    id: integer("id").primaryKey().notNull(),
    name: text("name").notNull(),
    competitionId: integer("competitionId").notNull(),
  },
  (teams) => ({
    teamUnique: unique().on(teams.name, teams.competitionId),
  })
);
