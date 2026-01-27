"use client";
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { getPopularVideos } from '@/services/youtube';
import { useYoutube } from '@/context/YoutubeContext';
import VideoList from '@/components/youtube/VideoList';
import { Video } from '@/types/youtube';
import AuthPlaceholder from '@/components/AuthPlaceholder';
import SearchHeader from '@/components/youtube/SearchHeader';
import YoutubeNav from '@/components/youtube/YoutubeNav';
import { FaGoogle } from 'react-icons/fa'; // Asegúrate de tener react-icons instalado

export default function YoutubeHome() {
    const { data: session } = useSession();
    const { filterAndDislike, accessToken } = useYoutube();
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Solo intentamos cargar videos si hay sesión Y hay un token de Google
        if (!session || !accessToken) {
            setLoading(false);
            return;
        }

        const fetchPopular = async () => {
            setLoading(true);
            try {
                // @ts-ignore
                const raw = await getPopularVideos(accessToken);
                const filtered = await filterAndDislike(raw);
                setVideos(filtered);
            } catch (err) {
                console.error("Error fetching videos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPopular();
    }, [session, accessToken, filterAndDislike]);

    // 1. Caso: No está logueado en absoluto
    if (!session) {
        return <AuthPlaceholder message="Debes loguearte para usar las funciones de Youtube Kid Filter." />;
    }

    // 2. Caso: Logueado con Email pero sin acceso a YouTube (Google)
    if (session && !accessToken) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8 text-center">
                <div className="alert alert-info max-w-md shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Tu sesión actual no tiene permisos de YouTube. Vincula tu cuenta de Google para continuar.</span>
                </div>
                <button 
                    className="btn btn-primary gap-2"
                    onClick={() => signIn('google', { callbackUrl: '/youtube' })}
                >
                    <FaGoogle /> Vincular con Google
                </button>
            </div>
        );
    }

    // 3. Caso: Todo OK (Sesión + Google Token)
    return (
        <div>
            <SearchHeader />
            <YoutubeNav />
            <h2 className="text-2xl font-bold mt-6 mb-4">Popular Videos</h2>
            
            {loading ? (
                <div className="flex justify-center p-10">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : videos.length > 0 ? (
                <VideoList videos={videos} loading={loading} />
            ) : (
                <div className="text-center p-10 opacity-60">
                    <p>No se encontraron videos o el token expiró. Intenta re-vincular tu cuenta.</p>
                </div>
            )}
        </div>
    );
}
