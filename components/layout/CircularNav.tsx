"use client";

import Image from "next/image";
import Link from "next/link";
import { useMovies } from "@/hooks/useMovies";
import { getImageUrl } from "@/lib/utils";

export function CircularNav() {
    const { data: movies } = useMovies({ limit: 11, sort: "newest" });
    const circularMovies = movies || [];

    if (circularMovies.length === 0) return null;

    return (
        <div className="bg-[#1a202c] border-b border-gray-800">
            <div className="container mx-auto px-4 overflow-hidden relative">
                <div className="flex gap-4 overflow-x-auto hide-scrollbar py-6 justify-between w-full scroll-smooth">
                    {circularMovies.map((movie: any) => (
                        <Link
                            key={movie.id}
                            href={`/movies/${movie.id}`}
                            className="flex-shrink-0 flex flex-col items-center group/item"
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] border-gray-500/80 overflow-hidden shadow-xl transform active:scale-95 transition-all relative">
                                <Image
                                    src={getImageUrl(movie.poster)}
                                    alt={movie.title}
                                    fill
                                    className="object-cover grayscale-[20%] hover:grayscale-0 transition-all"
                                />
                            </div>
                            <span className="text-[9px] md:text-[10px] text-gray-400 mt-1 md:mt-2 max-w-[70px] md:max-w-[80px] truncate text-center group-hover/item:text-blue-400 transition-colors">
                                {movie.title}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
