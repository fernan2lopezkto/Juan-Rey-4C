// utilities/libretadenotas/components/NoteForm.tsx
'use client';

import { useState } from 'react';
import { Song } from '@/components/libretaDeNotas/types';

interface NoteFormProps {
  onAdd: (song: Song) => void;
}

export default function NoteForm({ onAdd }: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [chords, setChords] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSong: Song = {
      id: crypto.randomUUID(),
      title,
      chords,
      notes: new Date().toLocaleDateString()
    };

    onAdd(newSong);
    setTitle('');
    setChords('');
  };

  return (
    <div className="card bg-base-200 shadow-md mb-8">
      <div className="card-body">
        <h3 className="card-title text-primary">Nueva Progresión</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Título de la canción"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Acordes (Ej: Do Sol Lam Fa)"
            className="input input-bordered w-full font-mono"
            value={chords}
            onChange={(e) => setChords(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-full md:w-auto">
            Guardar en Libreta
          </button>
        </form>
      </div>
    </div>
  );
}
