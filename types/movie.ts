export interface Movie {
    id: string;
    title: string;
    description: string;
    type: 'MOVIE' | 'SERIAL';
    poster?: string; // Backend returns 'poster' filename, not full URL
    backdropUrl?: string; // Not in schema, keeping optional
    videoUrl?: string;
    trailerUrl?: string;
    telegramMovieUrl?: string;
    telegramInviteLink?: string;
    telegramFileId?: string;
    backdrop?: string;
    releaseYear: number;
    rating: number;
    genres: { genre: { name: string } }[] | any[]; // Backend returns generic structure
    duration?: number;
    director?: string;
    country: string;
    ageRating?: string;
    isPremier?: boolean;
    episodes?: Episode[];
}

export interface Episode {
    id: string;
    title: string;
    description: string;
    videoUrl?: string; // Legacy
    telegramFileId?: string; // New
    thumbnailUrl: string;
    episodeNumber: number;
    seasonNumber: number;
    duration: number;
}
