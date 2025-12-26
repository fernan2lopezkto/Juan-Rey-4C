//import Slider from "@/components/Slider";⇝
import PrincipalHero from "@/components/PrincipalHero";
import FilterButton from "@/components/FilterButton";
import PrincipalFooter from "@/components/PrincipalFooter";
// 1. Asegúrate de importar la interfaz SliderItem desde tu componente
import Slider, { SliderItem } from "@/components/Slider"; 


export default function Home() {
  
 const promoImages: SliderItem[] = [
    // 1. Objeto estilo Card (Tu filtro de YouTube)
    {
      id: 1,
      src: "https://placehold.co/600x400/FF0000/FFFFFF/png?text=YouTube+Filter", // La imagen placeholder
      alt: "Filtro YouTube",
      url: "/youtube-filter", // La ruta a la que quieres ir
      title: "Canal de YouTube",
      description: "Mira nuestros últimos videos filtrados."
    },
    // 2. Objeto estilo Imagen simple (sin título)
    {
      id: 2,
      src: "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
      alt: "Solo Imagen",
      url: "/nuevo"
      // Al no poner title ni description, se verá como imagen completa
    }
  ];
  
  return (
    
    <div>
      <PrincipalHero />
      <FilterButton />
      <div className="px-6">
        {/* Pasamos el objeto mediante la prop 'items' */}
        <Slider items={promoImages} />
      </div>
      <div>
        <PrincipalFooter />
      </div>
      
    </div>

  );
}
