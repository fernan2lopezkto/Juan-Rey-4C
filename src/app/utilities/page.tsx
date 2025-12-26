// import Slider from "@/components/Slider";
import PrincipalFooter from "@/components/PrincipalFooter";

import Slider, { SliderItem } from "@/components/Slider"; 

export default function Utilities() {
   
 const promoImages: SliderItem[] = [
    // 1. Objeto estilo Card (Tu filtro de YouTube)
  
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
        <div className="min-h-screen p-8 flex flex-col gap-8">
            <h1 className="text-5xl font-bold">
                Utilidades
            </h1>
            
            <section>
                {/* 3. Ahora la prop 'items' recibirá los datos sin errores de compilación */}
                <Slider items={promoImages} />
            </section>

            <PrincipalFooter />
        </div>
    );
}
