"use client";

import AdminGuard from "@/components/auth/AdminGuard";
import { useMovies } from "@/hooks/useMovies";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Plus, Edit, Trash2, Film, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getImageUrl } from "@/lib/utils";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function AdminMovies() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState("");
    const { data: movies, isLoading, refetch } = useMovies({ search: searchQuery || undefined });

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`"${title}" kinosini o'chirishni xohlaysizmi?`)) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/movies/${id}`, {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                }
            });
            toast.success("Kino muvaffaqiyatli o'chirildi");
            refetch();
        } catch (error: any) {
            console.error("Delete error:", error);
            if (error.response?.status === 401) {
                toast.error("Sizning sessiyangiz tugagan yoki huquqingiz yetarli emas. Iltimos, saytdan chiqib (Logout) qaytadan kiring (Login).");
            } else {
                const errorMsg = error.response?.data?.message || "O'chirishda xatolik yuz berdi";
                toast.error(`Xatolik: ${errorMsg}`);
            }
        }
    };

    return (
        <AdminGuard>
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Kinolarni Boshqarish</h1>
                        <p className="text-gray-500">Barcha kinolarni ko'rish, tahrirlash va o'chirish</p>
                    </div>
                    <Link href="/admin/movies/add">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Yangi Kino Qo'shish
                        </Button>
                    </Link>
                </div>

                <Card className="bg-[#1a202c] border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-800 flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Nom bo'yicha qidirish..."
                                className="pl-9 bg-gray-900/50 border-gray-700 focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#111827] text-gray-400 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Kino</th>
                                    <th className="px-6 py-4 font-medium">Janrlar</th>
                                    <th className="px-6 py-4 font-medium">Reyting</th>
                                    <th className="px-6 py-4 font-medium">Yili</th>
                                    <th className="px-6 py-4 font-medium text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                                        </td>
                                    </tr>
                                ) : movies?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">
                                            Kinolar topilmadi
                                        </td>
                                    </tr>
                                ) : (
                                    movies?.map((movie: any) => (
                                        <tr key={movie.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={getImageUrl(movie.poster)}
                                                        alt={movie.title}
                                                        className="h-12 w-8 object-cover rounded shadow-sm bg-gray-800"
                                                    />
                                                    <span className="font-bold text-gray-200">{movie.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {movie.genres?.map((g: any) => (
                                                        <span key={g.genre.id} className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400 uppercase tracking-wider">
                                                            {g.genre.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-yellow-500 font-bold">{movie.rating}</td>
                                            <td className="px-6 py-4 text-gray-400">{movie.releaseYear}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/movies/edit/${movie.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                                                        onClick={() => handleDelete(movie.id, movie.title)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AdminGuard>
    );
}

// Simple internal Card if you didn't create external one or it's slightly diff
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`rounded-xl border border-gray-800 bg-[#1a202c] ${className}`}>{children}</div>;
}
