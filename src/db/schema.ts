import { pgTable, serial, text, timestamp, integer, primaryKey, uniqueIndex, json } from 'drizzle-orm/pg-core';
import type { AdapterAccount } from "next-auth/adapters";

// --- TABLA DE USUARIOS (Con password agregado) ---
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }), // Necesario para NextAuth
  image: text('image'),
  password: text('password'), // <--- ESTO ES LO QUE TE FALTABA
  plan: text('plan').default('free').notNull(), 
  createdAt: timestamp('created_at').defaultNow(),
  lastLogin: timestamp('last_login').defaultNow(),
});

// --- TABLAS REQUERIDAS POR NEXTAUTH (Google Login) ---
export const accounts = pgTable("accounts", {
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccount["type"]>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}));

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}));

// --- TUS TABLAS DE LA APP (Keywords, History, Songs) ---

export const keywords = pgTable('keywords', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  nameIndex: uniqueIndex('name_idx').on(table.name),
}));

export const userKeywords = pgTable('user_keywords', {
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  keywordId: integer('keyword_id').notNull().references(() => keywords.id, { onDelete: 'cascade' }),
  assignedAt: timestamp('assigned_at').defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.keywordId] }),
}));

export const youtubeHistory = pgTable('youtube_history', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  videoId: text('video_id').notNull(),
  title: text('title').notNull(),
  thumbnail: text('thumbnail').notNull(),
  channelTitle: text('channel_title'),
  viewedAt: timestamp('viewed_at').defaultNow(),
}, (table) => ({
  uniqueVideoUser: uniqueIndex('unique_video_user_idx').on(table.userId, table.videoId),
}));

export const songs = pgTable('songs', {
  id: text('id').primaryKey(), 
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  chords: text('chords').default(''),
  notes: text('notes').default(''),
  tags: json('tags').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
