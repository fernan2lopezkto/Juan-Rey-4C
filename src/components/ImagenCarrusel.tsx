import React from 'react';

// 1. Definimos la Interface para el objeto de imagen
interface CarouselImage {
  id: number;
  src: string;
  alt?: string; // El alt es opcional pero recomendado por accesibilidad
}

const ImagenCarrusel: React.FC = () => {
  // 2. Creamos el objeto (array) con toda la información
  const imagenes: CarouselImage[] = [
    { id: 1, src: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp", alt: "Imagen 1" },
    { id: 2, src: "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp", alt: "Imagen 2" },
    { id: 3, src: "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp", alt: "Imagen 3" },
    { id: 4, src: "https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp", alt: "Imagen 4" },
    { id: 5, src: "https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp", alt: "Imagen 5" },
    { id: 6, src: "https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp", alt: "Imagen 6" },
    { id: 7, src: "https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp", alt: "Imagen 7" },
  ];

  return (
    <div className="carousel rounded-box w-96">
      {/* 3. Mapeamos el objeto para renderizar los items */}
      {imagenes.map((imagen) => (
        <div key={imagen.id} className="carousel-item w-1/2">
          <img
            src={imagen.src}
            alt={imagen.alt || "Carousel Item"}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
};

export default ImagenCarrusel;
