"use client";

import AdminGuard from "@/components/auth/AdminGuard";
import MovieForm from "@/components/admin/MovieForm";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMovies } from "@/hooks/useMovies";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EditMoviePage() {
    const params = useParams();
    const id = params?.id as string;
    const [movie, setMovie] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await axios.get(`/api-backend/movies/${id}`);
                setMovie(response.data);
            } catch (error) {
                console.error("Failed to fetch movie:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchMovie();
    }, [id]);

    return (
        <AdminGuard>
            <div className="container mx-auto px-4 py-10">
                <Link href="/admin/movies" className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors w-fit">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Kinolarga qaytish
                </Link>

                <div className="mb-10">
                    <h1 className="text-3xl font-bold">Kinoni Tahrirlash</h1>
                    <p className="text-gray-500">{movie ? movie.title : "Ma'lumotlar yuklanmoqda..."}</p>
                </div>

                <div className="bg-[#1a202c] border border-gray-800 rounded-xl p-6 md:p-10 shadow-xl min-h-[400px] flex items-center justify-center">
                    {loading ? (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                            <p className="text-gray-500 animate-pulse">Kino ma'lumotlari yuklanmoqda...</p>
                        </div>
                    ) : movie ? (
                        <MovieForm initialData={movie} isEditing={true} />
                    ) : (
                        <div className="text-center">
                            <p className="text-red-500 font-bold mb-4">Kino topilmadi!</p>
                            <Link href="/admin/movies">
                                <span className="text-blue-500 hover:underline cursor-pointer">Kinolarga qaytish</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AdminGuard>
    );
}
