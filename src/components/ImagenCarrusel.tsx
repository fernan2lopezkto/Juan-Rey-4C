import React from 'react';

interface CarouselImage {
  id: number;
  src: string;
  alt?: string;
}

const ImagenCarrusel: React.FC = () => {
  const imagenes: CarouselImage[] = [
    { id: 1, src: "/ytfimagens/capturafilter1.jpg", alt: "Cerezas" },
    { id: 2, src: "/ytfimagens/capturafilter2.jpg", alt: "Fresa" },
    { id: 3, src: "/ytfimagens/capturafilter3.jpg", alt: "Naranja" },
    { id: 4, src: "/ytfimagens/capturafilter4.jpg", alt: "Limón" },
    //{ id: 5, src: "https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp", alt: "Piña" },
  ];

  return (
    /* CAMBIO: Eliminamos w-96 y usamos max-w-full con un contenedor centrado */
    <div className="flex justify-center w-full p-4"> 
      <div className="carousel carousel-center rounded-box max-w-md space-x-4 bg-neutral">
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
