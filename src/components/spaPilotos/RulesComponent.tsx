import React from 'react';

export default function RulesComponent() {
  return (
    <div className="card w-full bg-base-100 shadow-xl border border-primary/20 mb-6">
      <div className="card-body">
        <h2 className="card-title text-primary">📜 Reglas del Juego</h2>
        <ul className="list-disc list-inside text-sm opacity-80 space-y-1">
          <li>Lee atentamente cada pregunta bíblica.</li>
          <li>Selecciona la respuesta que creas correcta.</li>
          <li>
            <span className="text-success font-bold">Correcto:</span> Sumas <span className="font-bold">+10 puntos</span>.
          </li>
          <li>
            <span className="text-error font-bold">Incorrecto:</span> Restas <span className="font-bold">-5 puntos</span>.
          </li>
          <li>Trata de llegar al final con la puntuación más alta posible.</li>
        </ul>
      </div>
    </div>
  );
}
