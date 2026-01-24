'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSongs } from '@/context/SongsContext'; // Usamos el nuevo contexto
import { getCurrentSongId } from './storage';
import TagManager from './TagManager';

export default function FormularioCancion({ mode = 'create' }: { mode?: 'create' | 'edit' }) {
  const router = useRouter();
  const { songs, saveSong, updateSong } = useSongs(); // Funciones del contexto
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
        // Buscamos la canción directamente del estado global del contexto
        const song = songs.find(s => s.id === id);
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
  }, [mode, songs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      const songData = {
        title: form.title,
        chords: form.chords,
        notes: form.notes,
        tags: form.tags
      };

      if (mode === 'create') {
        await saveSong(songData);
      } else if (currentId) {
        await updateSong(currentId, songData);
      }

      // Redirigir solo después de que el contexto confirme el guardado
      router.push('/utilities/libretadenotas/listadecanciones');
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar la canción.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg mx-auto p-6 bg-base-100 rounded-box border border-base-300 shadow-xl mb-10">
      <h2 className="text-3xl font-black text-primary mb-2">
        {mode === 'edit' ? '✏️ Editar' : '🎵 Nueva'} Canción
      </h2>
      
      <div className="form-control">
        <label className="label text-xs uppercase font-bold opacity-40 tracking-widest">Título</label>
        <input 
          required 
          disabled={isSubmitting}
          className="input input-bordered focus:input-primary" 
          value={form.title} 
          onChange={e => setForm({...form, title: e.target.value})} 
        />
      </div>

      <div className="form-control">
        <label className="label text-xs uppercase font-bold opacity-40 tracking-widest">Progresión</label>
        <input 
          disabled={isSubmitting}
          className="input input-bordered font-mono font-bold text-accent focus:input-accent" 
          value={form.chords} 
          onChange={e => setForm({...form, chords: e.target.value})} 
        />
      </div>

      <TagManager 
        tags={form.tags} 
        onChange={(newTags) => setForm({...form, tags: newTags})} 
      />

      <div className="form-control">
        <label className="label text-xs uppercase font-bold opacity-40 tracking-widest">Contenido</label>
        <textarea 
          disabled={isSubmitting}
          className="textarea textarea-bordered h-48 leading-relaxed font-medium focus:textarea-primary" 
          value={form.notes} 
          onChange={e => setForm({...form, notes: e.target.value})} 
        />
      </div>

      <div className="flex gap-2">
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="btn btn-ghost flex-1"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="btn btn-primary flex-[2] shadow-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? <span className="loading loading-spinner"></span> : 'Guardar Canción'}
        </button>
      </div>
    </form>
  );
}
