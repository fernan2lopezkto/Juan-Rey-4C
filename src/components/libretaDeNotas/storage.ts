import { Song } from '@/types/notebook';
export type { Song };

const KEY = 'my_songs_db';
const CURRENT_SONG_KEY = 'current_active_song_id';

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

export const updateSong = (updatedSong: Song) => {
  const songs = getSongs();
  const index = songs.findIndex((s) => s.id === updatedSong.id);
  if (index !== -1) {
    songs[index] = updatedSong;
    localStorage.setItem(KEY, JSON.stringify(songs));
  }
};

export const deleteSong = (id: string) => {
  const songs = getSongs();
  const newSongs = songs.filter((s) => s.id !== id);
  localStorage.setItem(KEY, JSON.stringify(newSongs));
};

export const importSongsData = (jsonData: string): boolean => {
  try {
    const parsed = JSON.parse(jsonData);
    if (Array.isArray(parsed)) {
      localStorage.setItem(KEY, JSON.stringify(parsed));
      return true;
    }
  } catch (e) { console.error("Error importando:", e); }
  return false;
};

export const saveCurrentSongId = (id: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_SONG_KEY, id);
};

export const getCurrentSongId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_SONG_KEY);
};
