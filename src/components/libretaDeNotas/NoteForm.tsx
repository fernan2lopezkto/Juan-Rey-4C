'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  saveSong, 
  updateSong, 
  getSongById, 
  getCurrentSongId, 
  Song 
} from '@/components/libretaDeNotas/storage';

interface NoteFormProps {
  mode?: 'create' | 'edit';
}

export default function FormularioCancion({ mode = 'create' }: NoteFormProps) {
  const router = useRouter();
  
  // Estado del formulario
  const [form, setForm] = useState<Omit<Song, 'id' | 'date'>>({ 
    title: '', 
    chords: '', 
    notes: '' 
  });
  
  // ID actual (solo para modo edición)
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Efecto: Si es modo edición, cargar datos
  useEffect(() => {
    if (mode === 'edit') {
      const id = getCurrentSongId();
      if (id) {
        const songData = getSongById(id);
        if (songData) {
          setCurrentId(id);
          setForm({ 
            title: songData.title, 
            chords: songData.chords, 
            notes: songData.notes 
          });
        }
      }
    }
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      // Crear nueva
      saveSong({
        id: crypto.randomUUID(),
        ...form,
        date: new Date().toLocaleDateString()
      });
    } else if (mode === 'edit' && currentId) {
      // Actualizar existente
      updateSong({
        id: currentId,
        ...form,
        date: new Date().toLocaleDateString() // Actualiza fecha a "hoy" al editar
      });
    }

    // Redirección
    router.push('/utilities/libretadenotas/listadecanciones');
    router.refresh(); 
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col gap-4 max-w-lg mx-auto bg-base-100 p-6 rounded-box shadow-lg border border-base-200"
    >
      <h2 className="text-2xl font-bold text-primary mb-2">
        {mode === 'edit' ? '✏️ Editar Canción' : '🎵 Agregar Canción'}
      </h2>
      
      {/* Título */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Título</span>
        </label>
        <input
          required
          value={form.title}
          placeholder="Ej: Eres Todopoderoso"
          className="input input-bordered w-full"
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
      </div>

      {/* Acordes */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Progresión de Acordes</span>
        </label>
        <input
          value={form.chords}
          placeholder="Ej: Bm G D A"
          className="input input-bordered w-full font-mono text-secondary font-bold text-lg"
          onChange={e => setForm({ ...form, chords: e.target.value })}
        />
      </div>

      {/* Letra y Notas */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Letra y Notas</span>
        </label>
        <textarea
          value={form.notes}
          placeholder="Escribe aquí la letra o detalles de la canción..."
          className="textarea textarea-bordered h-48 w-full leading-relaxed text-base"
          onChange={e => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-6">
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="btn btn-ghost flex-1"
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary flex-1 shadow-md">
            {mode === 'edit' ? 'Actualizar Cambios' : 'Guardar Canción'}
        </button>
      </div>
    </form>
  );
}
