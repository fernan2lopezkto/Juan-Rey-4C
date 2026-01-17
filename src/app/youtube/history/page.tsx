"use client";
import { useYoutube } from '@/context/YoutubeContext';
import VideoList from '@/components/youtube/VideoList';
import { FaTrash, FaCloud, FaHdd } from 'react-icons/fa';
import SearchHeader from '@/components/youtube/SearchHeader';
import YoutubeNav from '@/components/youtube/YoutubeNav';

export default function HistoryPage() {
    const { history, removeFromHistory, clearHistory, userPlan } = useYoutube();

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <SearchHeader />
            <YoutubeNav />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-4">
                <div>
                    <h2 className="text-3xl font-black">Tu Historial</h2>
                    <div className="flex items-center gap-2 mt-1">
                        {userPlan === 'pro' ? (
                            <span className="badge badge-primary badge-sm gap-1"><FaCloud size={10}/> Sincronizado en la nube</span>
                        ) : (
                            <span className="badge badge-ghost badge-sm gap-1 opacity-50"><FaHdd size={10}/> Solo en este dispositivo (Free)</span>
                        )}
                    </div>
                </div>
                
                {history.length > 0 && (
                    <button onClick={clearHistory} className="btn btn-error btn-outline btn-sm rounded-xl">
                        <FaTrash /> Limpiar Historial
                    </button>
                )}
            </div>

            <div className="px-4">
                {history.length === 0 ? (
                    <div className="text-center py-32 bg-base-200 rounded-[3rem] border-2 border-dashed border-base-300">
                        <p className="text-2xl font-bold opacity-20">HISTORIAL VACÍO</p>
                    </div>
                ) : (
                    <VideoList videos={history} onRemove={removeFromHistory} />
                )}
            </div>
        </div>
    );
}
