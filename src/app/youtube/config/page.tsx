import FilterConfig from '@/components/youtube/FilterConfig';
import SearchHeader from '@/components/youtube/SearchHeader';
import YoutubeNav from '@/components/youtube/YoutubeNav';

export default function ConfigPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <SearchHeader />
            <YoutubeNav />
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <FilterConfig />
        </div>
    );
}
