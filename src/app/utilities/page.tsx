import FooterUno from "@/components/FooterUno";

export default function Utilities() {
    return (
        <div className="min-h-screen p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Utilidades</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="card w-full bg-base-100 shadow-xl image-full">
                    <figure><img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
                    <div className="card-body">
                        <h2 className="card-title">Utilidad 1</h2>
                        <p>Descripción de la utilidad 1.</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary">Usar</button>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="card w-full bg-primary text-primary-content">
                    <div className="card-body">
                        <h2 className="card-title">Calculadora</h2>
                        <p>Una calculadora simple.</p>
                        <div className="card-actions justify-end">
                            <button className="btn">Abrir</button>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="card w-full bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Convertidor</h2>
                        <p>Convertidor de unidades.</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-secondary">Ir</button>
                        </div>
                    </div>
                </div>

                {/* Mock Components */}
                <div className="mockup-code col-span-1 md:col-span-2 lg:col-span-3">
                    <pre data-prefix="$"><code>npm install daisyui</code></pre>
                    <pre data-prefix=">" className="text-warning"><code>installing...</code></pre>
                    <pre data-prefix=">" className="text-success"><code>Done!</code></pre>
                </div>

            </div>
            <FooterUno />
        </div>
    );
}
