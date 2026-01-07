"use client";
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { Video } from '@/types/youtube';

interface VideoListProps {
    videos: Video[];
    onRemove?: (id: string) => void; // Opcional, solo para historial
    loading?: boolean;
}

export default function VideoList({ videos, onRemove, loading }: VideoListProps) {
    const router = useRouter();

    const handleSelect = (video: Video) => {
        // Al hacer click, navegamos a la subruta de reproducción
        // Pasamos datos básicos por query params para carga instantánea o confiamos en fetch por ID
        // Aquí simplificamos yendo a la ruta /watch
        router.push(`/youtube/watch/${video.id}`);
    };

    if (loading) return <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg"></span></div>;
    if (videos.length === 0) return <div className="text-center opacity-50 py-10">No videos found.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map(video => (
                <div
                    key={video.id}
                    className="group relative flex flex-col gap-2 p-3 rounded-xl cursor-pointer hover:bg-base-200 transition-all border border-transparent hover:border-base-300"
                    onClick={() => handleSelect(video)}
                >
                    <div className="aspect-video rounded-lg overflow-hidden bg-black relative">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-base-content leading-tight">{video.title}</h3>
                        <p className="text-xs text-base-content/60">{video.channelTitle}</p>
                    </div>

                    {onRemove && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(video.id); }}
                            className="absolute top-2 right-2 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove"
                        >
                            <FaTrash size={10} />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
