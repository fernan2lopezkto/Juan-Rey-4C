// utilities/libretadenotas/components/NoteList.tsx
'use client';
import { Song } from '@/components/libretaDeNotas/types';

interface NoteListProps {
  songs: Song[];
  onDelete: (id: string) => void;
}

export default function NoteList({ songs, onDelete }: NoteListProps) {
  if (songs.length === 0) {
    return <div className="text-center opacity-50">No hay canciones guardadas.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {songs.map((song) => (
        <div key={song.id} className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <h2 className="card-title">{song.title}</h2>
              <button 
                onClick={() => onDelete(song.id)}
                className="btn btn-square btn-ghost btn-sm text-error"
                aria-label="Borrar"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-neutral text-neutral-content rounded-box mt-2">
              <p className="font-mono text-lg tracking-wider">{song.chords}</p>
            </div>
            <div className="card-actions justify-end mt-2">
              <span className="text-xs opacity-60">Creado: {song.notes}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
