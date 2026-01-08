export interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
}

export type VideoSource = 'search' | 'history' | 'suggestion' | 'popular';
