"use client";
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { getPopularVideos } from '@/services/youtube';
import { useYoutube } from '@/context/YoutubeContext';
import VideoList from '@/components/youtube/VideoList';
import { Video } from '@/components/youtube/types';
import AuthPlaceholder from '@/components/AuthPlaceholder';
import SearchHeader from '@/components/youtube/SearchHeader';
import YoutubeNav from '@/components/youtube/YoutubeNav';

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
    }, [session, accessToken, filterAndDislike]);

    if (!session) return <AuthPlaceholder message="Debes loguearte para usar las funciones de Youtube Kid Filter." />;

    return (
        <div>
            <SearchHeader />
            <YoutubeNav />
            <h2 className="text-2xl font-bold mb-4">Popular Videos</h2>
            <VideoList videos={videos} loading={loading} />
        </div>
    );
}
