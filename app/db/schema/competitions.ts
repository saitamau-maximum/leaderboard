import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const competitions = sqliteTable(
  "competitions",
  {
    id: integer("id").primaryKey().notNull(),
    name: text("name").notNull(),
    isActive: integer("isActive").notNull(),
    verificationCode: text("verificationCode").notNull().unique(),
  },
  (competitions) => ({
    verificationCodeIdx: uniqueIndex("verificationCodeIdx").on(
      competitions.verificationCode
    ),
  })
);
