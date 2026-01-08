"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getVideoDetails, getRelatedVideos } from '@/services/youtube';
import { useYoutube } from '@/context/YoutubeContext';
import YoutubePlayer from '@/components/youtube/YoutubePlayer';
import AuthPlaceholder from '@/components/AuthPlaceholder'; // Assuming generic auth guard might be needed or just components
import SearchHeader from '@/components/youtube/SearchHeader';
import YoutubeNav from '@/components/youtube/YoutubeNav';
import VideoList from '@/components/youtube/VideoList';
import { Video } from '@/types/youtube';

export default function WatchPage() {
    const params = useParams();
    const videoId = params.id as string;
    const { accessToken, addToHistory, filterAndDislike } = useYoutube();

    const [video, setVideo] = useState<Video | null>(null);
    const [related, setRelated] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Necesitamos el ID y el Token para poder pedir la info a Google
        if (!videoId || !accessToken) return;

        const loadVideoData = async () => {
            setLoading(true);
            try {
                // 1. Traer detalles del video actual
                const currentVideo = await getVideoDetails(videoId, accessToken);
                setVideo(currentVideo);
                addToHistory(currentVideo); // Guardar en historial automáticamente

                // 2. Traer videos relacionados (usando el título para buscar similares)
                const rawRelated = await getRelatedVideos(currentVideo.title, accessToken);
                const filtered = await filterAndDislike(rawRelated);
                setRelated(filtered);
            } catch (err) {
                console.error("Error cargando video:", err);
            } finally {
                setLoading(false);
            }
        };

        loadVideoData();
    }, [videoId, accessToken]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <span className="loading loading-ring loading-lg text-primary"></span>
            <p className="mt-4 opacity-70">Cargando video...</p>
        </div>
    );

    if (!video) return <div className="alert alert-error">No se pudo cargar el video. Revisa tu conexión o sesión.</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-min">
            {/* Search - Mobile: 1, Desktop: Right Col 1 */}
            <div className="lg:col-start-3 lg:row-start-1">
                <SearchHeader />
            </div>

            {/* Nav - Mobile: 2, Desktop: Right Col 2 */}
            <div className="lg:col-start-3 lg:row-start-2">
                <YoutubeNav />
            </div>

            {/* Video - Mobile: 3 (Sticky), Desktop: Left Col (Span 2 cols, 3 rows) */}
            <div className="sticky top-0 z-50 bg-base-100 lg:static lg:bg-transparent lg:col-span-2 lg:row-span-3 lg:col-start-1 lg:row-start-1">
                <YoutubePlayer
                    video={video}
                    onEnded={() => {
                        // Play 5th related video (index 4) if available
                        if (related.length > 4) {
                            window.location.href = `/youtube/watch/${related[4].id}`;
                        } else if (related.length > 0) {
                            // Fallback to first if less than 5
                            window.location.href = `/youtube/watch/${related[0].id}`;
                        }
                    }}
                />
            </div>

            {/* Related - Mobile: 4, Desktop: Right Col 3 */}
            <div className="lg:col-start-3 lg:row-start-3 lg:max-h-screen lg:overflow-y-auto pr-1">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    Videos Relacionados
                </h3>
                <VideoList videos={related} />
            </div>
        </div>
    );
}
