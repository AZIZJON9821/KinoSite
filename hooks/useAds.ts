import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Advertisement {
    id: string;
    title: string;
    type: 'IMAGE' | 'VIDEO';
    mediaUrl: string;
    isActive: boolean;
    link?: string;
    createdAt: string;
}

export const useActiveAds = () => {
    return useQuery({
        queryKey: ["ads", "active"],
        queryFn: async () => {
            const { data } = await api.get<Advertisement[]>("/ads/active");
            return data;
        },
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useAds = () => {
    return useQuery({
        queryKey: ["ads"],
        queryFn: async () => {
            const { data } = await api.get<Advertisement[]>("/ads");
            return data;
        },
    });
};

export const useCreateAd = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await api.post("/ads", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ads"] });
        },
    });
};

export const useDeleteAd = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/ads/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ads"] });
        },
    });
};

export const useToggleAdStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
            await api.patch(`/ads/${id}/status`, { isActive });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ads"] });
        },
    });
};
