import BqSPABasic from "@/components/spaPilotos/BqSPABasic"

import FilterButton from "@/components/FilterButton";
import ImagenCarrusel from "@/components/ImagenCarrusel"

import PrincipalFooter from "@/components/PrincipalFooter";

import ImagenSlider, { SliderItem } from "@/components/ImagenSlider"; 

export default function Utilities() {
      const misImagenes = [
    { id: 1, src: "/ytfimagens/capturaFilter1.jpg", alt: "Filtro 1" },
    { id: 2, src: "/ytfimagens/capturaFilter2.jpg", alt: "Filtro 2" },
    { id: 3, src: "/ytfimagens/capturaFilter3.jpg", alt: "Filtro 3" },
    { id: 4, src: "/ytfimagens/capturaFilter4.jpg", alt: "Filtro 4" },
    // ... más imágenes
  ];   
    return (
        <div className="min-h-screen p-8 flex flex-col gap-8">
            
            <h1 className="text-5xl font-bold">Utilidades</h1>
            <BqSPABasic />
            <div className="divider"></div>
            <FilterButton />
            <ImagenCarrusel
                titulo="imagenes" 
                imagenes={misImagenes}/>
            <PrincipalFooter />
            
        </div>
    );
}
