'use client';

import Link from 'next/link';
import PrincipalFooter from '@/components/PrincipalFooter';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Contenido principal centrado */}
            <div className="flex-grow flex items-center justify-center px-4">
                <div className="text-center space-y-6 max-w-2xl">
                    {/* Código de error grande */}
                    <h1 className="text-9xl font-bold text-primary animate-pulse">
                        404
                    </h1>

                    {/* Mensaje principal */}
                    <h2 className="text-4xl font-bold">
                        Página No Encontrada
                    </h2>

                    {/* Descripción */}
                    <p className="text-lg text-base-content/70">
                        Lo sentimos, la página que estás buscando no existe o ha sido movida.
                    </p>

                    {/* Botones de acción */}
                    <div className="flex gap-4 justify-center pt-4">
                        <Link
                            href="/"
                            className="btn btn-primary btn-lg"
                        >
                            Volver al Inicio
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="btn btn-outline btn-lg"
                        >
                            Página Anterior
                        </button>
                    </div>

                    {/* Sugerencias adicionales */}
                    <div className="pt-8">
                        <p className="text-sm text-base-content/60">
                            ¿Necesitas ayuda? Prueba estas opciones:
                        </p>
                        <div className="flex gap-4 justify-center pt-2">
                            <Link href="/about" className="link link-hover">
                                Sobre Nosotros
                            </Link>
                            <Link href="/utilities" className="link link-hover">
                                Utilidades
                            </Link>
                            <Link href="/youtube" className="link link-hover">
                                YouTube Filter
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <PrincipalFooter />
        </div>
    );
}
