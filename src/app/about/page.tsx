import { aboutTexts } from "@/utils/texts";
import PrincipalFooter from "@/components/PrincipalFooter";

export default function About() {
    return (
        <div>
            {/* Contenedor Principal con Imagen esta es la que quiero que tenga la transparencia pero los textros no */}
            <div className=" min-h-[80vh] bg-center bg-cover opacity-30" style={{backgroundImage: "url('/fondoCrucesUno.jpg')",}}>
                
                <div className="text-center flex-col p-8">
                    
                    {/* Titulo */}
                    <h1 className="text-4xl font-bold mb-8">
                        {aboutTexts.preTitle}
                    </h1>

                    {/* Contenedor de párrafos */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            <PrincipalFooter />
        </div>
    );
}
