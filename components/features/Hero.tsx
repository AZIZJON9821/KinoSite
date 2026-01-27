"use client";

import { Movie } from "@/types/movie";
import { Button } from "@/components/ui/Button";
import { Play, Info } from "lucide-react";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

interface HeroProps {
    movie: Movie;
}

export function Hero({ movie }: HeroProps) {
    if (!movie) return null;

    return (
        <div className="relative h-[80vh] w-full">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={getImageUrl(movie.backdropUrl || movie.poster)}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                />
                {/* Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-end h-full">
                <div className="max-w-2xl space-y-4 animate-slide-up">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
                        {movie.title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm md:text-base text-gray-200 font-medium">
                        <span className="text-green-400 font-bold">{movie.rating} Rating</span>
                        <span>{movie.releaseYear}</span>
                        <span className="border border-gray-400 px-1 rounded text-xs">{movie.ageRating || '16+'}</span>
                        <span>{movie.duration} min</span>
                    </div>

                    <p className="text-lg text-gray-300 line-clamp-3 drop-shadow-md">
                        {movie.description}
                    </p>

                    <div className="flex items-center gap-3 pt-4">
                        <Link href={`/movies/${movie.id}`}>
                            <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold px-8">
                                <Play className="mr-2 h-5 w-5 fill-black" /> Play
                            </Button>
                        </Link>
                        <Link href={`/movies/${movie.id}`}>
                            <Button size="lg" variant="secondary" className="bg-gray-500/70 text-white hover:bg-gray-500/50 font-bold px-8">
                                <Info className="mr-2 h-5 w-5" /> More Info
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
