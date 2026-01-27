"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPlaceholder({ message = "Debes loguearte para usar estas funciones." }: { message?: string }) {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
            <div className="alert alert-warning max-w-md shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>{message}</span>
            </div>
            {/* Ahora redirige a tu nueva página de login con ambas opciones */}
            <button className="btn btn-primary" onClick={() => router.push('/auth/login')}>
                Ir a Iniciar Sesión
            </button>
        </div>
    );
}
