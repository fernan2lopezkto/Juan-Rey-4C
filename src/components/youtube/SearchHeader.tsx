"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';

export default function SearchHeader() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            // Redirigimos a la subruta de búsqueda enviando la query por URL
            router.push(`/youtube/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-base-100 p-4 rounded-xl shadow-sm">
            <h1 className="text-2xl font-bold text-base-content flex items-center gap-2 cursor-pointer" onClick={() => router.push('/youtube')}>
                <span className="text-error">You</span>Tube Filter
            </h1>
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl w-full flex gap-2">
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Search videos..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type='submit' className="btn btn-primary">
                    <FaSearch />
                </button>
            </form>
        </div>
    );
}
