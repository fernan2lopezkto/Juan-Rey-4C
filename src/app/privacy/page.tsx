export default function PrivacyPage() {
    return (
        <div className="container mx-auto p-10 max-w-4xl text-base-content">
            <h1 className="text-4xl font-bold mb-6 text-primary">Políticas de Privacidad</h1>
            <p className="mb-4 opacity-70">Última actualización: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">1. Información que Recopilamos</h2>
                <p className="leading-relaxed">Al iniciar sesión utilizando su cuenta de Google, recopilamos la siguiente información personal, estrictamente necesaria para el funcionamiento de la plataforma:</p>
                <ul className="list-disc ml-6 mt-2 space-y-2">
                    <li>Nombre y Apellido proporcionado por Google.</li>
                    <li>Dirección de Correo Electrónico.</li>
                    <li>Foto de perfil de su cuenta de Google.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">2. Uso de la Información</h2>
                <p className="leading-relaxed">Los datos obtenidos son utilizados exclusivamente para: </p>
                <ul className="list-disc ml-6 mt-2 space-y-2">
                    <li>Crear y mantener su cuenta de usuario dentro de nuestra plataforma.</li>
                    <li>Permitir el guardado de su "Lista Negra" (Blacklist) de palabras a filtrar en las búsquedas.</li>
                    <li>Almacenar su historial de videos visualizados y filtrados en nuestros servidores, de forma que pueda sincronizar su experiencia de filtrado personalizado en distintos dispositivos.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">3. Permisos de YouTube (Google Data)</h2>
                <p className="leading-relaxed">Nuestra aplicación utiliza la API oficial de YouTube bajo los alcances genéricos limitados. <strong>NO</strong> solicitamos permisos restringidos para administrar su cuenta de YouTube ni para interactuar forzadamente con contenido (como añadir comentarios o alterar 'Me gustas'). El sistema solamente emplea su ingreso para validar su usuario y realizar operaciones seguras de filtrado puramente visual y administramos el historial localmente.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">4. Eliminación de Datos</h2>
                <p className="leading-relaxed">Usted puede solicitar la eliminación completa de su cuenta y de todo el historial de palabras y videos guardados en nuestra base de datos simplemente revocando el acceso desde su cuenta de Google en cualquier momento o contactándonos directamente.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">5. Protección de Datos</h2>
                <p className="leading-relaxed">Adoptamos medidas de seguridad para proteger contra el acceso no autorizado, alteración, divulgación o destrucción de su información personal e historial guardado de acuerdo a los estándares de la industria.</p>
            </section>
        </div>
    );
}
