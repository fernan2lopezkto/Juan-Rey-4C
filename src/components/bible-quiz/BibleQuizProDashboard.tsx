"use client";

import React, { useState } from "react";
import { bibleQuizModules } from "@/data/bible-quiz-modules";
import BibleQuizGameContainer from "./BibleQuizGameContainer";

export default function BibleQuizProDashboard({ initialProgress }: { initialProgress: any[] }) {
  const [mode, setMode] = useState<"menu" | "historia" | "libre" | "playing">("menu");
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Mapa de progreso rápido
  const progressMap = initialProgress.reduce((acc, curr) => {
    acc[curr.moduleId] = curr;
    return acc;
  }, {} as Record<string, any>);

  const handleStartGame = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setMode("playing");
  };

  const handleFinishGame = () => {
    setMode("menu");
    setActiveModuleId(null);
    // Idealmente, aquí forzaríamos un re-fetch del progreso o actualizaríamos el estado local.
    // Para simplificar, asumimos recarga en producción o manejo local.
    window.location.reload(); 
  };

  if (mode === "playing" && activeModuleId) {
    const moduleInfo = bibleQuizModules.find(m => m.id === activeModuleId);
    return (
      <BibleQuizGameContainer 
        moduleInfo={moduleInfo!} 
        onBack={() => setMode("menu")}
        onFinish={handleFinishGame}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold font-serif mb-4 text-primary">Bible Quiz Pro</h1>
        <p className="text-lg opacity-80">Elige tu modo de juego</p>
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

              return (
                <div key={mod.id} className={`card shadow-lg border ${isLocked ? "bg-base-200 opacity-70" : "bg-base-100"}`}>
                  <div className="card-body">
                    <h3 className="card-title">{mod.title}</h3>
                    <p className="text-sm opacity-80">{mod.description}</p>
                    
                    <div className="mt-4 flex justify-between items-center">
                      {isCompleted ? (
                        <span className="badge badge-success gap-1">Completado ✓</span>
                      ) : (
                        <span className="badge badge-ghost">Pendiente</span>
                      )}
                      
                      {isLocked ? (
                        <button className="btn btn-sm btn-disabled" disabled>Bloqueado 🔒</button>
                      ) : (
                        <button onClick={() => handleStartGame(mod.id)} className="btn btn-sm btn-primary">
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
                return (
                  <div key={mod.id} className="card bg-base-100 shadow-lg border border-secondary">
                    <div className="card-body">
                      <h3 className="card-title">{mod.title}</h3>
                      <p className="text-sm opacity-80">{mod.description}</p>
                      <div className="mt-4 card-actions justify-end">
                        <button onClick={() => handleStartGame(mod.id)} className="btn btn-sm btn-secondary">
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
