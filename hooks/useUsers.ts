"use client";

import { useState, useEffect } from "react";
import { customAxios } from "@/api/instances";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: string;
    createdAt: string;
}

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await customAxios.get("/users", {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Foydalanuvchilarni yuklashda xatolik!");
        } finally {
            setLoading(false);
        }
    };

    const updateRole = async (userId: string, role: string) => {
        try {
            await customAxios.patch(`/users/${userId}/role`, { role }, {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });
            toast.success("Foydalanuvchi roli yangilandi!");
            fetchUsers();
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Rolni yangilashda xatolik!");
        }
    };

    const deleteUser = async (userId: string) => {
        if (!confirm("Haqiqatan ham ushbu foydalanuvchini o'chirmoqchimisiz?")) return;
        try {
            await customAxios.delete(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });
            toast.success("Foydalanuvchi o'chirildi!");
            fetchUsers();
            return true;
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Foydalanuvchini o'chirishda xatolik!");
            return false;
        }
    };

    const addUser = async (data: { email: string; name: string; role: string }) => {
        try {
            await customAxios.post("/users", data, {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });
            toast.success("Yangi foydalanuvchi muvaffaqiyatli qo'shildi!");
            fetchUsers();
            return true;
        } catch (error) {
            console.error("Error adding user:", error);
            toast.error("Foydalanuvchini qo'shishda xatolik!");
            return false;
        }
    };

    useEffect(() => {
        if (session?.accessToken) {
            fetchUsers();
        }
    }, [session?.accessToken]);

    return { users, loading, updateRole, deleteUser, addUser, refresh: fetchUsers };
}
