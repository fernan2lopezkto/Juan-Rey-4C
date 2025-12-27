import PrincipalFooter from "@/components/PrincipalFooter";

import ImagenCarrusel from "@/components/ImagenCarrusel"
export default function Pruebas() {
   

    return (
        <div className="min-h-screen p-8 flex flex-col gap-8">
            <h1 className="text-5xl font-bold">
                Pruebas
            </h1>
            
            <section>
                <ImagenCarrusel />
            </section>

            <PrincipalFooter />
        </div>
    );
}
