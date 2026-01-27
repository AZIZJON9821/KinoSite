"use client";

import { useSearchParams } from "next/navigation";
import { useMovies } from "@/hooks/useMovies";
import { MovieGrid } from "@/components/ui/MovieGrid";
import { Loader2 } from "lucide-react";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams?.get("q") || "";

    const { data: movies, isLoading } = useMovies({ search: query });

    return (
        <div className="bg-transparent text-white flex flex-col">
            <main className="flex-grow container mx-auto px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        Qidiruv: <span className="text-blue-500">"{query}"</span>
                    </h1>
                    {/* <p className="text-gray-400">
                        {isLoading ? "Qidirilmoqda..." : `${movies?.length || 0} ta kino topildi`}
                    </p> */}
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                    </div>
                ) : movies && movies.length > 0 ? (
                    <MovieGrid movies={movies} />
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                        <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700">
                            <p className="text-xl text-gray-300 mb-2">Hech narsa topilmadi</p>
                            <p className="text-gray-500">Boshqa so'z bilan qidirib ko'ring</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
