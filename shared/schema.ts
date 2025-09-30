import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Guild Members
export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  discordId: text("discord_id").notNull().unique(),
  name: text("name").notNull(),
  class: text("class").notNull(),
  level: integer("level").notNull().default(1),
  power: integer("power").notNull().default(0),
  eventPoints: integer("event_points").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Events
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  points: integer("points").notNull(),
  emoji: text("emoji").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  startedBy: text("started_by"),
});

// Event Participations
export const eventParticipations = pgTable("event_participations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => events.id),
  memberId: varchar("member_id").notNull().references(() => members.id),
  checkedInAt: timestamp("checked_in_at").notNull().defaultNow(),
});

// Marketplace Items
export const marketplaceItems = pgTable("marketplace_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  sellerId: varchar("seller_id").notNull().references(() => members.id),
  price: integer("price").notNull(),
  status: text("status").notNull().default("available"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});


// Point Transfers
export const pointTransfers = pgTable("point_transfers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromMemberId: varchar("from_member_id").notNull().references(() => members.id),
  toMemberId: varchar("to_member_id").notNull().references(() => members.id),
  points: integer("points").notNull(),
  approvedBy: text("approved_by"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Bot Configuration
export const botConfig = pgTable("bot_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guildId: text("guild_id").notNull().unique(),
  eventManagerRoleId: text("event_manager_role_id"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Activities Log
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  description: text("description").notNull(),
  userId: text("user_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Item Drops (from events)
export const itemDrops = pgTable("item_drops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemName: text("item_name").notNull(),
  diamondValue: integer("diamond_value").notNull(),
  eventId: varchar("event_id").notNull().references(() => events.id),
  eventName: text("event_name").notNull(),
  participants: text("participants").notNull(),
  addedBy: text("added_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Users (for web authentication)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  discordId: text("discord_id").notNull().unique(),
  username: text("username").notNull(),
  discriminator: text("discriminator"),
  email: text("email"),
  avatar: text("avatar"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert Schemas
export const insertMemberSchema = createInsertSchema(members).omit({ id: true, createdAt: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertMarketplaceItemSchema = createInsertSchema(marketplaceItems).omit({ id: true, createdAt: true });
export const insertPointTransferSchema = createInsertSchema(pointTransfers).omit({ id: true, createdAt: true });
export const insertItemDropSchema = createInsertSchema(itemDrops).omit({ id: true, createdAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type Member = typeof members.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type EventParticipation = typeof eventParticipations.$inferSelect;

export type MarketplaceItem = typeof marketplaceItems.$inferSelect;
export type InsertMarketplaceItem = z.infer<typeof insertMarketplaceItemSchema>;


export type PointTransfer = typeof pointTransfers.$inferSelect;
export type InsertPointTransfer = z.infer<typeof insertPointTransferSchema>;

export type BotConfig = typeof botConfig.$inferSelect;

export type Activity = typeof activities.$inferSelect;

export type ItemDrop = typeof itemDrops.$inferSelect;
export type InsertItemDrop = z.infer<typeof insertItemDropSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
