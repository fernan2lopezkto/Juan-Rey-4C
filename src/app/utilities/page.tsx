// import Slider from "@/components/Slider";
import PrincipalFooter from "@/components/PrincipalFooter";

import ImagenSlider, { SliderItem } from "@/components/ImagenSlider"; 

export default function Utilities() {
   
 const promoImages: SliderItem[] = [

    {
      id: 2,
      src: "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
      alt: "Solo Imagen",
      url: "/nuevo"
    }
  ];
    return (
        <div className="min-h-screen p-8 flex flex-col gap-8">
            <h1 className="text-5xl font-bold">
                Utilidades
            </h1>
            
            <section>
                {/* 3. Ahora la prop 'items' recibirá los datos sin errores de compilación */}
                <ImagenSlider items={promoImages} />
            </section>

            <PrincipalFooter />
        </div>
    );
}
