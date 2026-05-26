"use server";

import { db } from "@/db";
import { bibleQuizProgress, users, bibleQuizModules, bibleQuizModuleTypes, bibleQuizQuestions } from "@/db/schema";
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

export async function getBibleQuizModulesWithTypes() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return { success: false, error: "No autorizado" };
  }
  
  try {
    // 1. Obtener todos los módulos con su tipo
    const dbModules = await db
      .select({
        id: bibleQuizModules.id,
        key: bibleQuizModules.key,
        name: bibleQuizModules.name,
        description: bibleQuizModules.description,
        type: bibleQuizModules.type,
        isAvailable: bibleQuizModules.isAvailable,
        index: bibleQuizModules.index,
        requiredModuleId: bibleQuizModules.requiredModuleId,
        moduleTypeCode: bibleQuizModuleTypes.code,
      })
      .from(bibleQuizModules)
      .leftJoin(bibleQuizModuleTypes, eq(bibleQuizModules.moduleTypeId, bibleQuizModuleTypes.id))
      .orderBy(bibleQuizModules.index);

    // 2. Mapear a un diccionario id -> key para resolver requerimientos
    const idToKeyMap: Record<number, string> = {};
    dbModules.forEach(mod => {
      idToKeyMap[mod.id] = mod.key;
    });

    // 3. Obtener el conteo de preguntas por módulo
    const questionsCount = await db
      .select({
        moduleId: bibleQuizQuestions.moduleId,
      })
      .from(bibleQuizQuestions);

    const countMap: Record<number, number> = {};
    questionsCount.forEach(q => {
      countMap[q.moduleId] = (countMap[q.moduleId] || 0) + 1;
    });

    // 4. Mapear al formato que espera el Dashboard
    const modules = dbModules.map(mod => {
      const requirements: string[] = [];
      if (mod.requiredModuleId && idToKeyMap[mod.requiredModuleId]) {
        requirements.push(idToKeyMap[mod.requiredModuleId]);
      }
      
      return {
        id: mod.key, // Usamos la key como ID para mantener compatibilidad
        title: mod.name,
        description: mod.description || "",
        isAvailable: mod.isAvailable,
        requirements: requirements,
        totalQuestions: countMap[mod.id] || 0,
        isOptional: mod.type === "optional",
        moduleTypeCode: mod.moduleTypeCode || "trivia"
      };
    });

    return { success: true, modules };
  } catch (error) {
    console.error("Error al obtener los módulos del quiz:", error);
    return { success: false, error: "Error al obtener los módulos" };
  }
}

export async function getBibleQuizQuestionsAction(moduleKey: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return { success: false, error: "No autorizado" };
  }

  try {
    // 1. Obtener el módulo por su key
    const [mod] = await db
      .select()
      .from(bibleQuizModules)
      .where(eq(bibleQuizModules.key, moduleKey))
      .limit(1);

    if (!mod) {
      return { success: false, error: "Módulo no encontrado" };
    }

    // 2. Obtener las preguntas del módulo
    const dbQuestions = await db
      .select()
      .from(bibleQuizQuestions)
      .where(eq(bibleQuizQuestions.moduleId, mod.id));

    // 3. Mapear las preguntas al formato esperado por el frontend
    const questions = dbQuestions.map(q => {
      if (q.cards && q.cards.length > 0) {
        // Es un juego de ordenamiento
        return {
          id: q.id,
          questionText: q.questionText,
          cards: q.cards,
          answerOptions: []
        };
      } else {
        // Es una pregunta trivia de opción múltiple
        const answerOptions = [];
        if (q.respUno) {
          answerOptions.push({
            answerText: q.respUno,
            isCorrect: q.respUno === q.correcta
          });
        }
        if (q.respDos) {
          answerOptions.push({
            answerText: q.respDos,
            isCorrect: q.respDos === q.correcta
          });
        }
        if (q.respTres) {
          answerOptions.push({
            answerText: q.respTres,
            isCorrect: q.respTres === q.correcta
          });
        }

        // Barajamos para que no salga siempre en el mismo orden
        const shuffledOptions = [...answerOptions].sort(() => Math.random() - 0.5);

        return {
          id: q.id,
          questionText: q.questionText,
          answerOptions: shuffledOptions
        };
      }
    });

    return { success: true, questions };
  } catch (error) {
    console.error("Error al obtener las preguntas del quiz:", error);
    return { success: false, error: "Error al obtener las preguntas" };
  }
}
