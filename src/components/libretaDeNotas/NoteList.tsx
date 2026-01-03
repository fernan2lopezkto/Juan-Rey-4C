'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
  getSongs, 
  saveCurrentSongId, 
  deleteSong, 
  importSongsData, 
  Song 
} from '@/components/libretaDeNotas/storage';

export default function ListaCanciones() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState('');
  // Estado para la canción seleccionada (muestra el Toast)
  const [selectedPreview, setSelectedPreview] = useState<Song | null>(null);
  
  // Referencia para el input de archivo oculto (importar)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSongs = () => setSongs(getSongs());
  useEffect(() => { loadSongs(); }, []);

  const filtered = songs.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  // Maneja el click en una tarjeta de la lista
  const handleSelectSong = (song: Song) => {
    saveCurrentSongId(song.id); // Guardamos ID en local para que otras páginas lo usen
    setSelectedPreview(song);   // Mostramos el Toast
  };

  // Maneja el borrado desde el Toast
  const handleDelete = () => {
    if (selectedPreview && confirm('¿Estás seguro de borrar esta canción permanentemente?')) {
      deleteSong(selectedPreview.id);
      setSelectedPreview(null);
      loadSongs(); // Recargar lista visualmente
    }
  };

  // Lógica de Exportar a JSON
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(songs));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mis_canciones_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Lógica de Importar desde JSON
  const handleImportClick = () => fileInputRef.current?.click();
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (importSongsData(content)) {
        alert('¡Canciones importadas correctamente!');
        loadSongs();
        // Limpiamos el input para permitir cargar el mismo archivo si fuera necesario
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        alert('Error: El archivo no tiene el formato correcto.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-2xl mx-auto pb-40 px-2">
      {/* Buscador */}
      <input
        type="search"
        placeholder="🔍 Buscar canción..."
        className="input input-bordered w-full mb-6 shadow-sm"
        onChange={(e) => setSearch(e.target.value)}
      />
      
      {/* Lista de Canciones */}
      <div className="flex flex-col gap-3 min-h-[50vh]">
        {filtered.length === 0 && (
          <div className="text-center opacity-50 mt-10">
            <p>No se encontraron canciones.</p>
            <p className="text-sm">Usa el botón (+) para agregar una.</p>
          </div>
        )}
        
        {filtered.map((song) => (
          <div 
            key={song.id} 
            onClick={() => handleSelectSong(song)}
            className={`card border transition-all cursor-pointer hover:shadow-md
              ${selectedPreview?.id === song.id 
                ? 'bg-primary/10 border-primary shadow-sm' 
                : 'bg-base-100 border-base-300 hover:bg-base-200'}
            `}
          >
            <div className="card-body p-4 flex-row justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{song.title}</h3>
                <p className="text-xs opacity-50">{song.date}</p>
              </div>
              <span className={`badge font-mono font-bold ${selectedPreview?.id === song.id ? 'badge-primary' : 'badge-ghost'}`}>
                {song.chords.slice(0, 12)}{song.chords.length > 12 ? '...' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Zona de Importar / Exportar (Footer de la lista) */}
      <div className="divider mt-10 text-xs opacity-50">Gestión de Datos</div>
      <div className="flex gap-4 justify-center pb-10">
        <button onClick={handleExport} className="btn btn-outline btn-sm">
          📥 Exportar Backup
        </button>
        <button onClick={handleImportClick} className="btn btn-outline btn-sm">
          📤 Importar Backup
        </button>
        {/* Input oculto para cargar archivo */}
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
            
            {/* Cabecera del Toast */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-xl text-primary">{selectedPreview.title}</h3>
                <p className="font-mono text-accent text-lg font-bold tracking-wider mt-1">
                  {selectedPreview.chords}
                </p>
              </div>
              <button 
                onClick={() => setSelectedPreview(null)} 
                className="btn btn-circle btn-ghost btn-sm"
              >
                ✕
              </button>
            </div>

            {/* Botonera de Acciones */}
            <div className="grid grid-cols-4 gap-2">
               {/* Botón BORRAR */}
              <button 
                onClick={handleDelete} 
                className="btn btn-error btn-outline col-span-1"
                title="Borrar canción"
              >
                🗑
              </button>
               {/* Botón EDITAR (va a la pagina nueva) */}
              <Link 
                href="/utilities/libretadenotas/editar" 
                className="btn btn-warning btn-outline col-span-1"
                title="Editar canción"
              >
                ✏️
              </Link>
               {/* Botón VER COMPLETA */}
              <Link 
                href="/utilities/libretadenotas/cancion" 
                className="btn btn-primary col-span-2 shadow-lg"
              >
                Ver Completa
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
