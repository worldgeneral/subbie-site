import { serial, pgTable, timestamp, text, integer } from "drizzle-orm/pg-core";
import { users } from "./user.model";

export const companies = pgTable("Companies", {
  id: serial("id").primaryKey().notNull(),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  logo: text("logo"),
  blurb: text("blurb"),
});

export type CompaniesSchema = typeof companies.$inferSelect;

export const companies_users = pgTable("Companies_users", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyId: integer("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
});

export type Companies_usersSchema = typeof companies_users.$inferSelect;
