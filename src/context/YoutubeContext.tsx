"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { rateVideo } from '@/services/youtube'; 
import { Video } from '@/types/youtube';
// Importamos las Server Actions
import { getBlacklist, addWordServer, removeWordServer } from '@/app/actions/filterActions';

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

    // 1. CARGA INICIAL DE DATOS
    useEffect(() => {
        // Historial sigue en LocalStorage (opcional)
        const savedHistory = localStorage.getItem('yt-history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));

        // Blacklist viene de la BD si hay usuario
        if (session?.user?.email) {
            getBlacklist().then(serverWords => {
                setBlacklist(serverWords);
            });
        } else {
            // Si no hay usuario, podrías usar localStorage temporalmente o dejarlo vacío
            const localBlacklist = localStorage.getItem('yt-blacklist');
            if (localBlacklist) setBlacklist(JSON.parse(localBlacklist));
        }
        
        setIsLoaded(true);
    }, [session]);

    // 2. PERSISTENCIA DEL HISTORIAL (Solo historial en local)
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('yt-history', JSON.stringify(history));
            // Si no hay sesión, guardamos blacklist en local por si acaso
            if (!session?.user?.email) {
                localStorage.setItem('yt-blacklist', JSON.stringify(blacklist));
            }
        }
    }, [history, blacklist, isLoaded, session]);

    // 3. AGREGAR PALABRA (Lógica Optimista + Server Action)
    const addToBlacklist = async (word: string) => {
        const cleanWord = word.trim().toLowerCase();
        if (blacklist.includes(cleanWord)) return;

        // Guardamos el estado anterior por si hay error
        const prevBlacklist = [...blacklist];

        // UI Optimista: Actualizamos visualmente YA
        setBlacklist(prev => [...prev, cleanWord]);

        // Si hay usuario logueado, guardamos en DB
        if (session?.user?.email) {
            const response = await addWordServer(cleanWord);
            
            // Si hubo error (ej: Límite PRO alcanzado), revertimos
            if (response?.error) {
                alert(response.error); // Aquí podrías usar un Toast más bonito
                setBlacklist(prevBlacklist); // Revertir cambio visual
            }
        }
    };

    // 4. ELIMINAR PALABRA
    const removeFromBlacklist = async (word: string) => {
        setBlacklist(prev => prev.filter(w => w !== word));
        
        if (session?.user?.email) {
            await removeWordServer(word);
        }
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
