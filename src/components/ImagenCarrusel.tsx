import React from 'react';

interface CarouselImage {
  id: number;
  src: string;
  alt?: string;
}

const ImagenCarrusel: React.FC = () => {
  const imagenes: CarouselImage[] = [
    { id: 1, src: "/ytfimagens/capturaFilter1.jpg", alt: "captura" },
    { id: 2, src: "/ytfimagens/capturaFilter2.jpg", alt: "captura" },
    { id: 3, src: "/ytfimagens/capturaFilter3.jpg", alt: "captura" },
    { id: 4, src: "/ytfimagens/capturaFilter4.jpg", alt: "captura" },
  ];

  return (
    /* flex-col pone el título arriba y el carrusel abajo */
    <div className="flex flex-col items-center w-full p-4 gap-6">
      
      <h1 className="text-5xl font-bold text-center">
        Título
      </h1>

      <div className="carousel carousel-center rounded-box max-w-md space-x-4 p-4 bg-neutral">
        {imagenes.map((imagen) => (
          <div key={imagen.id} className="carousel-item w-1/2">
            <img
              src={imagen.src}
              alt={imagen.alt}
              className="rounded-box object-cover w-full"
            />
          </div>
        ))}
      </div>

    </div>
  );
};

export default ImagenCarrusel;
