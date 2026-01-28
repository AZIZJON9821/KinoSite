"use client";

import { useMovies } from "@/hooks/useMovies";
import { MovieGrid } from "@/components/ui/MovieGrid";
import { GenreFilter } from "@/components/features/GenreFilter";
import { useState, useEffect, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

function MoviesContent() {
    const searchParams = useSearchParams();
    const genreFromUrl = searchParams?.get("genre") || null;
    const typeFromUrl = searchParams?.get("type") as 'MOVIE' | 'SERIAL' | null;
    const excludeGenresFromUrl = searchParams?.get("excludeGenres") || null;
    const [selectedGenre, setSelectedGenre] = useState<string | null>(genreFromUrl);
    const [searchQuery] = useState("");
    const [sortBy] = useState("newest");

    // Update selected genre when URL changes
    useEffect(() => {
        if (genreFromUrl) {
            setSelectedGenre(genreFromUrl);
        }
    }, [genreFromUrl]);

    const { data: movies, isLoading } = useMovies({
        genre: selectedGenre || undefined,
        search: searchQuery || undefined,
        sort: sortBy,
        type: typeFromUrl || undefined,
        excludeGenres: excludeGenresFromUrl || undefined,
    });

    return (
        <div className="relative container mx-auto px-4 pt-10 pb-10 overflow-x-hidden">
            <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></span>
                    {typeFromUrl === 'SERIAL' ? 'Seriallar' : 'Kinolar'}
                </h2>
                <GenreFilter selectedGenre={selectedGenre} onSelectGenre={setSelectedGenre} />
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-purple-500 h-12 w-12 mb-4" />
                    <p className="text-gray-400">Loading amazing movies...</p>
                </div>
            ) : (
                <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <MovieGrid movies={movies || []} />
                </div>
            )}
        </div>
    );
}

export default function MoviesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin h-10 w-10 text-purple-500" /></div>}>
                <MoviesContent />
            </Suspense>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes gradient {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                    opacity: 0;
                }

                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </div>
    );
}