"use client";

import React, { useState, useEffect } from 'react';
import PersistenceManager from './PersistenceManager';
import ScoreHandler from './ScoreHandler';

export type AnswerOption = { answerText: string; isCorrect: boolean; };
export type Question = { questionText: string; answerOptions: AnswerOption[]; };

export default function BqSPAComponent({ questions }: { questions: Question[] }) {
  // --- Estados ---
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showScoreView, setShowScoreView] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Cargar datos de LocalStorage al iniciar ---
  useEffect(() => {
    const savedProgress = localStorage.getItem('bible-quiz-progress');
    const savedHighScore = localStorage.getItem('bible-quiz-highscore');
    
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
    
    if (savedProgress) {
      const { score: s, currentQuestion: q, gameStarted: gs } = JSON.parse(savedProgress);
      setScore(s);
      setCurrentQuestion(q);
      setGameStarted(gs);
    }
  }, []);

  // --- Guardar progreso cada vez que cambien valores clave ---
  useEffect(() => {
    if (gameStarted) {
      localStorage.setItem('bible-quiz-progress', JSON.stringify({
        score,
        currentQuestion,
        gameStarted
      }));
    }
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('bible-quiz-highscore', score.toString());
    }
  }, [score, currentQuestion, gameStarted, highScore]);

  const handleAnswerOptionClick = (isCorrect: boolean) => {
    if (isProcessing) return; // Evita clics dobles
    setIsProcessing(true);

    if (isCorrect) {
      setScore(prev => prev + 10);
      setLastResult('correct');
    } else {
      setScore(prev => prev - 5);
      setLastResult('incorrect');
    }

    setTimeout(() => {
      setLastResult(null);
      const nextQuestion = currentQuestion + 1;
      
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScoreView(true);
      }
      setIsProcessing(false);
    }, 1200); // Un poco más de tiempo para ver el toast
  };

  const fullReset = () => {
    localStorage.removeItem('bible-quiz-progress');
    setCurrentQuestion(0);
    setScore(0);
    setGameStarted(false);
    setShowScoreView(false);
    setLastResult(null);
  };

  // Renderizado Condicional...
  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <h1 className="text-5xl mt-8 font-serif">Bible Quiz</h1>
        <div className="py-8">
           <PersistenceManager 
              score={score} 
              highScore={highScore} 
              currentQuestion={currentQuestion} 
              totalQuestions={questions.length} 
              onReset={fullReset} 
           />
        </div>
        <button onClick={() => setGameStarted(true)} className="btn btn-primary btn-lg btn-wide">
          {currentQuestion > 0 ? "Continuar Quiz" : "Comenzar Quiz"}
        </button>
      </div>
    );
  }

  if (showScoreView) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center">
            <h2 className="card-title text-3xl">¡Felicidades!</h2>
            <div className="text-5xl font-bold my-4 text-primary">{score} pts</div>
            <p>Has completado el desafío.</p>
            <button onClick={fullReset} className="btn btn-primary mt-4">Reiniciar Todo</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Toast Renderizado aquí directamente para evitar desfases */}
      {lastResult && (
        <div className="toast toast-top toast-center z-[100] mt-10">
          <div className={`alert ${lastResult === 'correct' ? 'alert-success' : 'alert-error'} shadow-lg`}>
            <span>{lastResult === 'correct' ? '¡Correcto! +10' : 'Incorrecto... -5'}</span>
          </div>
        </div>
      )}

      <PersistenceManager 
        score={score} 
        highScore={highScore} 
        currentQuestion={currentQuestion} 
        totalQuestions={questions.length} 
        onReset={fullReset} 
      />

      <ScoreHandler score={score} lastResult={lastResult} />

      <div className="card bg-base-100 shadow-xl border mt-4">
        <div className="card-body">
          <span className="text-xs font-bold opacity-50">PREGUNTA {currentQuestion + 1} / {questions.length}</span>
          <h3 className="text-2xl font-bold py-4">{questions[currentQuestion].questionText}</h3>
          <div className="grid gap-3">
            {questions[currentQuestion].answerOptions.map((opt, idx) => (
              <button 
                key={idx} 
                disabled={isProcessing}
                onClick={() => handleAnswerOptionClick(opt.isCorrect)}
                className="btn btn-outline btn-lg normal-case"
              >
                {opt.answerText}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
