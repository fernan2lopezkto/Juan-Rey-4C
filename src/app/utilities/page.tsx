import Slider from "@/components/Slider";
import PrincipalFooter from "@/components/PrincipalFooter";

// 1. Definimos la interfaz aquí o la importamos si la exportaste desde Slider
interface SliderItem {
  id: number;
  src: string;
  alt: string;
  url: string;
}

export default function Utilities() {
   
  // 2. Le asignamos el tipo SliderItem[] al arreglo
  const promoImages: SliderItem[] = [
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
        <div className="min-h-screen p-8 flex flex-col gap-8">
            <h1 className="text-5xl font-bold">
                Utilidades
            </h1>
            
            <section>
                {/* 3. Ahora la prop 'items' recibirá los datos sin errores de compilación */}
                <Slider items={promoImages} />
            </section>

            <PrincipalFooter />
        </div>
    );
}
