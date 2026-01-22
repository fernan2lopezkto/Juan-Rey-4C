export interface Video {
    id: string;
    title: string;
    description?: string;
    thumbnail: string;
    channelTitle?: string | null;
    publishedAt?: string;
}

export type VideoSource = 'search' | 'history' | 'suggestion' | 'popular';
