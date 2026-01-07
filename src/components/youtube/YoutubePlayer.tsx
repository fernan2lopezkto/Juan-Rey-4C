"use client";
import dynamic from 'next/dynamic';
import { FaThumbsDown } from 'react-icons/fa';
import { Video } from '@/types/youtube';
import { useYoutube } from '@/context/YoutubeContext';
import { rateVideo } from '@/services/youtube';

// Importación dinámica para evitar errores de SSR
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface PlayerProps {
    video: Video;
    onEnded?: () => void;
}

export default function YoutubePlayer({ video, onEnded }: PlayerProps) {
    const { accessToken } = useYoutube();

    const handleDislike = async () => {
        if (!accessToken) return alert("Inicia sesión para usar esto");
        try {
            await rateVideo(video.id, 'dislike', accessToken);
            alert('Marked as not interested (Disliked)');
        } catch (error) {
            console.error(error);
            alert('Error rating video');
        }
    };

    return (
        <div className="space-y-4">
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg relative wrapper-player">
                <ReactPlayer
                    src={`https://www.youtube.com/watch?v=${video.id}`}
                    width="100%"
                    height="100%"
                    controls={true}
                    playing={true}
                    onEnded={onEnded}
                />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-bold text-base-content">{video.title}</h2>
                <div className="flex justify-between items-center">
                    <span className="text-sm opacity-70">{video.channelTitle}</span>
                    <button
                        className="btn btn-sm btn-ghost text-error gap-2"
                        onClick={handleDislike}
                    >
                        <FaThumbsDown /> Not Interested
                    </button>
                </div>
                <p className="text-sm text-base-content/80 bg-base-200 p-4 rounded-lg whitespace-pre-wrap">
                    {video.description}
                </p>
            </div>
        </div>
    );
}
