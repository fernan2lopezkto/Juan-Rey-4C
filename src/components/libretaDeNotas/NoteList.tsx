'use client';
import { useState, useRef } from 'react';
import { useSongs } from '@/context/SongsContext'; // Usamos el contexto
import { Song } from '@/types/notebook';
import Link from 'next/link';
import VistaCancion from './VistaCancion';

export default function ListaCanciones() {
  const { songs, deleteSong, setCurrentSongById, loading, importSongs } = useSongs();
  const [search, setSearch] = useState('');
  const [selectedPreview, setSelectedPreview] = useState<Song | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtrado dinámico basado en las canciones del contexto
  const filtered = songs.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(songs));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `backup_canciones_${new Date().toLocaleDateString()}.json`);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
            await importSongs(json);
            alert("Canciones importadas correctamente.");
        } else {
            alert("Formato incorrecto. Se esperaba una lista de canciones.");
        }
      } catch (error) {
        alert("Error al leer el archivo. Asegúrate de que es un JSON válido.");
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  if (loading && songs.length === 0) {
    return (
      <div className="flex justify-center p-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 pb-10 flex flex-col lg:flex-row gap-6 items-start">
      {/* Columna Izquierda: Lista e import/export general */}
      <div className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 relative">
        <div className="sticky top-0 bg-base-100/80 backdrop-blur-md pt-4 z-10 mb-6">
          <input
            type="search"
            placeholder="🔍 Buscar por título o etiqueta..."
            className="input input-bordered w-full shadow-sm focus:border-primary"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col gap-3 min-h-[40vh] lg:max-h-[70vh] lg:overflow-y-auto pr-2 pb-4">
          {filtered.length === 0 ? (
            <div className="text-center opacity-40 mt-10">
              <p>No se encontraron canciones.</p>
            </div>
          ) : (
            filtered.map((song) => (
              <div 
                key={song.id} 
                onClick={() => { 
                  setCurrentSongById(song.id); 
                  setSelectedPreview(song); 
                }}
                className={`card border transition-all cursor-pointer p-4 hover:scale-[1.01] active:scale-95
                  ${selectedPreview?.id === song.id ? 'bg-primary/10 border-primary shadow-sm' : 'bg-base-100 border-base-300'}
                `}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight">{song.title}</h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {song.tags?.map(t => (
                        <span key={t} className="badge badge-xs badge-ghost py-2 uppercase text-[9px] font-bold tracking-tighter">{t}</span>
                      ))}
                    </div>
                  </div>
                  <span className="badge badge-accent badge-outline font-mono text-[10px] ml-2">
                    {song.chords.slice(0, 15)}{song.chords.length > 15 ? '...' : ''}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="divider mt-6 opacity-30 text-xs font-mono uppercase">Gestión de datos</div>
        <div className="flex gap-4 justify-center pb-10">
          <button onClick={() => fileInputRef.current?.click()} className="btn btn-sm btn-ghost border-dashed border-base-300">📤 Importar</button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleImport}
          />
          <button onClick={handleExport} className="btn btn-sm btn-ghost border-dashed border-base-300">📥 Exportar Todo</button>
        </div>
      </div>

      {/* Columna Derecha: Detalles (Solo Escritorio) */}
      <div className="hidden lg:flex flex-1 bg-base-100/50 rounded-box border border-base-300 p-6 shadow-sm min-h-[75vh] sticky top-4 flex-col overflow-y-auto max-h-[90vh]">
        {selectedPreview ? (
          <VistaCancion />
        ) : (
          <div className="flex items-center justify-center h-full opacity-50 flex-col gap-4 m-auto">
             <span className="text-6xl grayscale">🎵</span>
             <p className="font-semibold text-xl tracking-tight">Selecciona una canción</p>
             <p className="text-sm">Tus notas y acordes aparecerán aquí</p>
          </div>
        )}
      </div>

      {/* Toast para previsualización (Solo Móvil) */}
      {selectedPreview && (
        <div className="toast toast-center toast-bottom w-full max-w-2xl p-4 z-40 mb-10 lg:hidden">
           <div className="alert bg-base-300 shadow-2xl border border-primary flex flex-col items-stretch animate-fade-in-up p-5">
              <div className="flex justify-between w-full">
                <span className="font-black text-xl text-primary truncate mr-4">{selectedPreview.title}</span>
                <button onClick={() => setSelectedPreview(null)} className="btn btn-xs btn-circle">✕</button>
              </div>
              <p className="font-mono text-accent font-bold text-lg my-2 text-left truncate">{selectedPreview.chords}</p>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={async () => {
                    if(confirm("¿Borrar definitivamente?")) { 
                      await deleteSong(selectedPreview.id); 
                      setSelectedPreview(null); 
                    }
                  }} 
                  className="btn btn-error btn-outline flex-1"
                >🗑</button>
                <button 
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify([selectedPreview]));
                    const downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.setAttribute("href", dataStr);
                    downloadAnchorNode.setAttribute("download", `cancion_${selectedPreview.title.replace(/\s+/g, '_')}.json`);
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                  }}
                  className="btn btn-info btn-outline flex-1"
                >📥</button>
                <Link href="/utilities/libretadenotas/editar" className="btn btn-warning btn-outline flex-[1.5]">✏️ Editar</Link>
                <Link href="/utilities/libretadenotas/cancion" className="btn btn-primary flex-[2]">Ver</Link>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
