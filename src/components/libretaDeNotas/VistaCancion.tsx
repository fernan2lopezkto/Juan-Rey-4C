'use client';
import { useEffect, useState } from 'react';
import { getSongById, getCurrentSongId, Song } from '@/components/libretaDeNotas/storage';
import AccionesCancion from '../AccionesCancion';

export default function VistaCancion() {
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    const id = getCurrentSongId();
    if (id) {
      const data = getSongById(id);
      if (data) setSong(data);
    }
  }, []);

  if (!song) return <div className="flex justify-center p-20"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">{song.title}</h1>
        <div className="flex justify-center gap-2 mt-2">
          {song.tags?.map(tag => (
            <span key={tag} className="badge badge-primary badge-outline text-[10px] uppercase tracking-tighter">
              {tag}
            </span>
          ))}
        </div>
        <p className="opacity-40 text-xs mt-3 uppercase font-mono">{song.date}</p>
      </div>
      
      <div className="card bg-base-200 shadow-sm border border-base-300">
        <div className="card-body p-6">
          <h2 className="card-title text-[10px] uppercase opacity-40 tracking-widest">Progression</h2>
          <p className="text-3xl font-mono text-accent font-bold tracking-wider leading-relaxed">
            {song.chords}
          </p>
        </div>
      </div>

      <div className="prose max-w-none whitespace-pre-wrap leading-relaxed bg-base-100 p-8 rounded-2xl border border-base-300 shadow-sm font-medium">
        {song.notes}
      </div>

      {/* Aquí insertamos los nuevos botones de acción */}
      <AccionesCancion />
    </div>
  );
}
