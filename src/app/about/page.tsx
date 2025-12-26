import { aboutTexts } from "@/utils/texts";
import PrincipalFooter from "@/components/PrincipalFooter";

export default function About() {
    return (
        <div>
            {/* Contenedor Principal con Imagen */}
            <div className="hero min-h-[80vh] bg-center bg-cover opacity-20" style={{backgroundImage: "url('/fondoCrucesUno.jpg')",}}>
                <div className="backdrop-blur-sm">
                <div className="hero-content text-center flex-col p-8">
                    
                    {/* Titulo */}
                    <h1 className="text-4xl text-secondary font-bold mb-8 drop-shadow-lg">
                        {aboutTexts.preTitle}
                    </h1>

                    {/* Contenedor de párrafos */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-secoundary-content">
                        {aboutTexts.parrafos.map((parrafo, index) => (
                            <p 
                                key={index} 
                                className="p-4  italic"
                            >
                                {parrafo}</p>
                        ))}
                    </div>
</div>
                </div>
            </div>
            <PrincipalFooter />
        </div>
    );
}
