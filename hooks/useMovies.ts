import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Movie } from "@/types/movie";

interface MoviesFilters {
    genre?: string;
    search?: string;
    year?: number;
    country?: string;
    sort?: string;
    page?: number;
    isPremier?: boolean;
    limit?: number;
    minRating?: number;
    type?: 'MOVIE' | 'SERIAL';
    excludeGenres?: string;
}

const fetchMovies = async (filters?: MoviesFilters) => {
    const params = new URLSearchParams();
    if (filters?.genre) params.append("genre", filters.genre);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.sort) params.append("sortBy", filters.sort);
    if (filters?.isPremier !== undefined) params.append("isPremier", String(filters.isPremier));
    if (filters?.limit) params.append("limit", String(filters.limit));
    if (filters?.minRating) params.append("minRating", String(filters.minRating));
    if (filters?.type) params.append("type", filters.type);
    if (filters?.excludeGenres) params.append("excludeGenres", filters.excludeGenres);

    try {
        const { data } = await api.get<any>(`/movies?${params.toString()}`);
        // ... (rest of fetchMovies logic remains same)
        if (Array.isArray(data)) return data;
        if (data && typeof data === 'object' && Array.isArray(data.data)) return data.data;
        if (data && typeof data === 'object' && Array.isArray(data.results)) return data.results;
        return [];
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
};

export const useMovies = (filters?: MoviesFilters) => {
    return useQuery({
        queryKey: ["movies", filters],
        queryFn: () => fetchMovies(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useMovie = (id: string) => {
    return useQuery({
        queryKey: ["movie", id],
        queryFn: async () => {
            const { data } = await api.get<Movie>(`/movies/${id}`);
            return data;
        },
        enabled: !!id,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};
export const useSavedMovies = (enabled = true) => {
    return useQuery({
        queryKey: ["savedMovies"],
        queryFn: async () => {
            const { data } = await api.get("/users/saved-movies");
            return data;
        },
        enabled,
    });
};

export const useToggleSaveMovie = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (movieId: string) => {
            const { data } = await api.post(`/movies/${movieId}/toggle-save`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["savedMovies"] });
        },
    });
};
