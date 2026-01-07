"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getVideoDetails, getRelatedVideos } from '@/services/youtube'; // Asegúrate de tener getVideoDetails
import { useYoutube } from '@/context/YoutubeContext';
import YoutubePlayer from '@/components/youtube/YoutubePlayer';
import VideoList from '@/components/youtube/VideoList';
import { Video } from '@/types/youtube';

export default function WatchPage() {
    const params = useParams();
    const videoId = params.id as string;
    const { accessToken, addToHistory, filterAndDislike } = useYoutube();
    const [video, setVideo] = useState<Video | null>(null);
    const [related, setRelated] = useState<Video[]>([]);

    useEffect(() => {
        if (!videoId || !accessToken) return;

        const loadData = async () => {
            // 1. Obtener detalles del video actual (necesitas crear esta funcion en tu service o reusar search)
            // Esto es un placeholder, deberías implementar getVideoDetailsById en tu servicio
            // const current = await getVideoDetailsById(videoId, accessToken); 
            // setVideo(current);
            // addToHistory(current);

            // 2. Obtener relacionados
            // const rawRelated = await getRelatedVideos(current.title, accessToken);
            // setRelated(await filterAndDislike(rawRelated));
        };
        
        // loadData(); 
        // Nota para Fernan: Como getVideoDetails no estaba en tu snippet original, 
        // aquí tendrás que implementarlo o pasar la data completa por estado global.
        // Lo ideal es hacer un fetch al endpoint 'videos' de la API de youtube con el ID.
    }, [videoId, accessToken]);

    if (!video) return <div>Loading player... (Implementa getVideoDetails en tu servicio)</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <YoutubePlayer video={video} />
            </div>
            <div className="lg:col-span-1">
                <h3 className="font-bold text-lg mb-4">Related Videos</h3>
                <VideoList videos={related} />
            </div>
        </div>
    );
}
