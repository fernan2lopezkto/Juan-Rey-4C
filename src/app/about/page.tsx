import { aboutTexts } from "@/utils/texts";
import PrincipalFooter from "@/components/PrincipalFooter";

export default function About() {
    return (
        <div>
            <div
            className=" min-h-[80vh] text-center bg-center"
            style={{
            backgroundImage:"url('/fondoCrucesUno.jpg')",
            }}>
            <div className="bg-opacity-50 bg-black">
                {/* Titulo */}
                <h1 className="text-3xl text-secondary font-semibold my-4">
                {aboutTexts.preTitle}
                </h1>
                {/* parrafos del texto */}
                <div className="grid grid-cols-1 lg:grid-cols-3 text-secondary-content drop-shadow my-4 gap-2">
                    {aboutTexts.parrafos.map((parrafo) => (
                        <p key={parrafo} className="mt-1">{parrafo}</p>
                    ))}
                </div>
                </div>
            </div>
            <PrincipalFooter />
        </div>
    );
}
