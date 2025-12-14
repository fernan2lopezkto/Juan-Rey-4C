"use client";

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { FaSearch, FaThumbsDown, FaTrash, FaPlus, FaHistory, FaLightbulb } from 'react-icons/fa';
import { searchVideos, rateVideo, getRelatedVideos, getPopularVideos, Video } from '@/services/youtube';

// Import ReactPlayer dynamically to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export default function YoutubeFilter() {
    const { data: session } = useSession();
    const [query, setQuery] = useState('');
    const [videos, setVideos] = useState<Video[]>([]);
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
    const [blacklist, setBlacklist] = useState<string[]>([]);
    const [newFilterWord, setNewFilterWord] = useState('');
    const [loading, setLoading] = useState(false);

    // History & Suggestions State
    const [history, setHistory] = useState<Video[]>([]);
    const [suggestedVideos, setSuggestedVideos] = useState<Video[]>([]);
    const [showHistory, setShowHistory] = useState(false); // Toggle between suggestions and history
    const [isLoaded, setIsLoaded] = useState(false); // Persistence check

    // Load blacklist and history from local storage on mount
    useEffect(() => {
        const savedBlacklist = localStorage.getItem('yt-blacklist');
        if (savedBlacklist) {
            setBlacklist(JSON.parse(savedBlacklist));
        }

        const savedHistory = localStorage.getItem('yt-history');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
        setIsLoaded(true);
    }, []);

    // Save blacklist to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('yt-blacklist', JSON.stringify(blacklist));
        }
    }, [blacklist, isLoaded]);

    // Save history to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('yt-history', JSON.stringify(history));
        }
    }, [history, isLoaded]);

    // Fetch Suggestions (Popular or Related)
    useEffect(() => {
        // User requested to NOT fetch if session is not active to avoid errors
        if (!session) return;

        const fetchSuggestions = async () => {
            // If searching, usually we show search results, but this fills the 'suggestions' bucket

            let results: Video[] = [];

            if (currentVideo) {
                // Watching a video -> Get Related
                // We use a dummy token or real token. The service handles public key fallback if configured or just public access 
                // where possible, but we passed session token usually.
                // For now, assume public search/related works or uses the token if available.
                // Ideally we need an API key if not logged in context, but let's try with what we have.
                // Note: Our service methods normally take a token. If session is null, we might need a fallback.
                // Since we don't have a secure way to hold API Key in env on client without exposing it, 
                // we rely on the implementation in service (which might need attention if it strictly requires token).
                // However, let's pass session token or empty string.
                results = await getRelatedVideos(currentVideo.title, session.accessToken as string);
            } else {
                // Home Screen -> Get Popular
                results = await getPopularVideos(session.accessToken as string);
            }

            // Filter blacklist
            const filtered = results.filter(video => {
                const text = (video.title + ' ' + video.description).toLowerCase();
                return !blacklist.some(word => text.includes(word.toLowerCase()));
            });

            setSuggestedVideos(filtered);
        };

        fetchSuggestions();
    }, [currentVideo, blacklist, session]); // Refetch when context changes


    const addToHistory = (video: Video) => {
        setHistory(prev => {
            const filtered = prev.filter(v => v.id !== video.id);
            return [video, ...filtered].slice(0, 50); // Keep last 50
        });
    };

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!query.trim()) return;

        if (!session?.accessToken) {
            alert('Please sign in to search videos');
            return;
        }

        setLoading(true);
        setShowHistory(false); // Hide history on new search
        try {
            // @ts-ignore
            const results = await searchVideos(query, session.accessToken as string);

            // Filter out videos containing blacklisted words
            const filtered = results.filter(video => {
                const text = (video.title + ' ' + video.description).toLowerCase();
                return !blacklist.some(word => text.includes(word.toLowerCase()));
            });

            setVideos(filtered);
            setCurrentVideo(null); // Reset current video on new search
        } catch (error) {
            console.error(error);
            alert('Error searching videos');
        } finally {
            setLoading(false);
        }
    };

    const handleAddFilter = (e: React.FormEvent) => {
        e.preventDefault();
        if (newFilterWord.trim() && !blacklist.includes(newFilterWord.trim())) {
            setBlacklist([...blacklist, newFilterWord.trim()]);
            setNewFilterWord('');
        }
    };

    const handleRemoveFilter = (word: string) => {
        setBlacklist(blacklist.filter(w => w !== word));
    };

    const handleDislike = async (videoId: string) => {
        if (!session?.accessToken) return;
        try {
            // @ts-ignore
            await rateVideo(videoId, 'dislike', session.accessToken as string);
            alert('Marked as not interested (Disliked)');
        } catch (error) {
            alert('Error rating video');
        }
    };

    const handleVideoSelect = (video: Video) => {
        setCurrentVideo(video);
        addToHistory(video);
        // setVideos([]); // Removed to allow search results to persist
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const removeHistoryItem = (e: React.MouseEvent, videoId: string) => {
        e.stopPropagation();
        setHistory(prev => prev.filter(v => v.id !== videoId));
    };

    const toggleHistory = () => {
        setShowHistory(!showHistory);
    };

    // Helper to render a list of videos
    const renderVideoList = (videoList: Video[], isHistory = false) => (
        <div className="space-y-4">
            {videoList.map(video => (
                <div
                    key={video.id}
                    className={`flex gap-3 p-2 rounded-lg cursor-pointer hover:bg-base-200 transition-colors ${currentVideo?.id === video.id ? 'bg-base-200 ring-1 ring-primary' : ''} ${isHistory ? 'opacity-90 hover:opacity-100' : ''}`}
                    onClick={() => handleVideoSelect(video)}
                >
                    <div className="relative w-40 flex-shrink-0 aspect-video rounded-lg overflow-hidden">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        {isHistory && <div className="absolute top-1 right-1 badge badge-xs badge-secondary">Viewed</div>}
                    </div>
                    <div className="flex-1 min-w-0 relative">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-base-content">{video.title}</h3>
                        <p className="text-xs text-base-content/60">{video.channelTitle}</p>

                        {isHistory && (
                            <button
                                onClick={(e) => removeHistoryItem(e, video.id)}
                                className="absolute bottom-0 right-0 btn btn-ghost btn-xs text-error"
                                title="Remove from history"
                            >
                                <FaTrash />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-base-100 p-4">
            {/* Search and Header */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
                <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
                    <span className="text-error">You</span>Tube Filter
                </h1>

                <form onSubmit={handleSearch} className="flex-1 max-w-2xl w-full flex gap-2">
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type='submit' className="btn btn-primary">
                        <FaSearch />
                    </button>
                    {/* View History Toggle (Replaces Mobile-only toggle) */}
                    <button
                        type="button"
                        className={`btn btn-circle btn-ghost duration-200 ${showHistory ? 'text-primary' : ''}`}
                        onClick={toggleHistory}
                        title={showHistory ? "Show Suggestions" : "Show History"}
                    >
                        {showHistory ? <FaHistory /> : <FaHistory className="opacity-50" />}
                    </button>
                </form>

                {!session && (
                    <button onClick={() => signIn("google")} className="btn btn-outline">
                        Sign In
                    </button>
                )}
            </div>

            {/* Filter Settings (Collapsible) */}
            <div className="collapse collapse-arrow bg-base-200 mb-6">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium">
                    Filter Settings ({blacklist.length} words)
                </div>
                <div className="collapse-content">
                    <form onSubmit={handleAddFilter} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            className="input input-sm input-bordered"
                            placeholder="Block word..."
                            value={newFilterWord}
                            onChange={(e) => setNewFilterWord(e.target.value)}
                        />
                        <button type="submit" className="btn btn-sm btn-secondary">
                            <FaPlus /> Agregar
                        </button>
                    </form>
                    <div className="flex flex-wrap gap-2">
                        {blacklist.map(word => (
                            <div key={word} className="badge badge-error gap-2 p-3">
                                {word}
                                <FaTrash className="cursor-pointer" onClick={() => handleRemoveFilter(word)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {currentVideo ? (
                    /* WATCHING MODE */
                    <>
                        {/* Player Section (Left/Top) */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg relative wrapper-player">
                                <ReactPlayer
                                    src={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                                    width="100%"
                                    height="100%"
                                    controls={true}
                                    playing={true}
                                />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-base-content">{currentVideo.title}</h2>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm opacity-70">{currentVideo.channelTitle}</span>
                                    <button
                                        className="btn btn-sm btn-ghost text-error gap-2 hint--top"
                                        aria-label="No me interesa"
                                        onClick={() => handleDislike(currentVideo.id)}
                                    >
                                        <FaThumbsDown /> Not Interested
                                    </button>
                                </div>
                                <p className="text-sm text-base-content/80 bg-base-200 p-4 rounded-lg">
                                    {currentVideo.description}
                                </p>
                            </div>

                            {/* Suggestions or History BELOW Player */}
                            <div className="pt-6 border-t border-base-300">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    {showHistory ? <><FaHistory /> Watch History</> : <><FaLightbulb /> You might also like</>}
                                </h3>
                                {showHistory ?
                                    (history.length > 0 ? renderVideoList(history, true) : <p className="opacity-50">History is empty.</p>)
                                    :
                                    (suggestedVideos.length > 0 ? renderVideoList(suggestedVideos) : <p className="opacity-50">Loading suggestions...</p>)
                                }
                            </div>
                        </div>

                        {/* Search Results (Right/Bottom) */}
                        <div className="lg:col-span-1 space-y-4">
                            {/* Keep showing search results if available, otherwise maybe more suggestions? 
                                 Original behavior: Search results stay here.
                             */}
                            {loading ? (
                                <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg"></span></div>
                            ) : videos.length > 0 ? (
                                <>
                                    <h3 className="font-bold text-lg mb-2">Search Results</h3>
                                    {renderVideoList(videos)}
                                </>
                            ) : (
                                <div className="text-center opacity-50 py-10">
                                    {/* Empty space next to video if no search */}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* NOT WATCHING MODE (HOME) */
                    <div className="lg:col-span-3">

                        {/* Main Content: Search Results OR (Suggestions/History) */}
                        {loading ? (
                            <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg"></span></div>
                        ) : videos.length > 0 ? (
                            <div className="w-full">
                                <h3 className="font-bold text-lg mb-4">Search Results</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {videos.map(video => (
                                        <div
                                            key={video.id}
                                            className="flex flex-col gap-2 p-2 rounded-lg cursor-pointer hover:bg-base-200 transition-colors"
                                            onClick={() => handleVideoSelect(video)}
                                        >
                                            <div className="aspect-video rounded-lg overflow-hidden bg-black">
                                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-base-content">{video.title}</h3>
                                                <p className="text-xs text-base-content/60">{video.channelTitle}</p>
                                                <p className="text-xs text-base-content/60">{new Date(video.publishedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Default State: Show Suggestions OR History based on Toggle */
                            <div className="w-full">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    {showHistory ? <><FaHistory /> Your Watch History</> : <><FaLightbulb /> Suggested for you</>}
                                </h2>

                                {showHistory ? (
                                    history.length > 0 ? renderVideoList(history, true) : <p className="opacity-50">Your history is empty.</p>
                                ) : (
                                    suggestedVideos.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {/* Reuse grid for suggestions */}
                                            {suggestedVideos.map(video => (
                                                <div
                                                    key={video.id}
                                                    className="flex flex-col gap-2 p-2 rounded-lg cursor-pointer hover:bg-base-200 transition-colors"
                                                    onClick={() => handleVideoSelect(video)}
                                                >
                                                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-base-content">{video.title}</h3>
                                                        <p className="text-xs text-base-content/60">{video.channelTitle}</p>
                                                        <p className="text-xs text-base-content/60">{new Date(video.publishedAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center opacity-50 py-10">
                                            <span className="loading loading-spinner text-primary"></span> Loading suggestions...
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}