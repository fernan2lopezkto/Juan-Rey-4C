// utilities/libretadenotas/utils/storage.ts
export interface Song {
  id: string;
  title: string;
  chords: string;
  notes: string;
  date: string;
}

const KEY = 'my_songs_db';
const CURRENT_SONG_KEY = 'current_active_song_id'; // Nueva clave

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

// --- Nuevas funciones para la canción activa ---

export const saveCurrentSongId = (id: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_SONG_KEY, id);
};

export const getCurrentSongId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_SONG_KEY);
};
