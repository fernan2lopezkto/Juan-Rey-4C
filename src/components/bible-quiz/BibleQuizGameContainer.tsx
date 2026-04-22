"use client";

import React, { useState } from "react";
import { QuizModule } from "@/data/bible-quiz-modules";
import { saveBibleQuizProgress } from "@/app/actions/bibleQuizActions";
import BibleQuizComponent from "./BibleQuizComponent"; // Refactorizado o reutilizado
import PentateuchOrderGame from "./games/PentateuchOrderGame";

// Aquí importaríamos los diferentes bancos de preguntas
import { bibleQuestions } from "@/data/bible-questions"; // mock temporal

type GameContainerProps = {
  moduleInfo: QuizModule;
  onBack: () => void;
  onFinish: () => void;
};

export default function BibleQuizGameContainer({ moduleInfo, onBack, onFinish }: GameContainerProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [savedResult, setSavedResult] = useState<{ score: number, passed: boolean } | null>(null);

  const handleGameEnd = async (score: number) => {
    setIsSaving(true);
    
    // Cálculo del 60%
    // Depende del módulo, por ejemplo un quiz de 100 preguntas -> cada pregunta vale 1 punto? 
    // Si `BibleQuizComponent` da 10 puntos por pregunta, necesitamos saber el máximo.
    // Para simplificar, pasamos el score bruto y calculamos el porcentaje.
    // Asumiremos que el maxScore es totalQuestions * 10 (si cada una da 10).
    const maxScore = moduleInfo.totalQuestions * 10; 
    let passed = false;

    if (moduleInfo.id === "mod_1_pentateuch_order") {
        // En ordenar, el score será 100 si lo hace bien
        passed = score >= 60; 
    } else {
        const percentage = (score / maxScore) * 100;
        passed = percentage >= 60;
    }

    const res = await saveBibleQuizProgress(moduleInfo.id, score, passed);
    setIsSaving(false);
    
    if (res.success) {
      setSavedResult({ score, passed });
    } else {
      alert("Hubo un error al guardar tu progreso.");
      setSavedResult({ score, passed }); // Mostrar igual para no bloquear
    }
  };

  if (savedResult) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center">
        <div className="card bg-base-100 shadow-xl border">
          <div className="card-body">
            <h2 className="text-3xl font-bold mb-4">Resultado</h2>
            <div className={`text-5xl font-black mb-4 ${savedResult.passed ? 'text-success' : 'text-error'}`}>
              {savedResult.score} pts
            </div>
            {savedResult.passed ? (
              <div>
                <p className="text-lg text-success mb-4">¡Felicidades! Has superado este módulo.</p>
                <p>Ahora está disponible en el Modo Libre.</p>
              </div>
            ) : (
              <div>
                <p className="text-lg text-error mb-4">No has alcanzado el 60% necesario para aprobar.</p>
                <p>Sigue intentándolo.</p>
              </div>
            )}
            <div className="mt-6">
              <button onClick={onFinish} className="btn btn-primary">Volver al Menú</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="btn btn-ghost">← Salir</button>
        <h2 className="text-2xl font-bold">{moduleInfo.title}</h2>
        <div className="w-20"></div> {/* Spacer para centrar título */}
      </div>

      {isSaving ? (
        <div className="text-center py-20 flex flex-col items-center">
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p>Guardando resultados...</p>
        </div>
      ) : (
        <div className="w-full">
          {/* Renderizado dinámico según el módulo */}
          {moduleInfo.id === "mod_1_pentateuch_order" && (
            <PentateuchOrderGame onComplete={handleGameEnd} />
          )}

          {moduleInfo.id.startsWith("mod_2") && (
            // Reutilizamos el BibleQuizComponent pero sin LocalStorage (o con un flag para no usarlo)
            <BibleQuizComponent 
              questions={bibleQuestions} // Aquí irían las 100 de Génesis
              onComplete={handleGameEnd} 
              isProMode={true} 
            />
          )}

          {/* ... otros módulos */}
          {moduleInfo.id !== "mod_1_pentateuch_order" && !moduleInfo.id.startsWith("mod_2") && (
             <div className="text-center p-10 bg-base-200 rounded-xl">
                 <h3 className="text-xl">Módulo en construcción...</h3>
                 <button onClick={() => handleGameEnd(100)} className="btn btn-warning mt-4">Forzar Victoria (Dev)</button>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
