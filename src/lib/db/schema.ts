import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]);

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  pdfName: text("pdf_name").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  userId: varchar("userId", { length: 255 }),
  pdf_timestamp: timestamp("pdf_timestamp"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  fileKey: text("file_key").notNull(),
});
export type DrizzleChat = typeof chats.$inferSelect;

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .references(() => chats.id)
    .notNull(),
  content: text("text").notNull(),
  //   userId:varchar("user_id", {length:255}).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: userSystemEnum("role").notNull(),
});

// drizzle-orm
//drizzle-kit -migrations
