import Slider from "@/components/Slider"
import PrincipalFooter from "@/components/PrincipalFooter";
import FooterUno from "@/components/FooterUno";

export default function Utilities() {
    return (
        <div className="min-h-screen p-8">
            <h1 className="text-5xl my-4">
                Utilidades
            </h1>
            <Slider />
            <PrincipalFooter />
        </div>
    );
}
