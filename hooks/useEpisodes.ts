import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { Episode } from "@/types/movie";

export const useEpisodes = (movieId: string) => {
    return useQuery({
        queryKey: ["episodes", movieId],
        queryFn: async () => {
            const { data } = await api.get<Episode[]>(`/episodes/movie/${movieId}`);
            return data;
        },
        enabled: !!movieId,
    });
};
