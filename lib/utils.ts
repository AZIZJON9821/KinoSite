import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getResourceUrl(path: string | undefined | null, type: 'poster' | 'video' = 'poster') {
    if (!path) return type === 'poster' ? "https://via.placeholder.com/800x400?text=No+Image" : "";
    if (path.startsWith("http")) return path;

    // For client-side, always use relative paths to trigger Vercel proxy/rewrites
    // This avoids Mixed Content (HTTPS -> HTTP) and CORS issues
    const baseUrl = typeof window === "undefined"
        ? (process.env.NEXT_PUBLIC_API_URL || "http://51.20.250.43:3000")
        : "";

    // Clean up the path: remove leading /uploads if it exists to avoid double prefix
    let cleanPath = path.replace(/^\/+/, '');

    if (cleanPath.startsWith('uploads/')) {
        return `${baseUrl}/${cleanPath}`;
    }

    const folder = type === 'video' ? 'videos' : 'posters';
    return `${baseUrl}/uploads/${folder}/${cleanPath}`;
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
