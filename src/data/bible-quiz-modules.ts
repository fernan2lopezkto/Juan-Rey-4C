export type QuizModule = {
  id: string;
  title: string;
  description: string;
  isAvailable: boolean; // Si está implementado
  requirements?: string[]; // IDs de módulos que se deben haber pasado para jugar este en modo historia
  totalQuestions: number; // o puntos necesarios, sirve como meta
  isOptional?: boolean; // Módulos opcionales de personajes
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
    id: "mod_2_genesis",
    title: "2. Génesis",
    description: "Preguntas sobre la creación, los patriarcas y los comienzos.",
    isAvailable: true,
    requirements: ["mod_1_pentateuch_order"],
    totalQuestions: 20,
  },
  {
    id: "mod_3_exodus",
    title: "3. Éxodo",
    description: "Preguntas sobre la liberación de Egipto y el desierto.",
    isAvailable: true,
    requirements: ["mod_2_genesis"],
    totalQuestions: 15,
  },
  {
    id: "mod_4_leviticus",
    title: "4. Levítico",
    description: "Leyes, ofrendas y santidad.",
    isAvailable: true,
    requirements: ["mod_3_exodus"],
    totalQuestions: 10,
  },
  {
    id: "mod_5_numbers",
    title: "5. Números",
    description: "El censo, el desierto y la fe.",
    isAvailable: true,
    requirements: ["mod_4_leviticus"],
    totalQuestions: 10,
  },
  {
    id: "mod_6_deuteronomy",
    title: "6. Deuteronomio",
    description: "La segunda ley de Moisés.",
    isAvailable: true,
    requirements: ["mod_5_numbers"],
    totalQuestions: 10,
  },
  {
    id: "mod_7_pentateuch_hard",
    title: "7. Pentateuco (Difícil)",
    description: "Preguntas desafiantes sobre los primeros 5 libros.",
    isAvailable: true,
    requirements: ["mod_6_deuteronomy"],
    totalQuestions: 15,
  },
  {
    id: "mod_char_abraham",
    title: "Personaje: Abraham",
    description: "Preguntas sobre la vida de Abraham y los patriarcas. Módulo opcional.",
    isAvailable: true,
    requirements: ["mod_2_genesis"],
    totalQuestions: 10,
    isOptional: true,
  },
  {
    id: "mod_char_moses",
    title: "Personaje: Moisés",
    description: "Preguntas específicas sobre la vida de Moisés y su liderazgo. Módulo opcional.",
    isAvailable: true,
    requirements: ["mod_3_exodus"],
    totalQuestions: 10,
    isOptional: true,
  },
  {
    id: "mod_char_aaron",
    title: "Personaje: Aarón",
    description: "Preguntas sobre Aarón y el sacerdocio. Módulo opcional.",
    isAvailable: true,
    requirements: ["mod_4_leviticus"],
    totalQuestions: 10,
    isOptional: true,
  },
  {
    id: "mod_char_joshua_caleb",
    title: "Personajes: Josué y Caleb",
    description: "Preguntas sobre los espías y la fe en el desierto. Módulo opcional.",
    isAvailable: true,
    requirements: ["mod_5_numbers"],
    totalQuestions: 10,
    isOptional: true,
  }
];
