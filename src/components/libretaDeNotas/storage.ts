// utilities/libretadenotas/utils/storage.ts

// ... (MANTÉN EL RESTO DEL CÓDIGO ANTERIOR: interfaces, const KEY, getSongs, etc.) ...

// Actualizar una canción existente
export const updateSong = (updatedSong: Song) => {
  const songs = getSongs();
  const index = songs.findIndex((s) => s.id === updatedSong.id);
  if (index !== -1) {
    songs[index] = updatedSong;
    localStorage.setItem(KEY, JSON.stringify(songs));
  }
};

// Borrar una canción
export const deleteSong = (id: string) => {
  const songs = getSongs();
  const newSongs = songs.filter((s) => s.id !== id);
  localStorage.setItem(KEY, JSON.stringify(newSongs));
};

// Importación masiva (reemplaza o fusiona, aquí haremos reemplazo seguro)
export const importSongsData = (jsonData: string): boolean => {
  try {
    const parsed = JSON.parse(jsonData);
    if (Array.isArray(parsed)) {
      localStorage.setItem(KEY, JSON.stringify(parsed));
      return true;
    }
  } catch (e) {
    console.error("Error importando JSON", e);
  }
  return false;
};
