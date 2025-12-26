import { aboutTexts } from "@/utils/texts";
import PrincipalFooter from "@/components/PrincipalFooter";

export default function About() {
    return (
        <div>
            {/* Contenedor Principal - Ahora es relative para contener el fondo */}
            <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
                
                {/* Capa de Fondo: Aquí aplicamos la imagen y la transparencia */}
                <div 
                    className="absolute inset-0 bg-center bg-cover opacity-30 -z-10" 
                    style={{backgroundImage: "url('/fondoCrucesUno.jpg')"}}
                ></div>

                {/* Capa de Contenido: Esta queda al 100% de opacidad */}
                <div className="relative z-10 text-center flex-col p-8">
                    
                    {/* Titulo */}
                    <h1 className="text-4xl font-bold mb-8 text-base-content">
                        {aboutTexts.preTitle}
                    </h1>

                    {/* Contenedor de párrafos */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {aboutTexts.parrafos.map((parrafo, index) => (
                            <p 
                                key={index} 
                                className="p-4 italic text-lg"
                            >
                                {parrafo}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
            <PrincipalFooter />
        </div>
    );
}
