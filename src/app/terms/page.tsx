export default function TermsPage() {
    return (
        <div className="container mx-auto p-10 max-w-4xl text-base-content">
            <h1 className="text-4xl font-bold mb-6 text-primary">Términos y Condiciones de Uso</h1>
            <p className="mb-4 opacity-70">Última actualización: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">1. Aceptación de los Términos</h2>
                <p className="leading-relaxed">Al acceder y utilizar YouTube Filter (en adelante, "la Aplicación"), usted acepta estar sujeto a estos Términos y Condiciones de Uso, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">2. Uso de la Autorización de YouTube/Google</h2>
                <p className="leading-relaxed">La Aplicación interactúa con los servicios de YouTube a través de la API oficial de Google. El registro se realiza empleando su cuenta de Google de forma segura con OAuth. Usted autoriza a la Aplicación a realizar búsquedas en su nombre y acceder a su información básica de perfil de acuerdo a nuestras Políticas de Privacidad.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">3. Uso Aceptable</h2>
                <p className="leading-relaxed">Usted se compromete a no utilizar el filtrado de contenido para propósitos ilegales o que violen los derechos de terceros. El usuario comprende que el filtrado es de uso personal y automatizado para ocultar videos no deseados en la plataforma.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">4. Limitación de Responsabilidad</h2>
                <p className="leading-relaxed">La Aplicación se proporciona "tal cual". En ningún caso seremos responsables de los daños (incluyendo, sin limitación, daños por pérdida de datos o beneficios, o interrupción del negocio) que surjan de su uso de la plataforma o de las búsquedas indirectas en YouTube.</p>
            </section>
        </div>
    );
}
