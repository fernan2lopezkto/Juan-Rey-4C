'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSong, updateSong, getSongById, getCurrentSongId, Song } from '@/components/libretaDeNotas/storage';

interface NoteFormProps {
  mode?: 'create' | 'edit';
}

export default function NoteForm({ mode = 'create' }: NoteFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<Omit<Song, 'id' | 'date'>>({ title: '', chords: '', notes: '' });
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Si estamos en modo editar, cargamos los datos
  useEffect(() => {
    if (mode === 'edit') {
      const id = getCurrentSongId();
      if (id) {
        const song = getSongById(id);
        if (song) {
          setCurrentId(id);
          setForm({ title: song.title, chords: song.chords, notes: song.notes });
        }
      }
    }
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      saveSong({
        id: crypto.randomUUID(),
        ...form,
        date: new Date().toLocaleDateString()
      });
    } else if (mode === 'edit' && currentId) {
      updateSong({
        id: currentId,
        ...form,
        date: new Date().toLocaleDateString() // Actualizamos la fecha de edición
      });
    }

    router.push('/utilities/libretadenotas/listadecanciones');
    router.refresh(); // Refresca para mostrar cambios
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto bg-base-100 p-6 rounded-box shadow-lg border border-base-200">
      <h2 className="text-2xl font-bold text-primary">
        {mode === 'edit' ? 'Editar Canción' : 'Nueva Canción'}
      </h2>
      
      <div className="form-control">
        <label className="label"><span className="label-text">Título</span></label>
        <input
          required
          value={form.title}
          placeholder="Ej: Eres Todopoderoso"
          className="input input-bordered w-full"
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div className="form-control">
        <label className="label"><span className="label-text">Progresión</span></label>
        <input
          value={form.chords}
          placeholder="Ej: Bm G D A"
          className="input input-bordered w-full font-mono text-secondary font-bold"
          onChange={e => setForm({ ...form, chords: e.target.value })}
        />
      </div>

      <div className="form-control">
        <label className="label"><span className="label-text">Contenido</span></label>
        <textarea
          value={form.notes}
          placeholder="Letra y notas..."
          className="textarea textarea-bordered h-48 w-full leading-relaxed"
          onChange={e => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button type="button" onClick={() => router.back()} className="btn btn-ghost flex-1">Cancelar</button>
        <button type="submit" className="btn btn-primary flex-1">
            {mode === 'edit' ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
