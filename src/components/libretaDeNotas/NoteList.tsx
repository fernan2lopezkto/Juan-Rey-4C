'use client';
import { useEffect, useState, useRef } from 'react';
import { 
  getSongs, 
  saveCurrentSongId, 
  importSongsData, 
  Song 
} from '@/components/libretaDeNotas/storage';

export default function ListaCanciones() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPreview, setSelectedPreview] = useState<Song | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setSongs(getSongs()); }, []);

  // Filtra por título O por etiquetas
  const filtered = songs.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (importSongsData(e.target?.result as string)) {
        alert("¡Lista de canciones actualizada!");
        setSongs(getSongs());
      } else {
        alert("Error: Archivo no compatible.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(songs));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mis_canciones.json");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-40">
      <input
        type="search"
        placeholder="Buscar por título o etiquetas (ej: domingo)..."
        className="input input-bordered w-full mb-8 shadow-sm"
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <div className="flex flex-col gap-3 min-h-[40vh]">
        {filtered.map((song) => (
          <div 
            key={song.id} 
            onClick={() => { saveCurrentSongId(song.id); setSelectedPreview(song); }}
            className={`card border transition-all cursor-pointer p-4
              ${selectedPreview?.id === song.id ? 'bg-primary/5 border-primary shadow-md' : 'bg-base-100 border-base-300 hover:bg-base-200'}
            `}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{song.title}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {song.tags?.map(t => (
                    <span key={t} className="badge badge-xs badge-outline opacity-40 italic">{t}</span>
                  ))}
                </div>
              </div>
              <span className="badge badge-ghost font-mono text-xs">{song.chords.slice(0, 12)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="divider mt-20 opacity-30">Backup y Datos</div>
      <div className="flex gap-4 justify-center">
        <button onClick={() => fileInputRef.current?.click()} className="btn btn-ghost btn-sm">📤 Importar</button>
        {/* Cambiado accept para mayor compatibilidad en móviles */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".json,application/json,text/plain" 
        />
        <button onClick={handleExport} className="btn btn-ghost btn-sm">📥 Exportar</button>
      </div>

      {selectedPreview && (
        <div className="toast toast-center toast-bottom w-full max-w-2xl p-4 z-40 mb-10">
           {/* El toast que ya tenías con botones de acción */}
           <div className="alert bg-base-300 shadow-2xl border border-primary flex flex-col items-stretch">
              <div className="flex justify-between w-full">
                <span className="font-bold text-lg">{selectedPreview.title}</span>
                <button onClick={() => setSelectedPreview(null)} className="btn btn-xs btn-circle">✕</button>
              </div>
              <p className="font-mono text-accent text-sm my-2">{selectedPreview.chords}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    if(confirm("¿Borrar?")) { deleteSong(selectedPreview.id); setSelectedPreview(null); setSongs(getSongs()); }
                  }} 
                  className="btn btn-error btn-outline btn-sm"
                >🗑</button>
                <a href="/utilities/libretadenotas/editar" className="btn btn-warning btn-outline btn-sm">✏️</a>
                <a href="/utilities/libretadenotas/cancion" className="btn btn-primary btn-sm flex-1">Ver Completa</a>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
