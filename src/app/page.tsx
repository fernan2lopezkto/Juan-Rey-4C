import ImagenCarrusel from "@/components/ImagenCarrusel"

import FormularioCancion from '@/components/libretaDeNotas/NoteForm';

import BqSPABasic from "@/components/spaPilotos/BqSPABasic"

import PrincipalHero from "@/components/PrincipalHero";
import FilterButton from "@/components/FilterButton";
import PrincipalFooter from "@/components/PrincipalFooter";

export default function Home() {
  
   const misImagenes = [
    { id: 1, src: "/ytfimagens/capturaFilter1.jpg", alt: "Filtro 1" },
    { id: 2, src: "/ytfimagens/capturaFilter2.jpg", alt: "Filtro 2" },
    { id: 3, src: "/ytfimagens/capturaFilter3.jpg", alt: "Filtro 3" },
    { id: 4, src: "/ytfimagens/capturaFilter4.jpg", alt: "Filtro 4" },
    // ... más imágenes
  ];   

  return (
    
    <div>
      
      <PrincipalHero />
      
      <FilterButton />
        <ImagenCarrusel
        titulo="imagenes" 
        imagenes={misImagenes}/>
      <BqSPABasic />
      <FormularioCancion />
      
      <PrincipalFooter />
      
    </div>

  );
}
