import FilterConfig from '@/components/youtube-filter/FilterConfig';
import SearchHeader from '@/components/youtube-filter/SearchHeader';
import YoutubeNav from '@/components/youtube-filter/YoutubeNav';

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
