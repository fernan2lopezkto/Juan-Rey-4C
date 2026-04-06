"use client";
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

import { Video } from '@/types/youtube-filter';
import { useYoutubeFilter } from '@/context/YoutubeFilterContext';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface PlayerProps {
    video: Video;
    onEnded?: () => void;
}

export default function YoutubePlayer({ video, onEnded }: PlayerProps) {
    const { accessToken, addToHistory } = useYoutubeFilter();

    // EFECTO: Guardar en historial al montar el componente con un nuevo video
    useEffect(() => {
        if (video) {
            addToHistory(video);
        }
    }, [video.id]); // Solo se dispara si cambia el ID del video



    return (
        <div className="space-y-4">
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl relative border-4 border-base-300">
                <ReactPlayer
                    src={`https://www.youtube.com/watch?v=${video.id}`}
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
                </div>
            </div>
        </div>
    );
}
