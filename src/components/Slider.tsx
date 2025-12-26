import React from 'react';
import Link from 'next/link'; // Usamos Link de Next.js para navegación interna más rápida

export interface SliderItem {
  id: number;
  src: string;
  alt: string;
  url: string;
  title?: string;       // Nuevo: Opcional
  description?: string; // Nuevo: Opcional
}

interface SliderProps {
  items: SliderItem[];
}

export default function Slider({ items = [] }: SliderProps) {
  return (
    <div className="carousel carousel-center rounded-box space-x-4 p-4 bg-neutral">
      {items.map((slide) => (
        <div key={slide.id} className="carousel-item">
          {/* Usamos Link en lugar de <a> para rutas internas como /youtube */}
          <Link 
            href={slide.url} 
            className="card w-80 bg-base-100 shadow-xl hover:scale-105 transition-transform duration-300"
          >
            {/* Si tiene título, se ve como Card. Si no, se ve solo la imagen */}
            <figure className={slide.title ? "h-48" : "h-64"}>
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
            </figure>
            
            {/* Renderizado condicional: Solo muestra texto si existe el título */}
            {slide.title && (
              <div className="card-body p-4 bg-base-200">
                <h2 className="card-title text-sm font-bold">{slide.title}</h2>
                {slide.description && (
                  <p className="text-xs text-base-content/70">{slide.description}</p>
                )}
              </div>
            )}
          </Link>
        </div>
      ))}
    </div>
  );
}
