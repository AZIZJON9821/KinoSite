"use client";

import { useMovies } from "@/hooks/useMovies";
import { MovieGrid } from "@/components/ui/MovieGrid";
import { Loader2, Star } from "lucide-react";

export default function TopRatedPage() {
    // Fetch top rated movies
    const { data: movies, isLoading } = useMovies({
        minRating: 8.5,
        limit: 50
    });

    return (
        <div className="bg-transparent text-white min-h-screen">
            <div className="container mx-auto px-4 py-10">
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-yellow-500 rounded-full"></div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-2">
                            Eng Yuqori Reytingli <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                        </h1>
                        <p className="text-gray-500 font-medium">Barcha davrlarning eng yuqori baholangan filmlari</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
                        <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest">Yuklanmoqda...</p>
                    </div>
                ) : movies && movies.length > 0 ? (
                    <MovieGrid movies={movies} />
                ) : (
                    <div className="text-center py-40 border-2 border-dashed border-gray-800 rounded-3xl">
                        <p className="text-gray-500 text-xl font-bold italic">Hozircha yuqori reytingli filmlar topilmadi</p>
                    </div>
                )}
            </div>
        </div>
    );
}
