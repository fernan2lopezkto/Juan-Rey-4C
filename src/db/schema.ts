import { pgTable, serial, text, timestamp, integer, primaryKey, uniqueIndex } from 'drizzle-orm/pg-core';

// 1. Tabla de Usuarios (Actualizada con campo PLAN)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  image: text('image'),
  // Agregamos el plan para diferenciar usuarios gratuitos de premium
  plan: text('plan').default('free').notNull(), 
  createdAt: timestamp('created_at').defaultNow(),
  lastLogin: timestamp('last_login').defaultNow(),
});

// 2. Tabla de Palabras Clave (Diccionario global)
export const keywords = pgTable('keywords', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    nameIndex: uniqueIndex('name_idx').on(table.name),
  };
});

// 3. Tabla Intermedia (Relación Muchos a Muchos)
export const userKeywords = pgTable('user_keywords', {
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  keywordId: integer('keyword_id')
    .notNull()
    .references(() => keywords.id, { onDelete: 'cascade' }),
  assignedAt: timestamp('assigned_at').defaultNow(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.keywordId] }),
  };
});
