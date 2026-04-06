"use client";

import React, { useState } from 'react';
import Link from 'next/link'; // Importamos Link para la navegación

// --- 1. Definición de Tipos ---
type AnswerOption = {
  answerText: string;
  isCorrect: boolean;
};

type Question = {
  questionText: string;
  answerOptions: AnswerOption[];
};

// --- 2. Base de Datos ---
const questions: Question[] = [
  {
    questionText: "¿Quién construyó el arca?",
    answerOptions: [
      { answerText: "Moisés", isCorrect: false },
      { answerText: "Noé", isCorrect: true },
      { answerText: "Abraham", isCorrect: false },
    ],
  },
  {
    questionText: "¿Cuál es el primer libro de la Biblia?",
    answerOptions: [
      { answerText: "Éxodo", isCorrect: false },
      { answerText: "Salmos", isCorrect: false },
      { answerText: "Génesis", isCorrect: true },
    ],
  },
  {
    questionText: "¿Cuántos días estuvo Jonás en el vientre del gran pez?",
    answerOptions: [
      { answerText: "3 días y 3 noches", isCorrect: true },
      { answerText: "7 días", isCorrect: false },
      { answerText: "1 día", isCorrect: false },
    ],
  },
];

export default function BibleQuizBase() {
  // --- 3. Estados ---
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  // --- 4. Manejadores de Eventos ---
  const handleAnswerOptionClick = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  // --- 5. Renderizado ---
  return (
    <div className="w-full max-w-2xl mx-auto my-10 p-4">
      <div className="card w-full bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          
          <h2 className="card-title text-2xl font-bold text-primary mb-4 justify-center">
            Mini  📖 BibleQuiz
          </h2>

          {showScore ? (
            // --- VISTA: RESULTADOS ---
            <div className="text-center space-y-6">
              <div className="stat">
                <div className="stat-title">Puntuación Final</div>
                <div className="stat-value text-primary">
                  {score} / {questions.length}
                </div>
                <div className="stat-desc">Has completado el mini quiz</div>
              </div>

              <div className="card-actions justify-center">
                {/* Usamos Link para navegar a la ruta deseada. 
                   El botón mantiene el estilo de DaisyUI.
                */}
                <Link href="/utilities/bible-quiz" className="btn btn-primary btn-wide">
                  Ir al Juego
                </Link>
              </div>
            </div>
          ) : (
            // --- VISTA: PREGUNTA ---
            <div className="space-y-6">
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm opacity-70">
                  <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
                  <span>{Math.round(progressPercentage)}% completado</span>
                </div>
                <progress 
                  className="progress progress-primary w-full" 
                  value={currentQuestion + 1} 
                  max={questions.length}
                ></progress>
              </div>

              <div className="py-4 min-h-[100px] flex items-center justify-center">
                <h3 className="text-xl font-medium text-center">
                  {questions[currentQuestion].questionText}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].answerOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerOptionClick(option.isCorrect)}
                    className="btn btn-outline hover:btn-primary normal-case text-lg h-auto py-3"
                  >
                    {option.answerText}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
