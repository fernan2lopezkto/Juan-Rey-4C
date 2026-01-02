// utilities/libretadenotas/utils/storage.ts
export interface Song {
  id: string;
  title: string;
  chords: string;
  notes: string; // Ahora soporta saltos de línea
  date: string;
}

const KEY = 'my_songs_db';

export const getSongs = (): Song[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const getSongById = (id: string): Song | undefined => {
  const songs = getSongs();
  return songs.find((s) => s.id === id);
};

export const saveSong = (song: Song) => {
  const songs = getSongs();
  localStorage.setItem(KEY, JSON.stringify([song, ...songs]));
};
