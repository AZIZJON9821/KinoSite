"use client";

import { useMovies } from "@/hooks/useMovies";
import { PremierSlider } from "@/components/features/PremierSlider";
import { MovieSlider } from "@/components/features/MovieSlider";
import { Loader2 } from "lucide-react";

export default function Home() {
    // Premier movies - Targeted fetch
    const { data: premierMovies, isLoading: isPremierLoading } = useMovies({
        isPremier: true,
        limit: 5,
        sort: "newest"
    });

    // Newest movies - Targeted fetch
    const { data: newestMovies, isLoading: isNewestLoading } = useMovies({
        limit: 10,
        sort: "newest"

    });

    // Top rated movies - Targeted fetch
    const { data: topRatedMovies, isLoading: isTopRatedLoading } = useMovies({
        limit: 10,
        sort: "newest",
        minRating: 8.5
    });

    const isLoading = isPremierLoading || isNewestLoading || isTopRatedLoading;

    if (isLoading && !premierMovies && !newestMovies && !topRatedMovies) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <Loader2 className="h-10 w-10 animate-spin text-primary" suppressHydrationWarning />
            </div>
        );
    }

    return (
        <div className="bg-transparent text-white">
            <div className="pb-8 space-y-4">
                {/* Premier Slider Section */}
                {premierMovies && premierMovies.length > 0 && (
                    <div id="premyeralar" className="scroll-mt-24">
                        <PremierSlider movies={premierMovies} />
                    </div>
                )}

                <div className="relative z-10 space-y-4">
                    {/* Yangi qo'shilganlar */}
                    {newestMovies && newestMovies.length > 0 && (
                        <div id="new-movies" className="scroll-mt-24">
                            <MovieSlider
                                title="Yangi Qo'shilganlar"
                                movies={newestMovies}
                                exploreHref="/new-releases"
                            />
                        </div>
                    )}

                    {/* Eng Yuqori Reytingli */}
                    {topRatedMovies && topRatedMovies.length > 0 && (
                        <div id="top-rated" className="scroll-mt-24">
                            <MovieSlider
                                title="Eng Yuqori Reytingli"
                                movies={topRatedMovies}
                                exploreHref="/top-rated"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
