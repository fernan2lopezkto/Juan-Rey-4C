"use client";

import React, { useState } from 'react';
import RulesComponent from './RulesComponent';
import ScoreHandler from './ScoreHandler';

// --- Definición de Tipos ---
export type AnswerOption = {
  answerText: string;
  isCorrect: boolean;
};

export type Question = {
  questionText: string;
  answerOptions: AnswerOption[];
};

interface BqSPAComponentProps {
  questions: Question[]; // Recibimos las preguntas desde el padre
}

export default function BqSPAComponent({ questions }: BqSPAComponentProps) {
  // --- Estados ---
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScoreView, setShowScoreView] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(null);
  const [gameStarted, setGameStarted] = useState(false); // Para mostrar reglas primero

  // --- Lógica de Respuesta ---
  const handleAnswerOptionClick = (isCorrect: boolean) => {
    // 1. Lógica de Puntos (Sumar o Restar)
    if (isCorrect) {
      setScore((prev) => prev + 10);
      setLastResult('correct');
    } else {
      setScore((prev) => prev - 5); // Resta puntos (puedes poner lógica para no bajar de 0 si quieres)
      setLastResult('incorrect');
    }

    // 2. Avanzar pregunta (con un pequeño delay para ver el toast/animación)
    const nextQuestion = currentQuestion + 1;
    setTimeout(() => {
      setLastResult(null); // Reseteamos el estado del toast para que se oculte o reinicie
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScoreView(true);
      }
    }, 1000); // Espera 1 segundo antes de cambiar
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScoreView(false);
    setGameStarted(false);
    setLastResult(null);
  };

  // --- Renderizado ---

  // 1. Si no ha empezado, mostramos Reglas y Botón Start
  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <RulesComponent />
        <button 
          onClick={() => setGameStarted(true)} 
          className="btn btn-primary btn-block text-lg shadow-lg"
        >
          ¡Comenzar Quiz!
        </button>
      </div>
    );
  }

  // 2. Si terminó el juego, mostramos Resultado Final
  if (showScoreView) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body items-center">
            <h2 className="card-title text-3xl mb-4">¡Juego Terminado!</h2>
            <div className="radial-progress text-primary mb-4" style={{ "--value": 100, "--size": "8rem" } as any}>
              {score} pts
            </div>
            <p className="text-lg opacity-70 mb-6">
              Contestaste {questions.length} preguntas.
            </p>
            <button onClick={handleReset} className="btn btn-outline btn-wide">
              Jugar de Nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Juego en curso
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Componente que maneja el puntaje visual y los Toasts */}
      <ScoreHandler score={score} lastResult={lastResult} />

      {/* Tarjeta de Pregunta */}
      <div className="card w-full bg-base-100 shadow-xl border border-base-300 mt-4">
        <div className="card-body">
          <div className="flex justify-between text-sm uppercase font-bold tracking-widest text-gray-500 mb-2">
            <span>Pregunta {currentQuestion + 1} / {questions.length}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-center my-6 min-h-[60px] flex items-center justify-center">
            {questions[currentQuestion].questionText}
          </h3>

          <div className="grid grid-cols-1 gap-3 mt-4">
            {questions[currentQuestion].answerOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerOptionClick(option.isCorrect)}
                // Deshabilitamos botones mientras se procesa la respuesta anterior (1 seg)
                disabled={lastResult !== null}
                className={`btn h-auto py-3 text-lg normal-case 
                  ${lastResult !== null ? 'btn-disabled opacity-50' : 'btn-outline hover:btn-primary'}
                `}
              >
                {option.answerText}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full bg-base-200 h-2 mt-4 rounded-b-xl overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-500 ease-out" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
