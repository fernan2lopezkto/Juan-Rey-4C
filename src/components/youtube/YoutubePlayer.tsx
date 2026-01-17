"use client";
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FaThumbsDown } from 'react-icons/fa';
import { Video } from '@/types/youtube';
import { useYoutube } from '@/context/YoutubeContext';
import { rateVideo } from '@/services/youtube';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface PlayerProps {
    video: Video;
    onEnded?: () => void;
}

export default function YoutubePlayer({ video, onEnded }: PlayerProps) {
    const { accessToken, addToHistory } = useYoutube();

    // EFECTO: Guardar en historial al montar el componente con un nuevo video
    useEffect(() => {
        if (video) {
            addToHistory(video);
        }
    }, [video.id]); // Solo se dispara si cambia el ID del video

    const handleDislike = async () => {
        if (!accessToken) return alert("Inicia sesión para usar esto");
        try {
            await rateVideo(video.id, 'dislike', accessToken);
            alert('Video descartado del algoritmo');
        } catch (error) {
            alert('Error al calificar');
        }
    };

    return (
        <div className="space-y-4">
            <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl relative border-4 border-base-300">
                <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${video.id}`}
                    width="100%"
                    height="100%"
                    controls={true}
                    playing={true}
                    onEnded={onEnded}
                />
            </div>
            <div className="p-2">
                <h2 className="text-2xl font-black text-base-content leading-tight mb-2">{video.title}</h2>
                <div className="flex justify-between items-center bg-base-200 p-4 rounded-2xl">
                    <span className="font-bold opacity-60 text-sm">{video.channelTitle}</span>
                    <button className="btn btn-error btn-sm rounded-xl gap-2" onClick={handleDislike}>
                        <FaThumbsDown /> Not Interested
                    </button>
                </div>
            </div>
        </div>
    );
}
