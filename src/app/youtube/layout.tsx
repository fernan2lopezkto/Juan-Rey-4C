import { YoutubeProvider } from '@/context/YoutubeContext';
import SearchHeader from '@/components/youtube/SearchHeader';
import Link from 'next/link';
import { FaCog, FaHistory, FaHome } from 'react-icons/fa';

export default function YoutubeLayout({ children }: { children: React.ReactNode }) {
    return (
        <YoutubeProvider>
            <div className="min-h-screen bg-base-100 p-4 max-w-7xl mx-auto">
                <main>
                    {children}
                </main>
            </div>
        </YoutubeProvider>
    );
}
