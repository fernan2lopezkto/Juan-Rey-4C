// utilities/libretadenotas/components/NoteApp.tsx
'use client';

import { useEffect, useState } from 'react';
import { Song } from '@/components/libretaDeNotas/types';
import NoteForm from '@/components/libretaDeNotas/NoteForm';
import NoteList from '@/components/libretaDeNotas/NoteList';

export default function NoteApp() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Cargar datos al montar (solo en cliente)
  useEffect(() => {
    const saved = localStorage.getItem('mySongs');
    if (saved) {
      setSongs(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

  // Guardar datos cuando cambian
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('mySongs', JSON.stringify(songs));
    }
  }, [songs, loaded]);

  const addSong = (song: Song) => {
    setSongs([song, ...songs]);
  };

  const deleteSong = (id: string) => {
    setSongs(songs.filter((s) => s.id !== id));
  };

  if (!loaded) return <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <NoteForm onAdd={addSong} />
      <div className="divider">Tus Canciones</div>
      <NoteList songs={songs} onDelete={deleteSong} />
    </div>
  );
}
