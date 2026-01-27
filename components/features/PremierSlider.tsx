"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/types/movie";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";

interface PremierSliderProps {
    movies: Movie[];
}

export function PremierSlider({ movies }: PremierSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

    const total = movies.length;

    const changeSlide = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => (prev + newDirection + total) % total);
    };

    // Auto-slide
    useEffect(() => {
        if (!movies?.length) return;
        const interval = setInterval(() => changeSlide(1), 5000);
        return () => clearInterval(interval);
    }, [movies]);

    if (!movies || movies.length === 0) return null;

    const currentMovie = movies[currentIndex];
    const title = currentMovie.title || "Untitled";

    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({
            x: dir > 0 ? -300 : 300,
            opacity: 0,
        }),
    };

    return (
        <div className="container mx-auto px-4 py-4">
            {/* Section Title */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-purple-600"></div>
                <h2 className="text-xl font-bold text-gray-300 uppercase tracking-wide">
                    PREMYERALAR
                </h2>
            </div>

            {/* Slider */}
            <div className="relative w-full aspect-video md:aspect-auto md:h-full lg:h-[600px] bg-gray-900 rounded-sm overflow-hidden shadow-2xl border border-gray-800">
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={currentMovie.id}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        {/* Background */}
                        <Image
                            src={getImageUrl(currentMovie.backdrop || currentMovie.backdropUrl || currentMovie.poster)}
                            alt={currentMovie.title}
                            fill
                            className="object-cover"
                            priority={currentIndex === 0}
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-black/20" />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-14 h-14 md:w-20 md:h-20 bg-green-500/90 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform pointer-events-auto shadow-lg shadow-green-500/20">
                                <Link href={`/movies/${currentMovie.id}`}>
                                    <Play className="w-6 h-6 md:w-10 md:h-10 text-white fill-white" />
                                </Link>
                            </div>
                        </div>

                        {/* Bottom Caption */}
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent backdrop-blur-[2px] p-4 md:p-8 text-center border-t border-gray-700/30">
                            <h3 className="text-white text-sm md:text-xl font-bold truncate px-4 md:px-8">
                                {title} (Premyera)
                            </h3>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation - Always visible but styled differently */}
                <button
                    onClick={() => changeSlide(-1)}
                    className="absolute left-2 xl:left-0 top-1/2 -translate-y-1/2 w-8 md:w-12 h-14 md:h-20 bg-black/40 xl:bg-black/50 hover:bg-black/70 flex items-center justify-center text-white/70 hover:text-white transition-colors rounded-md xl:rounded-none border border-white/10 xl:border-none"
                >
                    <ChevronLeft className="w-5 md:w-8 h-5 md:h-8" />
                </button>

                <button
                    onClick={() => changeSlide(1)}
                    className="absolute right-2 xl:right-0 top-1/2 -translate-y-1/2 w-8 md:w-12 h-14 md:h-20 bg-black/40 xl:bg-black/50 hover:bg-black/70 flex items-center justify-center text-white/70 hover:text-white transition-colors rounded-md xl:rounded-none border border-white/10 xl:border-none"
                >
                    <ChevronRight className="w-5 md:w-8 h-5 md:h-8" />
                </button>
            </div>
        </div>
    );
}
