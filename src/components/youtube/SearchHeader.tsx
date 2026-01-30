"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaGoogle } from 'react-icons/fa';
import { useSession, signIn } from 'next-auth/react';

export default function SearchHeader() {
    const [query, setQuery] = useState('');
    const router = useRouter();
    const { data: session, status } = useSession();

    // @ts-ignore - Verificamos si el origen es Google
    const isGoogleAuth = session?.user?.provider === "google";

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/youtube/search?q=${encodeURIComponent(query)}`);
        }
    };

    if (status === "loading") {
        return <div className="h-20 animate-pulse bg-base-200 rounded-xl mb-6"></div>;
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
            <h1 
                className="text-2xl font-bold text-base-content flex items-center gap-2 cursor-pointer" 
                onClick={() => router.push('/youtube')}
            >
                <span className="text-error">You</span>Tube Filter
            </h1>

            {isGoogleAuth ? (
                // BUSCADOR ACTIVO: El usuario tiene cuenta vinculada a Google
                <form onSubmit={handleSearch} className="flex-1 max-w-2xl w-full flex gap-2">
                    <input
                        type="text"
                        className="input input-bordered w-full focus:input-primary"
                        placeholder="Search videos..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type='submit' className="btn btn-primary">
                        <FaSearch />
                    </button>
                </form>
            ) : (
                // ACCIÓN REQUERIDA: El usuario no está logueado o usó Credentials
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-base-200/50 p-2 px-4 rounded-lg">
                    <span className="text-xs font-medium opacity-70 text-center sm:text-left">
                        {session ? "Para buscar necesitas vincular Google" : "Inicia sesión con Google para buscar"}
                    </span>
                    <button 
                        onClick={() => signIn("google", { callbackUrl: "/youtube" })}
                        className="btn btn-error btn-sm gap-2 text-white"
                    >
                        <FaGoogle /> Conectar
                    </button>
                </div>
            )}
        </div>
    );
}
