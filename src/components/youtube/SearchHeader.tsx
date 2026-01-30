"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaGoogle } from 'react-icons/fa';
import { useSession, signIn } from 'next-auth/react';

export default function SearchHeader() {
    const [query, setQuery] = useState('');
    const router = useRouter();
    const { data: session, status } = useSession();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/youtube/search?q=${encodeURIComponent(query)}`);
        }
    };

    // Mientras se verifica la sesión, podemos mostrar un estado de carga sutil
    if (status === "loading") return <div className="h-20 animate-pulse bg-base-200 rounded-xl mb-6"></div>;

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
            // Mostrar invitación a conectar con Google
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <span className="text-sm opacity-70">Conéctate para buscar:</span>
                    <button 
                        onClick={() => signIn("google")}
                        className="btn btn-outline btn-error btn-sm gap-2"
                    >
                        <FaGoogle /> Conectar Google
                    </button>
                </div>
            <h1 
                className="text-2xl font-bold text-base-content flex items-center gap-2 cursor-pointer" 
                onClick={() => router.push('/youtube')}
            >
                <span className="text-error">You</span>Tube Filter
            </h1>

            {session ? (
                // SI HAY SESIÓN: Mostrar el buscador
                <form onSubmit={handleSearch} className="flex-1 max-w-2xl w-full flex gap-2">
                    <input
                        type="text"
                        className="input input-bordered w-full focus:input-primary"
                        placeholder="Buscar videos en YouTube..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type='submit' className="btn btn-primary">
                        <FaSearch />
                    </button>
                </form>
            ) : (
                // SI NO HAY SESIÓN: Mostrar invitación a conectar con Google
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <span className="text-sm opacity-70">Conéctate para buscar:</span>
                    <button 
                        onClick={() => signIn("google")}
                        className="btn btn-outline btn-error btn-sm gap-2"
                    >
                        <FaGoogle /> Conectar Google
                    </button>
                </div>
            )}
        </div>
    );
}
