import { pgTable, serial, text, timestamp, integer, primaryKey, uniqueIndex } from 'drizzle-orm/pg-core';

// 1. Tabla de Usuarios (la que ya tenías)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  lastLogin: timestamp('last_login').defaultNow(),
});

// 2. Tabla de Palabras Clave (Diccionario global)
// Aquí guardamos la palabra una sola vez para todos los usuarios
export const keywords = pgTable('keywords', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(), // "unique" asegura que no haya duplicados
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    nameIndex: uniqueIndex('name_idx').on(table.name),
  };
});

// 3. Tabla Intermedia (Relación Muchos a Muchos)
// Vincula qué usuario tiene qué palabras
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
    // Definimos una llave primaria compuesta para que un usuario 
    // no pueda tener la misma palabra vinculada dos veces
    pk: primaryKey({ columns: [table.userId, table.keywordId] }),
  };
});
