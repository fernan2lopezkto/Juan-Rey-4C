import Slider from "@/components/Slider"
import PrincipalFooter from "@/components/PrincipalFooter";
import FooterUno from "@/components/FooterUno";

export default function Utilities() {
   
     // Objeto de datos para este caso específico (ej. Promociones)
  const promoImages = [
    {
      id: 1,
      src: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp",
      alt: "Promo Verano",
      url: "/home"
    },
    {
      id: 2,
      src: "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
      alt: "Nuevo Lanzamiento",
      url: "/About"
    }
  ];
   
    return (
        <div className="min-h-screen p-8">
            <h1 className="text-5xl my-4">
                Utilidades
            </h1>
            {/* Pasamos el objeto mediante la prop 'items' */}
      <Slider items={promoImages} />
            <PrincipalFooter />
        </div>
    );
}
