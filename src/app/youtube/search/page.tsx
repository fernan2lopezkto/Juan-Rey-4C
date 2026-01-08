"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { searchVideos } from '@/services/youtube';
import { useYoutube } from '@/context/YoutubeContext';
import VideoList from '@/components/youtube/VideoList';
import { Video } from '@/types/youtube';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const { data: session } = useSession();
    const { accessToken, filterAndDislike } = useYoutube();

    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query || !accessToken) return;

        const doSearch = async () => {
            setLoading(true);
            try {
                // @ts-ignore
                const results = await searchVideos(query, accessToken);
                const filtered = await filterAndDislike(results);
                setVideos(filtered);
            } catch (error) {
                console.error("Error searching:", error);
            } finally {
                setLoading(false);
            }
        };

        doSearch();
    }, [query, accessToken]); // Se ejecuta cada vez que cambia la query en la URL

    if (!query) return <div className="p-10 text-center opacity-50">Escribe algo para buscar...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Resultados para: <span className="text-primary">{query}</span></h2>
            <VideoList videos={videos} loading={loading} />
        </div>
    );
}

import SearchHeader from '@/components/youtube/SearchHeader';
import YoutubeNav from '@/components/youtube/YoutubeNav';

// Es necesario envolver en Suspense para usar useSearchParams en Next.js
export default function SearchPage() {
    return (
        <div>
            <SearchHeader />
            <YoutubeNav />
            <Suspense fallback={<div className="p-10 text-center">Cargando buscador...</div>}>
                <SearchResults />
            </Suspense>
        </div>
    );
}
