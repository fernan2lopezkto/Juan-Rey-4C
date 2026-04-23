"use client";

import React, { useState } from "react";
import { bibleQuizModules } from "@/data/bible-quiz-modules";
import BibleQuizGameContainer from "./BibleQuizGameContainer";

export default function BibleQuizProDashboard({ initialProgress }: { initialProgress: any[] }) {
  const [mode, setMode] = useState<"menu" | "historia" | "libre" | "playing_historia" | "playing_libre">("menu");
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Mapa de progreso rápido y cálculo de global score
  const { progressMap, globalScore } = initialProgress.reduce((acc, curr) => {
    acc.progressMap[curr.moduleId] = curr;
    acc.globalScore += (curr.score || 0);
    return acc;
  }, { progressMap: {} as Record<string, any>, globalScore: 0 });

  const handleStartGame = (moduleId: string, isStory: boolean) => {
    setActiveModuleId(moduleId);
    setMode(isStory ? "playing_historia" : "playing_libre");
  };

  const handleFinishGame = () => {
    setMode("menu");
    setActiveModuleId(null);
    window.location.reload(); 
  };

  if ((mode === "playing_historia" || mode === "playing_libre") && activeModuleId) {
    const moduleInfo = bibleQuizModules.find(m => m.id === activeModuleId);
    
    let nextModuleInfo = null;
    if (mode === "playing_historia") {
      const currentIndex = bibleQuizModules.findIndex(m => m.id === activeModuleId);
      if (currentIndex !== -1 && currentIndex + 1 < bibleQuizModules.length) {
        nextModuleInfo = bibleQuizModules[currentIndex + 1];
      }
    }

    return (
      <BibleQuizGameContainer 
        moduleInfo={moduleInfo!} 
        nextModuleInfo={nextModuleInfo}
        onBack={() => setMode(mode === "playing_historia" ? "historia" : "libre")}
        onFinish={handleFinishGame}
        onNext={() => nextModuleInfo ? handleStartGame(nextModuleInfo.id, true) : handleFinishGame()}
      />
    );
  }  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold font-serif mb-4 text-primary">Bible Quiz Pro</h1>
        <p className="text-lg opacity-80 mb-4">Elige tu modo de juego</p>
        <div className="inline-block bg-base-200 px-6 py-3 rounded-full border border-primary/30">
          <span className="font-bold">Score Global: </span>
          <span className="text-2xl text-primary font-black ml-2">{globalScore} pts</span>
        </div>
      </div>

      {mode === "menu" && (
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="card w-full md:w-96 bg-base-100 shadow-xl border border-primary">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-3xl mb-2">Modo Historia</h2>
              <p>Juega los módulos en orden. Supera un módulo para desbloquear el siguiente.</p>
              <div className="card-actions mt-4">
                <button onClick={() => setMode("historia")} className="btn btn-primary btn-wide">
                  Entrar
                </button>
              </div>
            </div>
          </div>

          <div className="card w-full md:w-96 bg-base-100 shadow-xl border border-secondary">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-3xl mb-2">Modo Libre</h2>
              <p>Juega cualquier módulo que ya hayas superado en el Modo Historia libremente.</p>
              <div className="card-actions mt-4">
                <button onClick={() => setMode("libre")} className="btn btn-secondary btn-wide">
                  Entrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === "historia" && (
        <div>
          <button onClick={() => setMode("menu")} className="btn btn-ghost mb-4">← Volver</button>
          <h2 className="text-3xl font-bold mb-6">Modo Historia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bibleQuizModules.map((mod, index) => {
              // Verifica si los requisitos se cumplen
              let isLocked = false;
              if (mod.requirements && mod.requirements.length > 0) {
                isLocked = !mod.requirements.every(reqId => progressMap[reqId]?.passed);
              }
              // El primero siempre desbloqueado, a menos que isAvailable sea falso globalmente
              if (!mod.isAvailable) isLocked = true;

              const isCompleted = progressMap[mod.id]?.passed;
              const highScore = progressMap[mod.id]?.score || 0;

              return (
                <div key={mod.id} className={`card shadow-lg border ${isLocked ? "bg-base-200 opacity-70" : "bg-base-100"}`}>
                  <div className="card-body">
                    <h3 className="card-title">{mod.title}</h3>
                    <p className="text-sm opacity-80">{mod.description}</p>
                    
                    <div className="mt-2 text-sm font-semibold">
                      Mejor Puntaje: <span className="text-primary">{highScore}</span>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      {isCompleted ? (
                        <span className="badge badge-success gap-1">Completado ✓</span>
                      ) : (
                        <span className="badge badge-ghost">Pendiente</span>
                      )}
                      
                      {isLocked ? (
                        <button className="btn btn-sm btn-disabled" disabled>Bloqueado 🔒</button>
                      ) : (
                        <button onClick={() => handleStartGame(mod.id, true)} className="btn btn-sm btn-primary">
                          Jugar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mode === "libre" && (
        <div>
          <button onClick={() => setMode("menu")} className="btn btn-ghost mb-4">← Volver</button>
          <h2 className="text-3xl font-bold mb-6">Modo Libre</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bibleQuizModules.filter(mod => progressMap[mod.id]?.passed).length === 0 ? (
              <p className="opacity-70 col-span-full">No has desbloqueado ningún módulo aún. Juega el Modo Historia primero.</p>
            ) : (
              bibleQuizModules.map(mod => {
                if (!progressMap[mod.id]?.passed) return null;
                const highScore = progressMap[mod.id]?.score || 0;
                return (
                  <div key={mod.id} className="card bg-base-100 shadow-lg border border-secondary">
                    <div className="card-body">
                      <h3 className="card-title">{mod.title}</h3>
                      <p className="text-sm opacity-80">{mod.description}</p>
                      <div className="mt-2 text-sm font-semibold">
                        Mejor Puntaje: <span className="text-primary">{highScore}</span>
                      </div>
                      <div className="mt-4 card-actions justify-end">
                        <button onClick={() => handleStartGame(mod.id, false)} className="btn btn-sm btn-secondary">
                          Jugar Libre
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
