'use client';
import { useSongs } from '@/context/SongsContext';
import AccionesCancion from './AccionesCancion';

export default function VistaCancion() {
  const { currentSong } = useSongs();

  if (!currentSong) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="opacity-50 italic">Cargando canción...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">{currentSong.title}</h1>
        <div className="flex justify-center gap-2 mt-2">
          {currentSong.tags?.map(tag => (
            <span key={tag} className="badge badge-primary badge-outline text-[10px] uppercase tracking-tighter">
              {tag}
            </span>
          ))}
        </div>
        <p className="opacity-40 text-xs mt-3 uppercase font-mono">{currentSong.date}</p>
      </div>
      
      <div className="card bg-base-200 shadow-sm border border-base-300">
        <div className="card-body p-6">
          <h2 className="card-title text-[10px] uppercase opacity-40 tracking-widest">Progression</h2>
          <p className="text-3xl font-mono text-accent font-bold tracking-wider leading-relaxed">
            {currentSong.chords}
          </p>
        </div>
      </div>

      <div className="prose max-w-none whitespace-pre-wrap leading-relaxed bg-base-100 p-8 rounded-2xl border border-base-300 shadow-sm font-medium">
        {currentSong.notes}
      </div>

      <AccionesCancion />
    </div>
  );
}
