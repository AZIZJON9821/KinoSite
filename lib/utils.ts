import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Use local backend in development, Render in production
const BACKEND_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://kino-sayt-backend.onrender.com';

const SUPABASE_STORAGE_BASE = "https://njbfeuwlaeeqkbhsandh.supabase.co/storage/v1/object/public";

export function getResourceUrl(path: string | undefined | null, type: 'poster' | 'video' | 'ad' = 'poster') {
    if (!path) return type === 'poster' ? "https://via.placeholder.com/800x400?text=No+Image" : "";
    if (path.startsWith("http")) return path;

    // Clean up the path: remove leading slashes and 'uploads/' prefix if present
    let cleanPath = path.replace(/^\/+/, '').replace(/^uploads\//, '');
    
    // For old database entries that might have 'posters/', 'backdrops/' etc. in the path
    cleanPath = cleanPath.replace(/^(posters|backdrops|ads|videos|video)\//, '');

    let bucket = 'posters';
    if (type === 'video') bucket = 'video';
    if (type === 'ad') bucket = 'ads';

    return `${SUPABASE_STORAGE_BASE}/${bucket}/${cleanPath}`;
}

export function getImageUrl(path: string | undefined | null) {
    return getResourceUrl(path, 'poster');
}

export function getAdUrl(path: string | undefined | null) {
    return getResourceUrl(path, 'ad');
}

/**
 * Convert YouTube URL to embed format
 * Supports: youtube.com/watch?v=xxx, youtu.be/xxx, youtube.com/shorts/xxx
 */
export function getYouTubeEmbedUrl(url: string | undefined | null): string | null {
    if (!url) return null;

    try {
        // Extract video ID from various YouTube URL formats
        let videoId: string | null = null;

        // Format: https://www.youtube.com/watch?v=VIDEO_ID
        if (url.includes('youtube.com/watch')) {
            const urlParams = new URLSearchParams(url.split('?')[1]);
            videoId = urlParams.get('v');
        }
        // Format: https://youtu.be/VIDEO_ID
        else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        }
        // Format: https://www.youtube.com/shorts/VIDEO_ID
        else if (url.includes('youtube.com/shorts/')) {
            videoId = url.split('shorts/')[1]?.split('?')[0];
        }
        // Format: https://www.youtube.com/embed/VIDEO_ID (already embed format)
        else if (url.includes('youtube.com/embed/')) {
            return url;
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }

        return null;
    } catch (error) {
        console.error('Error parsing YouTube URL:', error);
        return null;
    }
}
