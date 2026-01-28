import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Genre {
    id: string;
    name: string;
}

const fetchGenres = async () => {
    try {
        const { data } = await api.get<Genre[]>("/genres");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching genres:", error);
        return [];
    }
};

export const useGenres = () => {
    return useQuery({
        queryKey: ["genres"],
        queryFn: fetchGenres,
    });
};
