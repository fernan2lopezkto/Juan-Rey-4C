export interface Song {
  id: string;
  title: string;
  chords: string; // Ej: "C G Am F"
  notes: string;  // Letra y anotaciones
  date: string;
}

const KEY = 'my_songs_db';
const CURRENT_SONG_KEY = 'current_active_song_id';

// --- LECTURA ---
export const getSongs = (): Song[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const getSongById = (id: string): Song | undefined => {
  const songs = getSongs();
  return songs.find((s) => s.id === id);
};

// --- ESCRITURA ---
export const saveSong = (song: Song) => {
  const songs = getSongs();
  localStorage.setItem(KEY, JSON.stringify([song, ...songs]));
};

export const updateSong = (updatedSong: Song) => {
  const songs = getSongs();
  const index = songs.findIndex((s) => s.id === updatedSong.id);
  if (index !== -1) {
    songs[index] = updatedSong;
    localStorage.setItem(KEY, JSON.stringify(songs));
  }
};

// --- BORRADO ---
export const deleteSong = (id: string) => {
  const songs = getSongs();
  const newSongs = songs.filter((s) => s.id !== id);
  localStorage.setItem(KEY, JSON.stringify(newSongs));
};

// --- IMPORTACIÓN / EXPORTACIÓN ---
export const importSongsData = (jsonData: string): boolean => {
  try {
    const parsed = JSON.parse(jsonData);
    if (Array.isArray(parsed)) {
      // Opcional: Validar que los objetos tengan la estructura correcta
      localStorage.setItem(KEY, JSON.stringify(parsed));
      return true;
    }
  } catch (e) {
    console.error("Error importando JSON", e);
  }
  return false;
};

// --- GESTIÓN DE SELECCIÓN ACTIVA (Para pasar datos entre páginas) ---
export const saveCurrentSongId = (id: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_SONG_KEY, id);
};

export const getCurrentSongId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_SONG_KEY);
};
