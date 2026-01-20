"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Video } from '@/components/youtube/types';
import { getBlacklist, addWordServer, removeWordServer } from '@/app/actions/filterActions';
import { getHistoryServer, addToHistoryServer, deleteFromHistoryServer } from '@/app/actions/historyActions';

interface YoutubeContextType {
    blacklist: string[];
    history: Video[];
    userPlan: string;
    addToBlacklist: (word: string) => void;
    removeFromBlacklist: (word: string) => void;
    addToHistory: (video: Video) => void;
    removeFromHistory: (videoId: string) => void;
    clearHistory: () => void;
    accessToken: string | null;
    filterAndDislike: (videos: Video[]) => Promise<Video[]>;
}

const YoutubeContext = createContext<YoutubeContextType | undefined>(undefined);

export function YoutubeProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [blacklist, setBlacklist] = useState<string[]>([]);
    const [history, setHistory] = useState<Video[]>([]);
    const [userPlan, setUserPlan] = useState<string>('free');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            // 1. Cargar lo que haya en local por defecto
            const localHist = localStorage.getItem('yt-history');
            if (localHist) setHistory(JSON.parse(localHist));

            if (session?.user?.email) {
                // 2. Traer Blacklist
                const words = await getBlacklist();
                setBlacklist(words);

                // 3. En un caso real, aquí obtendrías el plan desde tu tabla users
                // Por ahora, si quieres probarlo, cambia manualmente este estado a 'pro'
                // setUserPlan('pro'); 

                // 4. Si es Pro, sobreescribir historial local con el de la nube
                const cloudHist = await getHistoryServer();
                if (cloudHist.length > 0) setHistory(cloudHist);
            }
            setIsLoaded(true);
        };
        loadInitialData();
    }, [session]);

    const filterAndDislike = async (videos: Video[]): Promise<Video[]> => {
        if (!blacklist.length) return videos;
        const lowerBlacklist = blacklist.map(w => w.toLowerCase());

        return videos.filter(video => {
            const title = video.title.toLowerCase();
            const desc = video.description.toLowerCase();
            return !lowerBlacklist.some(word => title.includes(word) || desc.includes(word));
        });
    };

    const addToHistory = async (video: Video) => {
        // Actualización de UI (Instantánea)
        setHistory(prev => [video, ...prev.filter(v => v.id !== video.id)].slice(0, 50));

        if (session?.user?.email && userPlan === 'pro') {
            await addToHistoryServer(video);
        } else {
            // Guardado en LocalStorage para Free
            const saved = JSON.parse(localStorage.getItem('yt-history') || '[]');
            const updated = [video, ...saved.filter((v: any) => v.id !== video.id)].slice(0, 50);
            localStorage.setItem('yt-history', JSON.stringify(updated));
        }
    };

    const removeFromHistory = async (videoId: string) => {
        setHistory(prev => prev.filter(v => v.id !== videoId));
        if (session?.user?.email && userPlan === 'pro') {
            await deleteFromHistoryServer(videoId);
        } else {
            const saved = JSON.parse(localStorage.getItem('yt-history') || '[]');
            localStorage.setItem('yt-history', JSON.stringify(saved.filter((v: any) => v.id !== videoId)));
        }
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('yt-history');
        // Para Pro podrías añadir una acción de "borrar todo"
    };

    return (
        <YoutubeContext.Provider value={{
            blacklist, history, userPlan,
            addToBlacklist, removeFromBlacklist,
            addToHistory, removeFromHistory, clearHistory,
            accessToken: (session as any)?.accessToken || null,
            filterAndDislike
        }}>
            {children}
        </YoutubeContext.Provider>
    );
}

export const useYoutube = () => {
    const context = useContext(YoutubeContext);
    if (!context) throw new Error("useYoutube must be used within a YoutubeProvider");
    return context;
};
