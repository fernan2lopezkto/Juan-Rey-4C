'use client';
import { useEffect, useState } from 'react';
import { getSongById, Song } from '@/components/libretaDeNotas/storage';

export default function VistaCancion({ id }: { id: string }) {
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    const data = getSongById(id);
    if (data) setSong(data);
  }, [id]);

  if (!song) return <div className="loading loading-spinner"></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">{song.title}</h1>
        <p className="opacity-60 text-sm mt-2">{song.date}</p>
      </div>
      
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-sm uppercase opacity-50">Acordes</h2>
          <p className="text-2xl font-mono text-accent font-bold tracking-wider">{song.chords}</p>
        </div>
      </div>

      <div className="prose max-w-none whitespace-pre-wrap leading-relaxed bg-base-100 p-6 rounded-box border border-base-300">
        {song.notes}
      </div>
    </div>
  );
}
