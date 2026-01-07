"use client";

import { useYoutube } from '@/context/YoutubeContext';
import VideoList from '@/components/youtube/VideoList';
import { FaTrash } from 'react-icons/fa';

export default function HistoryPage() {
    const { history, removeFromHistory, clearHistory } = useYoutube();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Historial de Reproducción</h2>
                {history.length > 0 && (
                    <button 
                        onClick={clearHistory} 
                        className="btn btn-sm btn-outline btn-error gap-2"
                    >
                        <FaTrash /> Borrar Todo
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <div className="text-center py-20 opacity-50 bg-base-200 rounded-xl">
                    <p className="text-xl">No has visto ningún video aún.</p>
                    <p className="text-sm">Tus videos vistos aparecerán aquí.</p>
                </div>
            ) : (
                <VideoList 
                    videos={history} 
                    onRemove={removeFromHistory} 
                />
            )}
        </div>
    );
}
