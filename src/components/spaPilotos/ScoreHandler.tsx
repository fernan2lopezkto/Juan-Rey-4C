"use client";
import React, { useEffect, useState } from 'react';

type ScoreHandlerProps = {
  score: number;
  lastResult: 'correct' | 'incorrect' | null;
};

export default function ScoreHandler({ score, lastResult }: ScoreHandlerProps) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (lastResult !== null) {
      // Forzamos el reinicio del estado para que el Toast re-aparezca 
      // incluso si el resultado es el mismo que el anterior
      setShowToast(false);
      
      const timeoutId = setTimeout(() => {
        setShowToast(true);
      }, 10); // Un delay mínimo para que React detecte el cambio de estado

      const hideTimer = setTimeout(() => {
        setShowToast(false);
      }, 2500); // El mensaje dura 2.5 segundos

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(hideTimer);
      };
    }
  }, [lastResult, score]); // Se dispara siempre que cambie el resultado o el puntaje

  return (
    <>
      {/* Visualizador de Puntos */}
      <div className="stats shadow bg-base-300 w-full mb-4 border border-primary/10">
        <div className="stat place-items-center">
          <div className="stat-title text-sm uppercase tracking-widest">Puntos acumulados</div>
          <div className={`stat-value transition-all duration-300 ${
            lastResult === 'correct' ? 'text-success animate-bounce' : 
            lastResult === 'incorrect' ? 'text-error animate-shake' : 'text-primary'
          }`}>
            {score}
          </div>
        </div>
      </div>

      {/* TOAST - Corregida la posición para que no tape el Navbar */}
      {showToast && (
        <div className="toast toast-top toast-center z-[100] mt-16 sm:mt-20">
          {lastResult === 'correct' ? (
            <div className="alert alert-success shadow-2xl flex gap-2 items-center min-w-[280px]">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold text-white">¡Correcto! +10 Puntos</span>
            </div>
          ) : (
            <div className="alert alert-error shadow-2xl flex gap-2 items-center min-w-[280px]">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold text-white">Incorrecto... -5 Puntos</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
