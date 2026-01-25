'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import PrincipalFooter from '@/components/PrincipalFooter';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Opcionalmente, puedes registrar el error en un servicio de monitoreo
        console.error('Error capturado:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Contenido principal centrado */}
            <div className="flex-grow flex items-center justify-center px-4">
                <div className="text-center space-y-6 max-w-2xl">
                    {/* Icono de error */}
                    <div className="text-9xl">⚠️</div>

                    {/* Mensaje principal */}
                    <h2 className="text-4xl font-bold text-error">
                        ¡Algo salió mal!
                    </h2>

                    {/* Descripción */}
                    <p className="text-lg text-base-content/70">
                        Ha ocurrido un error inesperado. No te preocupes, estamos trabajando para solucionarlo.
                    </p>

                    {/* Detalles del error (solo en desarrollo) */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="bg-base-200 p-4 rounded-lg text-left">
                            <p className="font-mono text-sm text-error break-all">
                                {error.message}
                            </p>
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex gap-4 justify-center pt-4">
                        <button
                            onClick={reset}
                            className="btn btn-primary btn-lg"
                        >
                            Intentar de Nuevo
                        </button>

                        <Link
                            href="/"
                            className="btn btn-outline btn-lg"
                        >
                            Volver al Inicio
                        </Link>
                    </div>

                    {/* Información adicional */}
                    <div className="pt-8">
                        <p className="text-sm text-base-content/60">
                            Si el problema persiste, por favor contacta con soporte.
                        </p>
                        {error.digest && (
                            <p className="text-xs text-base-content/40 pt-2">
                                ID de Error: {error.digest}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <PrincipalFooter />
        </div>
    );
}
