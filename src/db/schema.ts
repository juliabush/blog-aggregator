import {
  pgTable,
  timestamp,
  uuid,
  text,
  foreignKey,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feeds = pgTable(
  "feeds",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    name: text("name").notNull(),
    url: text("url").unique(),
    user_id: uuid("user_id").notNull(),
  },
  (table) => {
    return {
      userFk: foreignKey({
        columns: [table.user_id],
        foreignColumns: [users.id],
      }).onDelete("cascade"),
    };
  }
);

export const feed_follow = pgTable(
  "feed_follows",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    user_id: uuid("user_id").notNull(),
    feed_id: uuid("feed_id").notNull(),
  },
  (table) => {
    return {
      feedFk: foreignKey({
        columns: [table.feed_id],
        foreignColumns: [feeds.id],
      }).onDelete("cascade"),
      userFk: foreignKey({
        columns: [table.user_id],
        foreignColumns: [users.id],
      }).onDelete("cascade"),

      uniquePair: unique().on(table.user_id, table.feed_id),
    };
  }
);
