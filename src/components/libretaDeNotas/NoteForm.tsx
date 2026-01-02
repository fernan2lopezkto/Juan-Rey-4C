'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSong } from '@/components/libretaDeNotas/storage';

export default function FormularioCancion() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', chords: '', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSong({
      id: crypto.randomUUID(),
      ...form,
      date: new Date().toLocaleDateString()
    });
    router.push('/utilities/libretadenotas/listadecanciones'); // Redirige tras guardar
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold">Agregar Canción</h2>
      <input
        required
        placeholder="Título"
        className="input input-bordered w-full"
        onChange={e => setForm({ ...form, title: e.target.value })}
      />
      <input
        placeholder="Progresión (Ej: C G Am F)"
        className="input input-bordered w-full font-mono text-primary"
        onChange={e => setForm({ ...form, chords: e.target.value })}
      />
      <textarea
        placeholder="Letra y notas (admite saltos de línea)"
        className="textarea textarea-bordered h-40 w-full"
        onChange={e => setForm({ ...form, notes: e.target.value })}
      />
      <button className="btn btn-primary">Guardar</button>
    </form>
  );
}
