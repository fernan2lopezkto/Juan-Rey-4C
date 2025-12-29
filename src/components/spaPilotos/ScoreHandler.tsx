"use client";
import React, { useEffect, useState } from 'react';

type ScoreHandlerProps = {
  score: number;
  lastResult: 'correct' | 'incorrect' | null; // Para saber qué toast mostrar
};

export default function ScoreHandler({ score, lastResult }: ScoreHandlerProps) {
  const [showToast, setShowToast] = useState(false);

  // Efecto para mostrar el toast por 2 segundos cuando cambia el resultado
  useEffect(() => {
    if (lastResult) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastResult, score]); // Se dispara cuando cambia el resultado o el score

  return (
    <>
      {/* Visualizador de Puntos Fijo (Sticky o en tarjeta) */}
      <div className="stats shadow bg-base-200 w-full mb-4">
        <div className="stat place-items-center">
          <div className="stat-title">Puntuación Actual</div>
          <div className={`stat-value transition-all duration-300 ${lastResult === 'correct' ? 'text-success scale-110' : lastResult === 'incorrect' ? 'text-error' : 'text-primary'}`}>
            {score}
          </div>
          <div className="stat-desc">Puntos acumulados</div>
        </div>
      </div>

      {/* TOAST de DaisyUI (Notificaciones) */}
      {showToast && (
        <div className="toast toast-top toast-end z-50">
          {lastResult === 'correct' ? (
            <div className="alert alert-success shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>¡Correcto! +10 Puntos</span>
            </div>
          ) : (
            <div className="alert alert-error shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Incorrecto... -5 Puntos</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
