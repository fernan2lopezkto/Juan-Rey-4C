'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getSongs, saveCurrentSongId, deleteSong, importSongsData, Song } from '@/components/libretaDeNotas/storage';

export default function ListaCanciones() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPreview, setSelectedPreview] = useState<Song | null>(null);
  
  // Referencia para el input de archivo oculto
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSongs = () => setSongs(getSongs());
  useEffect(() => { loadSongs(); }, []);

  const filtered = songs.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  const handleSelectSong = (song: Song) => {
    saveCurrentSongId(song.id);
    setSelectedPreview(song);
  };

  const handleDelete = () => {
    if (selectedPreview && confirm('¿Estás seguro de borrar esta canción?')) {
      deleteSong(selectedPreview.id);
      setSelectedPreview(null);
      loadSongs(); // Recargar lista
    }
  };

  // Lógica de Exportar
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(songs));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mis_canciones.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Lógica de Importar
  const handleImportClick = () => fileInputRef.current?.click();
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (importSongsData(content)) {
        alert('Canciones importadas correctamente');
        loadSongs();
      } else {
        alert('Error al leer el archivo');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-2xl mx-auto pb-40 px-2">
      <input
        type="search"
        placeholder="🔍 Buscar canción..."
        className="input input-bordered w-full mb-6 shadow-sm"
        onChange={(e) => setSearch(e.target.value)}
      />
      
      {/* LISTA */}
      <div className="flex flex-col gap-3 min-h-[50vh]">
        {filtered.length === 0 && <p className="text-center opacity-50 mt-10">No se encontraron canciones</p>}
        {filtered.map((song) => (
          <div 
            key={song.id} 
            onClick={() => handleSelectSong(song)}
            className={`card border transition-all cursor-pointer hover:shadow-md
              ${selectedPreview?.id === song.id ? 'bg-primary/10 border-primary' : 'bg-base-100 border-base-300 hover:bg-base-200'}
            `}
          >
            <div className="card-body p-4 flex-row justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{song.title}</h3>
                <p className="text-xs opacity-50">{song.date}</p>
              </div>
              <span className={`badge font-mono ${selectedPreview?.id === song.id ? 'badge-primary' : 'badge-ghost'}`}>
                {song.chords.slice(0, 10)}{song.chords.length > 10 ? '...' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ZONA DE IMPORTAR / EXPORTAR (Al final) */}
      <div className="divider mt-10">Gestión de Datos</div>
      <div className="flex gap-4 justify-center">
        <button onClick={handleExport} className="btn btn-outline btn-sm">
          📥 Exportar Backup
        </button>
        <button onClick={handleImportClick} className="btn btn-outline btn-sm">
          📤 Importar Backup
        </button>
        {/* Input oculto */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".json"
        />
      </div>

      {/* TOAST FLOTANTE CON ACCIONES */}
      {selectedPreview && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 flex justify-center animate-fade-in-up">
          <div className="bg-base-300 shadow-2xl border border-primary/20 rounded-box p-4 w-full max-w-2xl backdrop-blur-md bg-opacity-95">
            
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-xl text-primary">{selectedPreview.title}</h3>
                <p className="font-mono text-accent text-lg font-bold">{selectedPreview.chords}</p>
              </div>
              <button onClick={() => setSelectedPreview(null)} className="btn btn-circle btn-ghost btn-sm">✕</button>
            </div>

            <div className="grid grid-cols-4 gap-2">
               {/* Botón BORRAR */}
              <button onClick={handleDelete} className="btn btn-error btn-outline col-span-1">
                🗑
              </button>
               {/* Botón EDITAR */}
              <Link href="/utilities/libretadenotas/editar" className="btn btn-warning btn-outline col-span-1">
                ✏️
              </Link>
               {/* Botón VER COMPLETA */}
              <Link href="/utilities/libretadenotas/cancion" className="btn btn-primary col-span-2">
                Ver Completa
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
