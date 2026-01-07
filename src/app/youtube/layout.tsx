import { YoutubeProvider } from '@/context/YoutubeContext';
import SearchHeader from '@/components/youtube/SearchHeader';
import Link from 'next/link';
import { FaCog, FaHistory, FaHome } from 'react-icons/fa';

export default function YoutubeLayout({ children }: { children: React.ReactNode }) {
    return (
        <YoutubeProvider>
            <div className="min-h-screen bg-base-100 p-4 max-w-7xl mx-auto">
                <SearchHeader />
                
                {/* Navegación por pestañas */}
                <div className="flex gap-4 mb-6 border-b border-base-200 pb-2 overflow-x-auto">
                    <Link href="/youtube" className="btn btn-ghost gap-2"><FaHome /> Home</Link>
                    <Link href="/youtube/history" className="btn btn-ghost gap-2"><FaHistory /> History</Link>
                    <Link href="/youtube/config" className="btn btn-ghost gap-2"><FaCog /> Config</Link>
                </div>

                <main>
                    {children}
                </main>
            </div>
        </YoutubeProvider>
    );
}
