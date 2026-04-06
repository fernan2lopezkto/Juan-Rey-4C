export type AnswerOption = {
    answerText: string;
    isCorrect: boolean;
};

export type Question = {
    questionText: string;
    answerOptions: AnswerOption[];
    id?: number; // Opcional por si lo necesitas
    dificultad?: string; // Opcional
};
