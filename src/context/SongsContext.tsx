"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Song } from '@/types/notebook';
import { 
  getSongs as getLocalSongs, 
  saveSong as saveLocalSong, 
  updateSong as updateLocalSong, 
  deleteSong as deleteLocalSong,
  saveCurrentSongId,
  getCurrentSongId
} from '@/components/libretaDeNotas/storage';
import { getUserPlan } from '@/app/actions/userActions';
import { 
  getSongsServer, 
  syncSongServer, 
  deleteSongServer 
} from '@/app/actions/songActions';

interface SongsContextType {
    songs: Song[];
    currentSong: Song | null;
    userPlan: string;
    loading: boolean;
    saveSong: (song: Omit<Song, 'id' | 'date'>) => Promise<void>;
    updateSong: (id: string, song: Omit<Song, 'id' | 'date'>) => Promise<void>;
    deleteSong: (id: string) => Promise<void>;
    setCurrentSongById: (id: string) => void;
    refreshSongs: () => Promise<void>;
}

const SongsContext = createContext<SongsContextType | undefined>(undefined);

export function SongsProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [songs, setSongs] = useState<Song[]>([]);
    const [userPlan, setUserPlan] = useState<string>('free');
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);

    // 1. Carga inicial de datos
    useEffect(() => {
        const loadSongs = async () => {
            setLoading(true);
            
            // Carga inicial desde LocalStorage (rápido)
            const local = getLocalSongs();
            setSongs(local);

            if (session?.user?.email) {
                const plan = await getUserPlan();
                setUserPlan(plan);

                if (plan === 'pro') {
                    const cloudSongs = await getSongsServer();
                    if (cloudSongs.length > 0) setSongs(cloudSongs);
                }
            }
            setLoading(false);
        };
        loadSongs();
    }, [session]);

    // 2. Manejo de la canción activa para la vista de detalle
    const setCurrentSongById = (id: string) => {
        const song = songs.find(s => s.id === id) || null;
        setCurrentSong(song);
        if (id) saveCurrentSongId(id);
    };

    // 3. Guardar nueva canción
    const saveSong = async (songInput: Omit<Song, 'id' | 'date'>) => {
        const newSong: Song = {
            ...songInput,
            id: crypto.randomUUID(),
            date: new Date().toLocaleDateString()
        };

        // Actualizar UI
        setSongs(prev => [newSong, ...prev]);

        if (session?.user?.email && userPlan === 'pro') {
            await syncSongServer(newSong);
        } else {
            saveLocalSong(newSong);
        }
    };

    // 4. Actualizar canción existente
    const updateSong = async (id: string, songInput: Omit<Song, 'id' | 'date'>) => {
        const updatedSong: Song = {
            ...songInput,
            id,
            date: new Date().toLocaleDateString()
        };

        setSongs(prev => prev.map(s => s.id === id ? updatedSong : s));

        if (session?.user?.email && userPlan === 'pro') {
            await syncSongServer(updatedSong);
        } else {
            updateLocalSong(updatedSong);
        }
    };

    // 5. Eliminar canción
    const deleteSong = async (id: string) => {
        setSongs(prev => prev.filter(s => s.id !== id));

        if (session?.user?.email && userPlan === 'pro') {
            await deleteSongServer(id);
        } else {
            deleteLocalSong(id);
        }
    };

    const refreshSongs = async () => {
        if (session?.user?.email && userPlan === 'pro') {
            const res = await getSongsServer();
            setSongs(res);
        } else {
            setSongs(getLocalSongs());
        }
    };

    return (
        <SongsContext.Provider value={{
            songs, currentSong, userPlan, loading,
            saveSong, updateSong, deleteSong,
            setCurrentSongById, refreshSongs
        }}>
            {children}
        </SongsContext.Provider>
    );
}

export const useSongs = () => {
    const context = useContext(SongsContext);
    if (!context) throw new Error("useSongs debe usarse dentro de un SongsProvider");
    return context;
};
