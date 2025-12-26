// Le pasamos 'items' como prop (desestructuración)
export default function Slider({ items = [] }) {
  return (
    <div className="carousel carousel-center rounded-box space-x-4 p-4 bg-neutral">
      {items.map((slide, index) => (
        <div key={slide.id || index} className="carousel-item">
          <a 
            href={slide.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <img
              src={slide.src}
              alt={slide.alt || "Imagen de slider"}
              className="rounded-box h-64 w-96 object-cover" 
            />
          </a>
        </div>
      ))}
    </div>
  );
}
