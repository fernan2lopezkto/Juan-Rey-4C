'use client';
import { useEffect, useState } from 'react';
import { getSongById, getCurrentSongId, Song } from '@/components/libretaDeNotas/storage';
import Link from 'next/link';

export default function VistaCancion() {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recuperamos el ID guardado en el paso anterior
    const currentId = getCurrentSongId();
    if (currentId) {
      const data = getSongById(currentId);
      if (data) setSong(data);
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg"></span></div>;

  if (!song) return (
    <div className="text-center p-10">
      <h2 className="text-xl font-bold mb-4">No hay canción seleccionada</h2>
      <Link href="/utilities/libretadenotas/listadecanciones" className="btn btn-primary">
        Volver a la lista
      </Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Botón volver pequeño arriba */}
      <Link href="/utilities/libretadenotas/listadecanciones" className="btn btn-ghost btn-sm mb-4">
        ← Volver
      </Link>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">{song.title}</h1>
        <p className="opacity-60 text-sm mt-2">{song.date}</p>
      </div>
      
      <div className="card bg-base-200 shadow-sm border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-sm uppercase opacity-50">Acordes</h2>
          <p className="text-2xl font-mono text-accent font-bold tracking-wider break-words">
            {song.chords}
          </p>
        </div>
      </div>

      <div className="prose max-w-none whitespace-pre-wrap leading-relaxed bg-base-100 p-6 rounded-box border border-base-300 shadow-sm">
        {song.notes}
      </div>
    </div>
  );
}
