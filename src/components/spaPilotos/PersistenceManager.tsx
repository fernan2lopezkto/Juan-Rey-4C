"use client";
import React from 'react';

interface PersistenceProps {
  score: number;
  highScore: number;
  currentQuestion: number;
  totalQuestions: number;
  onReset: () => void;
}

export default function PersistenceManager({ score, highScore, currentQuestion, totalQuestions, onReset }: PersistenceProps) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex justify-between items-center bg-base-200 p-3 rounded-lg shadow-inner">
        <div>
          <p className="text-xs uppercase opacity-60">Récord Histórico</p>
          <p className="text-xl font-bold text-secondary">{highScore} pts</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase opacity-60">Progreso</p>
          <p className="text-sm font-medium">{currentQuestion} / {totalQuestions} completadas</p>
        </div>
      </div>
      <button 
        onClick={onReset} 
        className="btn btn-ghost btn-xs text-error hover:bg-error/10"
      >
        Reiniciar todo el progreso
      </button>
    </div>
  );
}
