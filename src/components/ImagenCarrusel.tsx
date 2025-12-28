import React from 'react';

// Definimos la estructura de cada imagen
interface CarouselImage {
  id: number;
  src: string;
  alt?: string;
}

// Definimos qué props espera recibir este componente
interface ImagenCarruselProps {
  titulo: string;
  imagenes: CarouselImage[];
}

const ImagenCarrusel: React.FC<ImagenCarruselProps> = ({ titulo, imagenes }) => {
  return (
    <div className="flex flex-col items-center w-full p-4 gap-6">
      
      {/* El título ahora es dinámico */}
      <h1 className="text-5xl font-bold text-center">
        {titulo}
      </h1>

      <div className="carousel carousel-center rounded-box max-w-md space-x-4 p-4 bg-base-200">
        {imagenes.map((imagen) => (
          <div key={imagen.id} className="carousel-item w-1/2">
            <img
              src={imagen.src}
              alt={imagen.alt || "imagen de carrusel"}
              className="rounded-box object-cover w-full"
            />
          </div>
        ))}
      </div>

    </div>
  );
};

export default ImagenCarrusel;
