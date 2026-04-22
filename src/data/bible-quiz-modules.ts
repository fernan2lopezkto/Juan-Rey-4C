export type QuizModule = {
  id: string;
  title: string;
  description: string;
  isAvailable: boolean; // Si está implementado
  requirements?: string[]; // IDs de módulos que se deben haber pasado para jugar este en modo historia
  totalQuestions: number; // o puntos necesarios, sirve como meta
};

export const bibleQuizModules: QuizModule[] = [
  {
    id: "mod_1_pentateuch_order",
    title: "1. Ordena el Pentateuco",
    description: "Ordena los primeros 5 libros de la Biblia en su posición correcta.",
    isAvailable: true,
    totalQuestions: 5, // ej: 5 libros a ordenar
  },
  {
    id: "mod_2_genesis_100",
    title: "2. Génesis: 100 Preguntas",
    description: "Un desafío extenso sobre el primer libro de la Biblia.",
    isAvailable: false, // para el futuro, o lo armamos ahora (simplificado)
    requirements: ["mod_1_pentateuch_order"],
    totalQuestions: 100,
  },
  {
    id: "mod_3_exodus",
    title: "3. Éxodo",
    description: "Preguntas sobre la liberación de Egipto.",
    isAvailable: false,
    requirements: ["mod_2_genesis_100"],
    totalQuestions: 20, // ejemplo
  },
  {
    id: "mod_4_leviticus",
    title: "4. Levítico",
    description: "Leyes y ofrendas.",
    isAvailable: false,
    requirements: ["mod_3_exodus"],
    totalQuestions: 20,
  },
  {
    id: "mod_5_numbers",
    title: "5. Números",
    description: "El censo y el desierto.",
    isAvailable: false,
    requirements: ["mod_4_leviticus"],
    totalQuestions: 20,
  },
  {
    id: "mod_6_deuteronomy",
    title: "6. Deuteronomio",
    description: "La segunda ley.",
    isAvailable: false,
    requirements: ["mod_5_numbers"],
    totalQuestions: 20,
  },
  {
    id: "mod_7_pentateuch_hard",
    title: "7. Pentateuco (Difícil)",
    description: "20 preguntas difíciles de todo el Pentateuco.",
    isAvailable: false,
    requirements: ["mod_6_deuteronomy"],
    totalQuestions: 20,
  }
];
