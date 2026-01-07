"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { rateVideo } from '@/services/youtube'; // Tu servicio actual
import { Video } from '@/types/youtube';

interface YoutubeContextType {
    blacklist: string[];
    history: Video[];
    addToBlacklist: (word: string) => void;
    removeFromBlacklist: (word: string) => void;
    addToHistory: (video: Video) => void;
    removeFromHistory: (videoId: string) => void;
    clearHistory: () => void;
    filterAndDislike: (rawVideos: Video[]) => Promise<Video[]>;
    accessToken: string | null;
}

const YoutubeContext = createContext<YoutubeContextType | undefined>(undefined);

export function YoutubeProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [blacklist, setBlacklist] = useState<string[]>([]);
    const [history, setHistory] = useState<Video[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Cargar datos al inicio
    useEffect(() => {
        const savedBlacklist = localStorage.getItem('yt-blacklist');
        const savedHistory = localStorage.getItem('yt-history');
        if (savedBlacklist) setBlacklist(JSON.parse(savedBlacklist));
        if (savedHistory) setHistory(JSON.parse(savedHistory));
        setIsLoaded(true);
    }, []);

    // Persistir datos
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('yt-blacklist', JSON.stringify(blacklist));
            localStorage.setItem('yt-history', JSON.stringify(history));
        }
    }, [blacklist, history, isLoaded]);

    const addToBlacklist = (word: string) => {
        if (!blacklist.includes(word)) setBlacklist([...blacklist, word]);
    };

    const removeFromBlacklist = (word: string) => {
        setBlacklist(blacklist.filter(w => w !== word));
    };

    const addToHistory = (video: Video) => {
        setHistory(prev => {
            const filtered = prev.filter(v => v.id !== video.id);
            return [video, ...filtered].slice(0, 50);
        });
    };

    const removeFromHistory = (videoId: string) => {
        setHistory(prev => prev.filter(v => v.id !== videoId));
    };
    
    const clearHistory = () => setHistory([]);

    const filterAndDislike = async (rawVideos: Video[]): Promise<Video[]> => {
        const allowed: Video[] = [];
        const toDislike: string[] = [];

        for (const video of rawVideos) {
            const text = (video.title + ' ' + video.description).toLowerCase();
            const isBlacklisted = blacklist.some(word => text.includes(word.toLowerCase()));

            if (isBlacklisted) {
                toDislike.push(video.id);
            } else {
                allowed.push(video);
            }
        }

        // Auto-dislike en segundo plano
        // @ts-ignore
        if (toDislike.length > 0 && session?.accessToken) {
             Promise.all(toDislike.map(id =>
                // @ts-ignore
                rateVideo(id, 'dislike', session.accessToken as string).catch(e => console.error(`Error disliking ${id}`, e))
            ));
        }
        return allowed;
    };

    return (
        <YoutubeContext.Provider value={{
            blacklist,
            history,
            addToBlacklist,
            removeFromBlacklist,
            addToHistory,
            removeFromHistory,
            clearHistory,
            filterAndDislike,
            // @ts-ignore
            accessToken: session?.accessToken as string || null
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
