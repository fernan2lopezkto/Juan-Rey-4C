"use client";

import React, { useState, useEffect } from 'react';

const DEFAULT_ITEMS = ["Génesis", "Éxodo", "Levítico", "Números", "Deuteronomio"];

type OrderingGameProps = {
  items?: string[];
  title?: string;
  description?: string;
  onComplete: (score: number) => void;
};

export default function PentateuchOrderGame({ 
  items = DEFAULT_ITEMS, 
  title = "Ordena los libros del Pentateuco", 
  description = "Selecciona los libros en su orden correcto.", 
  onComplete 
}: OrderingGameProps) {
  const [availableBooks, setAvailableBooks] = useState<string[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);

  // Inicializar y mezclar elementos cuando cambien
  useEffect(() => {
    setAvailableBooks([...items].sort(() => Math.random() - 0.5));
    setSelectedBooks([]);
    setMistakes(0);
  }, [items]);

  const handleSelect = (book: string) => {
    // Si elige el correcto en orden
    const expectedBook = items[selectedBooks.length];
    
    if (book === expectedBook) {
      const newSelected = [...selectedBooks, book];
      setSelectedBooks(newSelected);
      setAvailableBooks(prev => prev.filter(b => b !== book));
      
      // Si completó todos
      if (newSelected.length === items.length) {
        // Calcular score final (100 - (mistakes * (100 / total_items)))
        const penalty = Math.max(10, Math.round(100 / items.length));
        const finalScore = Math.max(0, 100 - (mistakes * penalty));
        setTimeout(() => {
          onComplete(finalScore);
        }, 1000);
      }
    } else {
      // Error
      setMistakes(prev => prev + 1);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl border p-6 text-center">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="opacity-70 mb-6">{description}</p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Libros Disponibles */}
        <div className="flex-1">
          <h4 className="font-bold mb-4">Disponibles</h4>
          <div className="flex flex-wrap md:flex-col justify-center gap-2">
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
              <p className="text-success font-bold mt-4 w-full">¡Todos seleccionados!</p>
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
