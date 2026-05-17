import { pgTable, serial, text, timestamp, integer, primaryKey, uniqueIndex, json, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  password: text('password'),
  image: text('image'),
  plan: text('plan').default('basic').notNull(), 
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
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

// Tabla para códigos de verificación de email (registro)
export const emailVerifications = pgTable('email_verifications', {
  id:        serial('id').primaryKey(),
  email:     text('email').notNull(),
  code:      text('code').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  used:      boolean('used').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabla para el progreso de Bible Quiz
export const bibleQuizProgress = pgTable('bible_quiz_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  moduleId: text('module_id').notNull(), // Ej: 'pentateuch_order', 'genesis_100', etc.
  score: integer('score').notNull().default(0),
  passed: boolean('passed').notNull().default(false), // Si superó el 60%
  completedAt: timestamp('completed_at').defaultNow(),
}, (table) => ({
  // Un usuario solo debe tener un registro principal de progreso por módulo, o actualizar el existente
  uniqueUserModule: uniqueIndex('unique_user_module_idx').on(table.userId, table.moduleId),
}));

// Tabla para los módulos de Bible Quiz
export const bibleQuizModules = pgTable('bible_quiz_modules', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }), // Creador del módulo, si lo hay
  name: text('name').notNull(), // Nombre del módulo, Ej: "Génesis"
  type: text('type').notNull().default('story'), // Tipo de módulo: "story" o "optional"
  index: integer('order_index').notNull().default(0), // Para saber en qué orden aparecen en la historia
  requiredModuleId: integer('required_module_id'), // Módulo previo requerido para desbloquear este
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabla para las preguntas de Bible Quiz
export const bibleQuizQuestions = pgTable('bible_quiz_questions', {
  id: serial('id').primaryKey(),
  moduleId: integer('module_id').notNull().references(() => bibleQuizModules.id, { onDelete: 'cascade' }), // Relación con el módulo
  questionText: text('pregunta').notNull(),
  cards: json('targetas').$type<string[]>().default([]), // Arreglo de strings como en la libreta de canciones
  respUno: text('resp_uno').notNull(),
  respDos: text('resp_dos').notNull(),
  respTres: text('resp_tres').notNull(),
  correcta: text('correcta').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
