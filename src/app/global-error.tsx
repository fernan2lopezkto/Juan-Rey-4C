'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Error global capturado:', error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center px-4 bg-base-100">
                    <div className="text-center space-y-6 max-w-2xl">
                        {/* Icono de error */}
                        <div className="text-9xl">💥</div>

                        {/* Mensaje principal */}
                        <h2 className="text-4xl font-bold text-error">
                            Error Crítico
                        </h2>

                        {/* Descripción */}
                        <p className="text-lg text-base-content/70">
                            Ha ocurrido un error crítico en la aplicación. Por favor, intenta recargar la página.
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
                                Reintentar
                            </button>

                            <Link
                                href="/"
                                className="btn btn-outline btn-lg"
                            >
                                Ir al Inicio
                            </Link>
                        </div>

                        {/* Información adicional */}
                        {error.digest && (
                            <p className="text-xs text-base-content/40 pt-4">
                                ID de Error: {error.digest}
                            </p>
                        )}
                    </div>
                </div>
            </body>
        </html>
    );
}
