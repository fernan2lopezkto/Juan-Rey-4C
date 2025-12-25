import { aboutTexts } from "@/utils/texts";
import PrincipalFooter from "@/components/PrincipalFooter";

export default function About() {
    return (
        <div>
            {/* Contenedor Principal con Imagen */}
            <div
                className="hero min-h-[80vh] bg-center bg-cover"
                style={{backgroundImage: "url('/fondoCrucesUno.jpg')",}}>
                {/* Overlay: Esta capa cubre todo el fondo y da la transparencia */}
                <div className="bg-black opacity-20"></div>

                {/* Contenido: Centrado gracias a las clases de DaisyUI */}
                <div className="hero-content text-center flex-col p-8">
                    
                    {/* Titulo */}
                    <h1 className="text-4xl text-secondary font-bold mb-8 drop-shadow-lg">
                        {aboutTexts.preTitle}
                    </h1>

                    {/* Contenedor de párrafos */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-white">
                        {aboutTexts.parrafos.map((parrafo, index) => (
                            <p 
                                key={index} 
                                className="bg-black/30 backdrop-blur-sm p-4 rounded-xl shadow-xl italic drop-shadow-md"
                            >
                                {parrafo}</p>
                        ))}
                    </div>

                </div>
            </div>
            <PrincipalFooter />
        </div>
    );
}
