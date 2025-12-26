export default function Slider() {
  // 1. Definimos el arreglo de objetos con la configuración
  const slides = [
    {
      id: 1,
      src: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp",
      alt: "Pizza 1",
      url: "https://tu-enlace-1.com",
    },
    {
      id: 2,
      src: "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
      alt: "Pizza 2",
      url: "https://tu-enlace-2.com",
    },
    {
      id: 3,
      src: "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp",
      alt: "Pizza 3",
      url: "https://tu-enlace-3.com",
    },
    {
      id: 4,
      src: "https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp",
      alt: "Pizza 4",
      url: "https://tu-enlace-4.com",
    },
    // Puedes seguir agregando más objetos aquí fácilmente
  ];

  return (
    <div className="carousel carousel-center rounded-box space-x-4 p-4 bg-neutral">
      {slides.map((slide) => (
        <div key={slide.id} className="carousel-item">
          {/* 2. Envolvemos la imagen en un enlace <a> */}
          <a 
            href={slide.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105" // Opcional: efecto visual al pasar el mouse
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="rounded-box h-64 w-full object-cover"
            />
          </a>
        </div>
      ))}
    </div>
  );
}
