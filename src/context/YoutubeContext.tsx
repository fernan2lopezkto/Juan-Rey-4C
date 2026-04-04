"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Video } from '@/types/youtube';
import { getBlacklist, addWordServer, removeWordServer } from '@/app/actions/filterActions';
import { 
    getHistoryServer, 
    addToHistoryServer, 
    deleteFromHistoryServer, 
    clearHistoryServer
} from '@/app/actions/historyActions';
import { getUserPlan } from '@/app/actions/userActions'; // Importa la nueva acción

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
            // 1. Cargar historial local por defecto
            const localHist = localStorage.getItem('yt-history');
            if (localHist) setHistory(JSON.parse(localHist));

            if (session?.user?.email) {
                try {
                    // 2. Obtener el plan real del usuario desde la DB
                    const plan = await getUserPlan();
                    setUserPlan(plan);

                    // 3. Traer Blacklist
                    const words = await getBlacklist();
                    setBlacklist(words);

                    // 4. Si es Pro, cargar historial de la nube
                    if (plan === 'pro') {
                        const cloudHist = await getHistoryServer();
                        if (cloudHist && cloudHist.length > 0) {
                            setHistory(cloudHist);
                        }
                    }
                } catch (error) {
                    console.error("Error cargando datos de usuario:", error);
                }
            } else {
                // Si cierra sesión, volvemos a free y limpiamos estados
                setUserPlan('free');
                setBlacklist([]);
            }
            setIsLoaded(true);
        };
        loadInitialData();
    }, [session]);

    const filterAndDislike = async (videos: Video[]): Promise<Video[]> => {
        if (!blacklist.length) return videos;
        const lowerBlacklist = blacklist.map(w => w.toLowerCase());

        const allowedVideos: Video[] = [];
        const blockedVideos: Video[] = [];

        videos.forEach(video => {
            const title = video.title.toLowerCase();
            const desc = (video.description || '').toLowerCase();
            if (lowerBlacklist.some(word => title.includes(word) || desc.includes(word))) {
                blockedVideos.push(video);
            } else {
                allowedVideos.push(video);
            }
        });

        // Manejar sistema de dislikes controlados (anti-spam)
        if (blockedVideos.length > 0 || localStorage.getItem('yt-pending-dislikes')) {
            const pendingRaw = localStorage.getItem('yt-pending-dislikes');
            let pending: Video[] = pendingRaw ? JSON.parse(pendingRaw) : [];

            // Añadir nuevos bloqueados que no estén en la cola
            blockedVideos.forEach(bv => {
                if (!pending.find(p => p.id === bv.id)) {
                    pending.push(bv);
                }
            });

            // Procesar un solo dislike por ejecución
            if (pending.length > 0 && (session as any)?.accessToken) {
                const videoToDislike = pending.shift(); // Saca el primero
                if (videoToDislike) {
                    try {
                        const { rateVideo } = await import('@/services/youtube');
                        await rateVideo(videoToDislike.id, 'dislike', (session as any).accessToken);
                        console.log(`[Filtro Anti-Spam] Dislike aplicado a: ${videoToDislike.title}`);
                    } catch (error) {
                        console.error("Error al aplicar dislike", error);
                    }
                }
            }

            // Guardar el resto de la cola
            localStorage.setItem('yt-pending-dislikes', JSON.stringify(pending));
        }

        return allowedVideos;
    };

    const addToHistory = async (video: Video) => {
        // Actualización optimista de la UI
        setHistory(prev => [video, ...prev.filter(v => v.id !== (video.id || (video as any).videoId))].slice(0, 50));

        if (session?.user?.email && userPlan === 'pro') {
            // Guardar en Postgres si es PRO
            await addToHistoryServer(video);
        } else {
            // Guardado en LocalStorage para Free
            const saved = JSON.parse(localStorage.getItem('yt-history') || '[]');
            const updated = [video, ...saved.filter((v: any) => (v.id || v.videoId) !== (video.id || (video as any).videoId))].slice(0, 50);
            localStorage.setItem('yt-history', JSON.stringify(updated));
        }
    };

    const removeFromHistory = async (videoId: string) => {
        setHistory(prev => prev.filter(v => (v.id || (v as any).videoId) !== videoId));
        
        if (session?.user?.email && userPlan === 'pro') {
            await deleteFromHistoryServer(videoId);
        } else {
            const saved = JSON.parse(localStorage.getItem('yt-history') || '[]');
            const filtered = saved.filter((v: any) => (v.id || v.videoId) !== videoId);
            localStorage.setItem('yt-history', JSON.stringify(filtered));
        }
    };

const clearHistory = async () => {
    // 1. Limpiar UI instantáneamente
    setHistory([]);
    
    // 2. Limpiar LocalStorage siempre (por si acaso)
    localStorage.removeItem('yt-history');

    // 3. Limpiar Nube si es Pro
    if (session?.user?.email && userPlan === 'pro') {
        try {
            await clearHistoryServer();
        } catch (error) {
            console.error("Error al borrar historial en la nube:", error);
        }
    }
};

    const addToBlacklist = async (word: string) => {
        const normalizedWord = word.trim().toLowerCase();
        if (!normalizedWord || blacklist.includes(normalizedWord)) return;
        
        setBlacklist(prev => [...prev, normalizedWord]);

        if (session?.user?.email) {
            const res = await addWordServer(normalizedWord);
            if (res?.error) {
                setBlacklist(prev => prev.filter(w => w !== normalizedWord));
                alert(res.error);
            }
        }
    };

    const removeFromBlacklist = async (word: string) => {
        setBlacklist(prev => prev.filter(w => w !== word));
        if (session?.user?.email) {
            await removeWordServer(word);
        }
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
