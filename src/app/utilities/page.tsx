import Slider from "@/components/Slider";
import PrincipalFooter from "@/components/PrincipalFooter";



export default function Utilities() {
   
    // Objeto de datos para este caso específico (ej. Promociones)
    // 2. AÑADE EL TIPO ': SliderItem[]' AQUÍ
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
