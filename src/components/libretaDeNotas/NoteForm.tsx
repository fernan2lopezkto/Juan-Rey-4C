'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSong, updateSong, getSongById, getCurrentSongId } from '@/components/libretaDeNotas/storage';

export default function FormularioCancion({ mode = 'create' }: { mode?: 'create' | 'edit' }) {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', chords: '', notes: '', tags: '' });
  const [currentId, setCurrentId] = useState<string | null>(null);

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
            tags: song.tags ? song.tags.join(', ') : '' 
          });
        }
      }
    }
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Limpiamos y convertimos el string de tags a un array
    const tagArray = form.tags.split(',').map(t => t.trim()).filter(t => t !== '');
    
    const songData = {
      title: form.title,
      chords: form.chords,
      notes: form.notes,
      tags: tagArray,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg mx-auto p-4 bg-base-100 rounded-box border border-base-300 shadow-sm">
      <h2 className="text-3xl font-black text-primary">{mode === 'edit' ? 'Editar' : 'Nueva'} Canción</h2>
      
      <div className="form-control">
        <label className="label text-xs uppercase font-bold opacity-40">Título</label>
        <input required className="input input-bordered" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
      </div>

      <div className="form-control">
        <label className="label text-xs uppercase font-bold opacity-40">Chords Progression</label>
        <input className="input input-bordered font-mono font-bold text-accent" value={form.chords} onChange={e => setForm({...form, chords: e.target.value})} />
      </div>

      <div className="form-control">
        <label className="label text-xs uppercase font-bold opacity-40">Etiquetas (separadas por comas)</label>
        <input placeholder="ej: domingo, lento, alabanza" className="input input-bordered input-sm" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
      </div>

      <div className="form-control">
        <label className="label text-xs uppercase font-bold opacity-40">Letra y Notas</label>
        <textarea className="textarea textarea-bordered h-48 leading-relaxed font-medium" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
      </div>

      <button className="btn btn-primary shadow-lg mt-4">Guardar Cambios</button>
    </form>
  );
}
