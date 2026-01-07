"use client";
import { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useYoutube } from '@/context/YoutubeContext';

export default function FilterConfig() {
    const { blacklist, addToBlacklist, removeFromBlacklist } = useYoutube();
    const [newWord, setNewWord] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newWord.trim()) {
            addToBlacklist(newWord.trim());
            setNewWord('');
        }
    };

    return (
        <div className="bg-base-200 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Configuración de Filtros ({blacklist.length})</h2>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
                <input
                    type="text"
                    className="input input-bordered flex-1"
                    placeholder="Bloquear palabra (ej: 'reacción', 'clickbait')..."
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary">
                    <FaPlus /> Agregar
                </button>
            </form>
            
            <div className="flex flex-wrap gap-2">
                {blacklist.length === 0 && <p className="opacity-50 italic">No hay palabras bloqueadas.</p>}
                {blacklist.map(word => (
                    <div key={word} className="badge badge-error gap-2 p-3 text-white">
                        {word}
                        <FaTrash 
                            className="cursor-pointer hover:text-black transition-colors" 
                            onClick={() => removeFromBlacklist(word)} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
