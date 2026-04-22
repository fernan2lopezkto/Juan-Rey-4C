"use client";

import React, { useState } from 'react';

const CORRECT_ORDER = ["Génesis", "Éxodo", "Levítico", "Números", "Deuteronomio"];

export default function PentateuchOrderGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [availableBooks, setAvailableBooks] = useState<string[]>(
    [...CORRECT_ORDER].sort(() => Math.random() - 0.5)
  );
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);

  const handleSelect = (book: string) => {
    // Si elige el correcto en orden
    const expectedBook = CORRECT_ORDER[selectedBooks.length];
    
    if (book === expectedBook) {
      setSelectedBooks([...selectedBooks, book]);
      setAvailableBooks(availableBooks.filter(b => b !== book));
      
      // Si completó todos
      if (selectedBooks.length + 1 === CORRECT_ORDER.length) {
        // Calcular score final (100 - (mistakes * 20))
        const finalScore = Math.max(0, 100 - (mistakes * 20));
        setTimeout(() => {
          onComplete(finalScore);
        }, 1000);
      }
    } else {
      // Error
      setMistakes(prev => prev + 1);
      // Opcional: mostrar un toast de error
    }
  };

  const handleRemove = (book: string) => {
    // Para simplificar, permitiremos limpiar todo y empezar de nuevo si quieren
    // pero como obligamos a orden correcto, no debería necesitar remover.
  };

  return (
    <div className="card bg-base-100 shadow-xl border p-6 text-center">
      <h3 className="text-2xl font-bold mb-4">Ordena los libros del Pentateuco</h3>
      <p className="opacity-70 mb-6">Selecciona los libros en su orden correcto.</p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Libros Disponibles */}
        <div className="flex-1">
          <h4 className="font-bold mb-4">Disponibles</h4>
          <div className="flex flex-col gap-2">
            {availableBooks.map(book => (
              <button 
                key={book}
                onClick={() => handleSelect(book)}
                className="btn btn-outline"
              >
                {book}
              </button>
            ))}
            {availableBooks.length === 0 && (
              <p className="text-success font-bold mt-4">¡Todos seleccionados!</p>
            )}
          </div>
        </div>

        {/* Libros Seleccionados */}
        <div className="flex-1">
          <h4 className="font-bold mb-4">Tu Orden</h4>
          <div className="flex flex-col gap-2 min-h-[250px] p-4 bg-base-200 rounded-lg">
            {selectedBooks.map((book, idx) => (
              <div key={idx} className="badge badge-primary badge-lg w-full py-4 text-lg">
                {idx + 1}. {book}
              </div>
            ))}
            {selectedBooks.length === 0 && (
              <p className="opacity-50 mt-4">Selecciona un libro de la izquierda</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 text-sm opacity-70">
        Errores: {mistakes} (Cada error resta puntos)
      </div>
    </div>
  );
}
