import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from "./src/db";
import { 
  bibleQuizModuleTypes, 
  bibleQuizModules, 
  bibleQuizQuestions 
} from "./src/db/schema";
import { eq } from "drizzle-orm";

// Importamos los datos estáticos
import { bibleQuizModules as staticModules } from "./src/data/bible-quiz-modules";
import { genesisQuestions } from "./src/data/genesis-questions";
import { exodusQuestions } from "./src/data/exodus-questions";
import { leviticusQuestions } from "./src/data/leviticus-questions";
import { numbersQuestions } from "./src/data/numbers-questions";
import { deuteronomyQuestions } from "./src/data/deuteronomy-questions";
import { pentateuchHardQuestions } from "./src/data/pentateuch-hard-questions";
import { abrahamQuestions } from "./src/data/abraham-questions";
import { mosesQuestions } from "./src/data/moses-questions";
import { aaronQuestions } from "./src/data/aaron-questions";
import { joshuaCalebQuestions } from "./src/data/joshua-caleb-questions";

// Mapeo de preguntas
const questionsMap: Record<string, any[]> = {
  "mod_2_genesis": genesisQuestions,
  "mod_3_exodus": exodusQuestions,
  "mod_4_leviticus": leviticusQuestions,
  "mod_5_numbers": numbersQuestions,
  "mod_6_deuteronomy": deuteronomyQuestions,
  "mod_7_pentateuch_hard": pentateuchHardQuestions,
  "mod_char_abraham": abrahamQuestions,
  "mod_char_moses": mosesQuestions,
  "mod_char_aaron": aaronQuestions,
  "mod_char_joshua_caleb": joshuaCalebQuestions,
};

async function main() {
  console.log("Iniciando sembrado de base de datos para Bible Quiz...");

  try {
    // 1. Insertar tipos de módulo
    console.log("Insertando tipos de módulo...");
    let [triviaType] = await db
      .select()
      .from(bibleQuizModuleTypes)
      .where(eq(bibleQuizModuleTypes.code, "trivia"))
      .limit(1);

    if (!triviaType) {
      const [newType] = await db.insert(bibleQuizModuleTypes).values({
        name: "Preguntas de Opción Múltiple",
        code: "trivia",
        description: "Juego tradicional de preguntas con una respuesta correcta y varias incorrectas."
      }).returning();
      triviaType = newType;
    }

    let [orderingType] = await db
      .select()
      .from(bibleQuizModuleTypes)
      .where(eq(bibleQuizModuleTypes.code, "ordering"))
      .limit(1);

    if (!orderingType) {
      const [newType] = await db.insert(bibleQuizModuleTypes).values({
        name: "Ordenar Elementos",
        code: "ordering",
        description: "Juego para ordenar elementos en su orden bíblico secuencial correcto."
      }).returning();
      orderingType = newType;
    }

    console.log("Tipos de módulo listos. Trivia ID:", triviaType.id, "| Ordering ID:", orderingType.id);

    // 2. Insertar módulos
    console.log("Insertando módulos...");
    const keyToDbId: Record<string, number> = {};

    for (let index = 0; index < staticModules.length; index++) {
      const sMod = staticModules[index];
      const isOrdering = sMod.id === "mod_1_pentateuch_order";
      const mTypeId = isOrdering ? orderingType.id : triviaType.id;
      const typeStr = sMod.isOptional ? "optional" : "story";

      // Verificar si ya existe el módulo
      let [existingMod] = await db
        .select()
        .from(bibleQuizModules)
        .where(eq(bibleQuizModules.key, sMod.id))
        .limit(1);

      if (!existingMod) {
        const [inserted] = await db.insert(bibleQuizModules).values({
          key: sMod.id,
          name: sMod.title,
          description: sMod.description,
          type: typeStr,
          isAvailable: sMod.isAvailable,
          index: index,
          moduleTypeId: mTypeId
        }).returning();
        existingMod = inserted;
        console.log(`Creado módulo: ${sMod.title} (ID: ${existingMod.id})`);
      } else {
        console.log(`Módulo ya existente: ${sMod.title} (ID: ${existingMod.id})`);
      }

      keyToDbId[sMod.id] = existingMod.id;
    }

    // 3. Actualizar requiredModuleId de cada módulo
    console.log("Actualizando dependencias de los módulos (requiredModuleId)...");
    for (const sMod of staticModules) {
      if (sMod.requirements && sMod.requirements.length > 0) {
        const firstReqKey = sMod.requirements[0];
        const reqDbId = keyToDbId[firstReqKey];
        if (reqDbId) {
          const modDbId = keyToDbId[sMod.id];
          await db
            .update(bibleQuizModules)
            .set({ requiredModuleId: reqDbId })
            .where(eq(bibleQuizModules.id, modDbId));
          console.log(`Módulo ${sMod.title} ahora requiere el ID ${reqDbId} (${firstReqKey})`);
        }
      }
    }

    // 4. Insertar preguntas
    console.log("Insertando preguntas...");
    for (const sMod of staticModules) {
      const modDbId = keyToDbId[sMod.id];
      if (!modDbId) continue;

      // Limpiar preguntas previas para evitar duplicados si se corre varias veces el seed
      await db.delete(bibleQuizQuestions).where(eq(bibleQuizQuestions.moduleId, modDbId));

      if (sMod.id === "mod_1_pentateuch_order") {
        // Para ordenar, insertamos una sola pregunta que contiene la lista ordenada
        await db.insert(bibleQuizQuestions).values({
          moduleId: modDbId,
          questionText: "Ordena los primeros 5 libros de la Biblia en su posición correcta.",
          cards: ["Génesis", "Éxodo", "Levítico", "Números", "Deuteronomio"],
          respUno: "",
          respDos: "",
          respTres: "",
          correcta: ""
        });
        console.log("Insertadas preguntas para el juego de ordenamiento del Pentateuco.");
      } else {
        const questionsList = questionsMap[sMod.id];
        if (questionsList && questionsList.length > 0) {
          console.log(`Insertando ${questionsList.length} preguntas para ${sMod.title}...`);
          for (const q of questionsList) {
            let questionText = "";
            let respUno = "";
            let respDos = "";
            let respTres = "";
            let correctOpt = "";

            if (q.questionText && q.answerOptions) {
              // Formato 1: { questionText, answerOptions: [{ answerText, isCorrect }] }
              questionText = q.questionText;
              correctOpt = q.answerOptions.find((o: any) => o.isCorrect)?.answerText || "";
              const incorrectOpts = q.answerOptions.filter((o: any) => !o.isCorrect).map((o: any) => o.answerText);
              respUno = correctOpt;
              respDos = incorrectOpts[0] || "";
              respTres = incorrectOpts[1] || "";
            } else if (q.question && q.options) {
              // Formato 2: { question, options: string[], correctAnswer: number }
              questionText = q.question;
              correctOpt = q.options[q.correctAnswer] || "";
              const incorrectOpts = q.options.filter((_: any, idx: number) => idx !== q.correctAnswer);
              respUno = correctOpt;
              respDos = incorrectOpts[0] || "";
              respTres = incorrectOpts[1] || "";
            }

            await db.insert(bibleQuizQuestions).values({
              moduleId: modDbId,
              questionText,
              cards: [], // No se usa en trivia
              respUno,
              respDos,
              respTres,
              correcta: correctOpt
            });
          }
        } else {
          console.warn(`No se encontraron preguntas locales para el módulo ${sMod.title}`);
        }
      }
    }

    console.log("¡Sembrado completado exitosamente!");
  } catch (error) {
    console.error("Error durante el sembrado de base de datos:", error);
  }
}

main();
