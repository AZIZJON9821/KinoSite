"use client";

import { useMovies } from "@/hooks/useMovies";
import { MovieGrid } from "@/components/ui/MovieGrid";
import { Loader2 } from "lucide-react";

export default function NewReleasesPage() {
    // Fetch newest movies
    const { data: movies, isLoading } = useMovies({
        sort: "newest",
        limit: 50 // Show more than the slider
    });

    return (
        <div className="bg-transparent text-white min-h-screen">
            <div className="container mx-auto px-4 py-10">
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight">
                            Yangi Qo'shilganlar
                        </h1>
                        <p className="text-gray-500 font-medium">Oxirgi qo'shilgan eng sara filmlar to'plami</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                        <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest">Yuklanmoqda...</p>
                    </div>
                ) : movies && movies.length > 0 ? (
                    <MovieGrid movies={movies} />
                ) : (
                    <div className="text-center py-40 border-2 border-dashed border-gray-800 rounded-3xl">
                        <p className="text-gray-500 text-xl font-bold italic">Hozircha yangi filmlar yo'q</p>
                    </div>
                )}
            </div>
        </div>
    );
}
