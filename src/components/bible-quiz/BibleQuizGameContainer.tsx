"use client";

import React, { useState } from "react";
import { QuizModule } from "@/data/bible-quiz-modules";
import { saveBibleQuizProgress } from "@/app/actions/bibleQuizActions";
import BibleQuizComponent from "./BibleQuizComponent"; 
import PentateuchOrderGame from "./games/PentateuchOrderGame";

// Importamos los bancos de preguntas
import { genesisQuestions } from "@/data/genesis-questions";
import { exodusQuestions } from "@/data/exodus-questions";
import { leviticusQuestions } from "@/data/leviticus-questions";
import { numbersQuestions } from "@/data/numbers-questions";
import { deuteronomyQuestions } from "@/data/deuteronomy-questions";
import { pentateuchHardQuestions } from "@/data/pentateuch-hard-questions";
import { abrahamQuestions } from "@/data/abraham-questions";
import { mosesQuestions } from "@/data/moses-questions";

type GameContainerProps = {
  moduleInfo: QuizModule;
  nextModuleInfo?: QuizModule | null;
  onBack: () => void;
  onFinish: () => void;
  onNext?: () => void;
};

export default function BibleQuizGameContainer({ moduleInfo, nextModuleInfo, onBack, onFinish, onNext }: GameContainerProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [savedResult, setSavedResult] = useState<{ score: number, passed: boolean } | null>(null);

  const handleGameEnd = async (score: number) => {
    setIsSaving(true);
    
    // Cálculo del porcentaje
    // Cada pregunta da 10 puntos (si es correcta)
    const maxScore = moduleInfo.totalQuestions * 10; 
    let passed = false;

    if (moduleInfo.id === "mod_1_pentateuch_order") {
        // En ordenar, el max score es 100
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
      setSavedResult({ score, passed }); 
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
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={onFinish} className="btn btn-outline btn-primary">Volver al Menú</button>
              {savedResult.passed && nextModuleInfo && onNext && (
                  <button onClick={onNext} className="btn btn-primary">Siguiente Módulo</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Selección dinámica de preguntas
  let questionsToUse: any[] = [];
  if (moduleInfo.id === "mod_2_genesis") questionsToUse = genesisQuestions;
  if (moduleInfo.id === "mod_3_exodus") questionsToUse = exodusQuestions;
  if (moduleInfo.id === "mod_4_leviticus") questionsToUse = leviticusQuestions;
  if (moduleInfo.id === "mod_5_numbers") questionsToUse = numbersQuestions;
  if (moduleInfo.id === "mod_6_deuteronomy") questionsToUse = deuteronomyQuestions;
  if (moduleInfo.id === "mod_7_pentateuch_hard") questionsToUse = pentateuchHardQuestions;
  if (moduleInfo.id === "mod_char_abraham") questionsToUse = abrahamQuestions;
  if (moduleInfo.id === "mod_char_moses") questionsToUse = mosesQuestions;

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
          {moduleInfo.id === "mod_1_pentateuch_order" && (
            <PentateuchOrderGame onComplete={handleGameEnd} />
          )}

          {moduleInfo.id.startsWith("mod_") && moduleInfo.id !== "mod_1_pentateuch_order" && questionsToUse.length > 0 && (
            <BibleQuizComponent 
              questions={questionsToUse} 
              onComplete={handleGameEnd} 
              isProMode={true} 
            />
          )}

          {moduleInfo.id !== "mod_1_pentateuch_order" && questionsToUse.length === 0 && (
             <div className="text-center p-10 bg-base-200 rounded-xl">
                 <h3 className="text-xl mb-4">Módulo en construcción...</h3>
                 <p className="opacity-70 mb-4">No hay preguntas cargadas para este módulo aún.</p>
                 <button onClick={() => handleGameEnd(100)} className="btn btn-warning">Forzar Victoria (Dev)</button>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
