'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { deleteSong, getCurrentSongId } from './storage';

export default function AccionesCancion() {
  const router = useRouter();
  const id = getCurrentSongId();

  const handleDelete = () => {
    if (id && confirm('¿Eliminar esta canción permanentemente?')) {
      deleteSong(id);
      router.push('/utilities/libretadenotas/listadecanciones');
    }
  };

  if (!id) return null;

  return (
    <div className="flex gap-4 justify-center mt-8 border-t border-base-300 pt-6">
      <button onClick={handleDelete} className="btn btn-error btn-outline flex-1">
        🗑 Borrar Canción
      </button>
      <Link href="/utilities/libretadenotas/editar" className="btn btn-warning btn-outline flex-1">
        ✏️ Editar Datos
      </Link>
    </div>
  );
}
