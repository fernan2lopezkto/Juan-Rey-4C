'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { users, keywords, userKeywords } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

const FREE_LIMIT = 5;

export async function getBlacklist() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  // Consulta con JOIN para traer los nombres de las palabras del usuario
  const result = await db
    .select({ word: keywords.name })
    .from(userKeywords)
    .innerJoin(users, eq(userKeywords.userId, users.id))
    .innerJoin(keywords, eq(userKeywords.keywordId, keywords.id))
    .where(eq(users.email, session.user.email));

  return result.map(r => r.word);
}

export async function addWordServer(wordName: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "No autorizado" };

  const cleanWord = wordName.trim().toLowerCase();

  try {
    // 1. Obtener usuario
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email)
    });
    if (!user) return { error: "Usuario no encontrado" };

    // 2. Validar Límite PRO
    const currentCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(userKeywords)
      .where(eq(userKeywords.userId, user.id));

    if (user.plan === 'free' && Number(currentCount[0].count) >= FREE_LIMIT) {
      return { error: `Límite free alcanzado (${FREE_LIMIT}).` };
    }

    // 3. Asegurar que la palabra exista en el diccionario global (keywords)
    const keywordInsert = await db.insert(keywords)
      .values({ name: cleanWord })
      .onConflictDoUpdate({ target: keywords.name, set: { name: cleanWord } })
      .returning();

    const keywordId = keywordInsert[0].id;

    // 4. Vincular palabra al usuario
    await db.insert(userKeywords)
      .values({ userId: user.id, keywordId: keywordId })
      .onConflictDoNothing();

    return { success: true };
  } catch (e) {
    return { error: "Error de base de datos" };
  }
}

export async function removeWordServer(wordName: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  // Buscamos el ID de la palabra y el ID del usuario para romper el vínculo
  const keyword = await db.query.keywords.findFirst({
    where: eq(keywords.name, wordName.toLowerCase())
  });
  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email)
  });

  if (keyword && user) {
    await db.delete(userKeywords)
      .where(and(
        eq(userKeywords.userId, user.id),
        eq(userKeywords.keywordId, keyword.id)
      ));
  }
}
