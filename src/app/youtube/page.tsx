"use client";
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { getPopularVideos } from '@/services/youtube';
import { useYoutube } from '@/context/YoutubeContext';
import VideoList from '@/components/youtube/VideoList';
import { Video } from '@/types/youtube';

export default function YoutubeHome() {
    const { data: session } = useSession();
    const { filterAndDislike, accessToken } = useYoutube();
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session) return;
        const fetchPopular = async () => {
            setLoading(true);
            try {
                // @ts-ignore
                const raw = await getPopularVideos(accessToken);
                const filtered = await filterAndDislike(raw);
                setVideos(filtered);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPopular();
    }, [session, accessToken, filterAndDislike]); // Nota: filterAndDislike debe ser estable o usar useCallback en Context

    if (!session) return <div className="text-center mt-10"><button className="btn btn-primary" onClick={() => signIn('google')}>Iniciar Sesión con Google</button></div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Popular Videos</h2>
            <VideoList videos={videos} loading={loading} />
        </div>
    );
}
