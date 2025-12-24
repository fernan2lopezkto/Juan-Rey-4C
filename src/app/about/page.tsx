import { aboutTexts } from "@/utils/texts";
import PrincipalFooter from "@/components/PrincipalFooter";

export default function About() {
    return (
        <div>
            <div
            className="bg-opacity-50 min-h-[80vh] text-center bg-center"
            style={{
            backgroundImage:"url('/fondoCrucesUno.jpg')",
            }}>
                {/* Titulo */}
                <h1 className="text-3xl text-secondary font-semibold my-8">
                {aboutTexts.preTitle}
                </h1>
                {/* parrafos del texto */}
                <div className="grid grid-cols-1 lg:grid-cols-3 text-secondary-content my-4 gap-2">
                    {aboutTexts.parrafos.map((parrafo) => (
                        <p key={parrafo} className="mt-1 drop-shadow">{parrafo}</p>
                    ))}
                </div>
            </div>
            <PrincipalFooter />
        </div>
    );
}
