
export interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
}

export async function searchVideos(query: string, token: string): Promise<Video[]> {
    const params = new URLSearchParams({
        part: 'snippet',
        maxResults: '50',
        q: query,
        type: 'video',
        key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '', // Fallback, but we should use access token for user actions ideally, or API key for public search
    });

    // If we have a token, we might want to use it, but for simple search API key is often enough unless it's private. 
    // However, rateVideo REQUIRES token.
    // Let's us the API key for search to save user quota if possible, or just standard search.
    // Actually, standard search list is public data.

    // Note: Standard approach for pure client-side is often apiKey. 
    // With token, we can do 'mine' searches.
    // Here we just want general search.
    // WE MUST SEND THE TOKEN IN HEADER if we want to attribute to user, but search is public.
    // Let's try standard fetch.

    // IMPORTANT: For simplicity in this demo, we will assume the user provides an API Key env var for search 
    // OR we use the user's token if we want. 
    // Google API often requires API Key even with token for project identification.
    // Let's rely on token for authentication and project ID from implicit setup if possible, 
    // or add a public key if needed. 
    // Given user didn't mention adding an API Key, we will try to use the accessToken for the search as well to keep it simple.

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        console.error('YouTube Search Error', await response.text());
        return [];
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
    }));
}

export async function getRelatedVideos(videoTitle: string, token: string): Promise<Video[]> {
    const params = new URLSearchParams({
        part: 'snippet',
        maxResults: '100',
        q: videoTitle, // Search for the video title to find related/similar content
        type: 'video',
        key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
    });

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            console.error('YouTube Related Videos Error', await response.text());
            return [];
        }

        const data = await response.json();
        return data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
        }));
    } catch (error) {
        console.error("Failed to fetch related videos", error);
        return [];
    }
}

export async function getPopularVideos(token: string): Promise<Video[]> {
    const params = new URLSearchParams({
        part: 'snippet',
        chart: 'mostPopular',
        maxResults: '100',
        regionCode: 'US', // Default to US or make dynamic if needed
        key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
    });

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            console.error('YouTube Popular Videos Error', await response.text());
            return [];
        }

        const data = await response.json();
        return data.items.map((item: any) => ({
            id: item.id, // For videos endpoint, id is a string, not nested
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
        }));
    } catch (error) {
        console.error("Failed to fetch popular videos", error);
        return [];
    }
}

export async function rateVideo(id: string, rating: 'like' | 'dislike' | 'none', token: string) {
    const params = new URLSearchParams({
        id: id,
        rating: rating,
    });

    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos/rate?${params.toString()}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        console.error('YouTube Rate Error', await response.text());
        throw new Error('Failed to rate video');
    }
}
