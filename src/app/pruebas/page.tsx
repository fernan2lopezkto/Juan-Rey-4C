import PrincipalFooter from "@/components/PrincipalFooter";

import BqSPAComponent from "@/components/spaPilotos/BqSPAComponent"

import ImagenCarrusel from "@/components/ImagenCarrusel"
export default function Pruebas() {

 const misImagenes = [
    { id: 1, src: "/ytfimagens/capturaFilter1.jpg", alt: "Filtro 1" },
    { id: 2, src: "/ytfimagens/capturaFilter2.jpg", alt: "Filtro 2" },
    { id: 3, src: "/ytfimagens/capturaFilter3.jpg", alt: "Filtro 3" },
    { id: 4, src: "/ytfimagens/capturaFilter4.jpg", alt: "Filtro 4" },
    // ... más imágenes
  ];   

    return (
        <div className="min-h-screen p-8 flex flex-col gap-8">
            <h1 className="text-5xl font-bold">
                Pruebas
            </h1>
            
            <BqSPAComponent />
            
            <section>
                <ImagenCarrusel
                    titulo="Mis Capturas" 
                    imagenes={misImagenes}/>
            </section>

            <PrincipalFooter />
        </div>
    );
}
