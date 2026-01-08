// components/libretaDeNotas/NoteForm.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSong, updateSong, getSongById, getCurrentSongId } from './storage';
import TagManager from './TagManager';

export default function FormularioCancion({ mode = 'create' }: { mode?: 'create' | 'edit' }) {
  const router = useRouter();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    chords: '',
    notes: '',
    tags: [] as string[]
  });

  useEffect(() => {
    if (mode === 'edit') {
      const id = getCurrentSongId();
      if (id) {
        const song = getSongById(id);
        if (song) {
          setCurrentId(id);
          setForm({ 
            title: song.title, 
            chords: song.chords, 
            notes: song.notes,
            tags: song.tags || [] 
          });
        }
      }
    }
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const songData = {
      ...form,
      date: new Date().toLocaleDateString()
    };

    if (mode === 'create') {
      saveSong({ id: crypto.randomUUID(), ...songData });
    } else if (currentId) {
      updateSong({ id: currentId, ...songData });
    }
    router.push('/utilities/libretadenotas/listadecanciones');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg mx-auto p-6 bg-base-100 rounded-box border border-base-300 shadow-xl mb-10">
      <h2 className="text-3xl font-black text-primary mb-2">
        {mode === 'edit' ? '✏️ Editar' : '🎵 Nueva'} Canción
      </h2>
      
      <div className="form-control">
        <label className="label text-xs uppercase font-bold opacity-40 tracking-widest">Título</label>
        <input required className="input input-bordered" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
      </div>

      <div className="form-control">
        <label className="label text-xs uppercase font-bold opacity-40 tracking-widest">Progresión</label>
        <input className="input input-bordered font-mono font-bold text-accent" value={form.chords} onChange={e => setForm({...form, chords: e.target.value})} />
      </div>

      {/* USO DEL COMPONENTE TAGS */}
      <TagManager 
        tags={form.tags} 
        onChange={(newTags) => setForm({...form, tags: newTags})} 
      />

      <div className="form-control">
        <label className="label text-xs uppercase font-bold opacity-40 tracking-widest">Contenido</label>
        <textarea className="textarea textarea-bordered h-48 leading-relaxed font-medium" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => router.back()} className="btn btn-ghost flex-1">Cancelar</button>
        <button type="submit" className="btn btn-primary flex-[2] shadow-lg">Guardar Canción</button>
      </div>
    </form>
  );
}
