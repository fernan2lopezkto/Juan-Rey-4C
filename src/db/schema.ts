import { pgTable, serial, text, timestamp, integer, primaryKey, uniqueIndex, json } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  password: text('password'),
  image: text('image'),
  plan: text('plan').default('free').notNull(), 
  createdAt: timestamp('created_at').defaultNow(),
  lastLogin: timestamp('last_login').defaultNow(),
});

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

// NUEVA TABLA DE HISTORIAL
export const youtubeHistory = pgTable('youtube_history', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  videoId: text('video_id').notNull(),
  title: text('title').notNull(),
  thumbnail: text('thumbnail').notNull(),
  channelTitle: text('channel_title'),
  viewedAt: timestamp('viewed_at').defaultNow(),
}, (table) => ({
  // Evita duplicados: un usuario + un video = una fila que se actualiza
  uniqueVideoUser: uniqueIndex('unique_video_user_idx').on(table.userId, table.videoId),
}));

// libreta de notas
export const songs = pgTable('songs', {
  // Usamos text para el ID porque tu app genera UUIDs en el cliente (crypto.randomUUID())
  id: text('id').primaryKey(), 
  
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  title: text('title').notNull(),
  chords: text('chords').default(''),
  notes: text('notes').default(''),
  
  // Guardamos las etiquetas como un array de strings en formato JSON
  tags: json('tags').$type<string[]>().default([]),
  
  // Fechas de auditoría
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
