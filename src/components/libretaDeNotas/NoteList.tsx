// components/libretaDeNotas/NoteList.tsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { 
  getSongs, 
  saveCurrentSongId, 
  deleteSong, 
  importSongsData, 
  Song 
} from './storage';

export default function ListaCanciones() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPreview, setSelectedPreview] = useState<Song | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setSongs(getSongs()); }, []);

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
        alert("¡Base de datos importada!");
        setSongs(getSongs());
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(songs));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `backup_canciones_${new Date().toLocaleDateString()}.json`);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-48">
      <div className="sticky top-0 bg-base-100/80 backdrop-blur-md pt-4 z-10 mb-6">
        <input
          type="search"
          placeholder="🔍 Buscar por título o etiqueta..."
          className="input input-bordered w-full shadow-sm"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col gap-3 min-h-[40vh]">
        {filtered.map((song) => (
          <div 
            key={song.id} 
            onClick={() => { saveCurrentSongId(song.id); setSelectedPreview(song); }}
            className={`card border transition-all cursor-pointer p-4 hover:scale-[1.01]
              ${selectedPreview?.id === song.id ? 'bg-primary/10 border-primary' : 'bg-base-100 border-base-300'}
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
        ))}
      </div>

      <div className="divider mt-16 opacity-30 text-xs font-mono">BACKUP MANAGEMENT</div>
      <div className="flex gap-4 justify-center pb-10">
        <button onClick={() => fileInputRef.current?.click()} className="btn btn-sm btn-ghost border-dashed border-base-300">📤 Importar</button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json,application/json,text/plain" />
        <button onClick={handleExport} className="btn btn-sm btn-ghost border-dashed border-base-300">📥 Exportar</button>
      </div>

      {selectedPreview && (
        <div className="toast toast-center toast-bottom w-full max-w-2xl p-4 z-40 mb-10">
           <div className="alert bg-base-300 shadow-2xl border border-primary flex flex-col items-stretch animate-fade-in-up">
              <div className="flex justify-between w-full">
                <span className="font-black text-xl text-primary">{selectedPreview.title}</span>
                <button onClick={() => setSelectedPreview(null)} className="btn btn-xs btn-circle">✕</button>
              </div>
              <p className="font-mono text-accent font-bold text-lg my-2 text-left">{selectedPreview.chords}</p>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => {
                    if(confirm("¿Borrar definitivamente?")) { 
                      deleteSong(selectedPreview.id); 
                      setSelectedPreview(null); 
                      setSongs(getSongs()); 
                    }
                  }} 
                  className="btn btn-error btn-outline flex-1"
                >🗑</button>
                <a href="/utilities/libretadenotas/editar" className="btn btn-warning btn-outline flex-1">✏️</a>
                <a href="/utilities/libretadenotas/cancion" className="btn btn-primary flex-[2]">Ver Canción</a>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
