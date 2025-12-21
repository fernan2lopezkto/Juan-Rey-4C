import FooterUno from "@/components/FooterUno";

export default function About() {
    return (
        <div className="min-h-screen bg-base-200 p-8">
            <div className="prose lg:prose-xl mx-auto">
                <h1>Acerca de Juan Rey</h1>
                <p>
                    Bienvenido a la página de acerca de. Aquí encontrarás información sobre mi trayectoria y habilidades.
                </p>

                <div className="card bg-base-100 shadow-xl my-8">
                    <div className="card-body">
                        <h2 className="card-title">Mi Perfil</h2>
                        <p>Soy un desarrollador apasionado por crear soluciones web innovadoras.</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary">Contactame</button>
                        </div>
                    </div>
                </div>

                <div className="stats shadow w-full">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="stat-title">Proyectos</div>
                        <div className="stat-value">31K</div>
                        <div className="stat-desc">Jan 1st - Feb 1st</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                        </div>
                        <div className="stat-title">Usuarios</div>
                        <div className="stat-value">4,200</div>
                        <div className="stat-desc">↗︎ 400 (22%)</div>
                    </div>
                </div>
            </div>
            <FooterUno />
        </div>
    );
}
