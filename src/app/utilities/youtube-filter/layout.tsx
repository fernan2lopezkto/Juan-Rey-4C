import { YoutubeFilterProvider } from '@/context/YoutubeFilterContext';
import SearchHeader from '@/components/youtube-filter/SearchHeader';
import Link from 'next/link';
import { FaCog, FaHistory, FaHome } from 'react-icons/fa';

export default function YoutubeLayout({ children }: { children: React.ReactNode }) {
    return (
        <YoutubeFilterProvider>
            <div className="min-h-screen bg-base-100 max-w-7xl mx-auto">
                <main>
                    {children}
                </main>
            </div>
        </YoutubeFilterProvider>
    );
}
