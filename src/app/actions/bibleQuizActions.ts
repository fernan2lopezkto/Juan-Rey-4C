"use server";

import { db } from "@/db";
import { bibleQuizProgress, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getBibleQuizProgress() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return { success: false, error: "No autorizado" };
  }
  
  try {
    const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    if (!user) return { success: false, error: "Usuario no encontrado" };
    
    const userId = user.id;
    
    const progress = await db
      .select()
      .from(bibleQuizProgress)
      .where(eq(bibleQuizProgress.userId, userId));
      
    return { success: true, progress };
  } catch (error) {
    console.error("Error al obtener el progreso:", error);
    return { success: false, error: "Error al obtener el progreso" };
  }
}

export async function saveBibleQuizProgress(moduleId: string, score: number, passed: boolean) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return { success: false, error: "No autorizado" };
  }
  
  try {
    const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    if (!user) return { success: false, error: "Usuario no encontrado" };
    
    const userId = user.id;

    // Buscar si ya existe el progreso
    const existing = await db
      .select()
      .from(bibleQuizProgress)
      .where(
        and(
          eq(bibleQuizProgress.userId, userId),
          eq(bibleQuizProgress.moduleId, moduleId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Actualizar si el score es mayor, o si ahora sí pasó
      const prev = existing[0];
      const newHighScore = Math.max(prev.score, score);
      const nowPassed = prev.passed || passed;
      
      await db
        .update(bibleQuizProgress)
        .set({
          score: newHighScore,
          passed: nowPassed,
          completedAt: new Date()
        })
        .where(eq(bibleQuizProgress.id, prev.id));
    } else {
      // Crear nuevo registro
      await db.insert(bibleQuizProgress).values({
        userId,
        moduleId,
        score,
        passed,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error al guardar el progreso:", error);
    return { success: false, error: "Error al guardar el progreso" };
  }
}
