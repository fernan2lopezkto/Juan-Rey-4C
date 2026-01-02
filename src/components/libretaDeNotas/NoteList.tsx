'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSongs, saveCurrentSongId, Song } from '@/components/libretaDeNotas/storage';

export default function ListaCanciones() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState('');
  // Estado para la canción seleccionada (para mostrar en el toast)
  const [selectedPreview, setSelectedPreview] = useState<Song | null>(null);

  useEffect(() => { setSongs(getSongs()); }, []);

  const filtered = songs.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  const handleSelectSong = (song: Song) => {
    // 1. Guardamos el ID en localStorage
    saveCurrentSongId(song.id);
    // 2. Mostramos el Toast/Preview
    setSelectedPreview(song);
  };

  return (
    <div className="max-w-2xl mx-auto pb-32"> {/* Padding bottom extra para que el toast no tape el final */}
      <input
        type="search"
        placeholder="Buscar canción..."
        className="input input-bordered w-full mb-6"
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <div className="flex flex-col gap-3">
        {filtered.map((song) => (
          // Quitamos Link, usamos div con onClick
          <div 
            key={song.id} 
            onClick={() => handleSelectSong(song)}
            className={`card border transition-colors cursor-pointer 
              ${selectedPreview?.id === song.id ? 'bg-primary text-primary-content border-primary' : 'bg-base-100 border-base-300 hover:bg-base-200'}
            `}
          >
            <div className="card-body p-4 flex-row justify-between items-center">
              <h3 className="font-bold text-lg">{song.title}</h3>
              <span className={`badge font-mono ${selectedPreview?.id === song.id ? 'badge-secondary' : 'badge-ghost'}`}>
                {song.chords.slice(0, 15)}...
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* TOAST / PREVIEW FLOTANTE */}
      {selectedPreview && (
        <div className="toast toast-center toast-bottom w-full max-w-2xl p-4 z-40 mb-12">
          <div className="alert bg-base-300 shadow-2xl border border-primary grid grid-cols-1 gap-4">
            
            <div className="flex justify-between items-start w-full">
              <div>
                <h3 className="font-bold text-xl text-primary">{selectedPreview.title}</h3>
                <p className="font-mono text-accent text-lg my-1">{selectedPreview.chords}</p>
                <p className="text-sm opacity-70 line-clamp-2">{selectedPreview.notes}</p>
              </div>
              <button onClick={() => setSelectedPreview(null)} className="btn btn-circle btn-ghost btn-sm">✕</button>
            </div>

            {/* Botón que navega a la página server */}
            <Link 
              href="/utilities/libretadenotas/cancion" 
              className="btn btn-primary w-full"
            >
              Ver Canción Completa
            </Link>

          </div>
        </div>
      )}
    </div>
  );
}
