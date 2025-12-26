
import Slider from "@/components/Slider"
import PrincipalHero from "@/components/PrincipalHero";
import FilterButton from "@/components/FilterButton";
import PrincipalFooter from "@/components/PrincipalFooter";

export default function Home() {
  
    // Objeto de datos para este caso específico (ej. Promociones)
  const promoImages = [
    {
      id: 1,
      src: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp",
      alt: "Promo Verano",
      url: "/about"
    },
    {
      id: 2,
      src: "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
      alt: "Nuevo Lanzamiento",
      url: "/nuevo"
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
