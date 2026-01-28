import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getResourceUrl(path: string | undefined | null, type: 'poster' | 'video' = 'poster') {
    if (!path) return type === 'poster' ? "https://via.placeholder.com/800x400?text=No+Image" : "";
    if (path.startsWith("http")) return path;

    // Use relative paths to leverage Next.js rewrites/proxy
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    if (path.startsWith("/")) {
        // If it's already an absolute-like path from backend (e.g. /uploads/...)
        return `${baseUrl}${path}`;
    }

    // Check if the path already includes 'uploads/'
    if (path.includes('uploads/')) {
        return `${baseUrl}/${path.replace(/^\/+/, '')}`;
    }

    const folder = type === 'video' ? 'videos' : 'posters';
    return `${baseUrl}/uploads/${folder}/${path}`;
}

export function getImageUrl(path: string | undefined | null) {
    return getResourceUrl(path, 'poster');
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
