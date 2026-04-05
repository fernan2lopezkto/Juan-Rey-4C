'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSongs } from '@/context/SongsContext';

export default function AccionesCancion() {
  const router = useRouter();
  const { currentSong, deleteSong } = useSongs();

  const handleDelete = async () => {
    if (currentSong?.id && confirm('¿Eliminar esta canción permanentemente?')) {
      await deleteSong(currentSong.id);
      router.push('/utilities/libretadenotas/listadecanciones');
    }
  };

  const handleExport = () => {
    if (!currentSong) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify([currentSong]));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `cancion_${currentSong.title.replace(/\s+/g, '_')}.json`);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!currentSong) return null;

  return (
    <div className="flex flex-wrap gap-4 justify-center mt-8 border-t border-base-300 pt-6">
      <button onClick={handleDelete} className="btn btn-error btn-outline flex-1">
        🗑 Borrar
      </button>
      <button onClick={handleExport} className="btn btn-info btn-outline flex-1">
        📥 Exportar
      </button>
      <Link href="/utilities/libretadenotas/editar" className="btn btn-warning btn-outline flex-1">
        ✏️ Editar
      </Link>
    </div>
  );
}
