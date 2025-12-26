import React from 'react';

// 1. Exportamos la interfaz para poder usarla en otros archivos
export interface SliderItem {
  id: number;
  src: string;
  alt: string;
  url: string;
}

// 2. Definimos las props del componente
interface SliderProps {
  items: SliderItem[];
}

export default function ImagenSlider({ items = [] }: SliderProps) {
  return (
    <div className="carousel carousel-center rounded-box space-x-4 p-4 bg-neutral">
      {items.map((slide) => (
        <div key={slide.id} className="carousel-item">
          <a 
            href={slide.url} 
            target="_blank"  // <-- Descomenta si quieres que abra en otra pestaña
            // rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <img
              src={slide.src}
              alt={slide.alt || "Imagen slider"}
              className="rounded-box h-64 w-96 object-cover" 
            />
          </a>
        </div>
      ))}
    </div>
  );
}
