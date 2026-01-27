"use client";

import { Movie } from "@/types/movie";
import { MovieCard } from "@/components/ui/MovieCard";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface MovieSliderProps {
  title: string;
  movies: Movie[];
  exploreHref?: string;
}

export function MovieSlider({ title, movies, exploreHref }: MovieSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current || movies.length === 0) return;
    const container = scrollContainerRef.current;
    // Har doim ko'rinib turgan masofani (ya'ni mobilda 2 ta kino) to'la scroll qilamiz
    const scrollAmount = container.clientWidth;

    if (direction === "right") {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    } else {
      if (container.scrollLeft <= 10) {
        container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="container mx-auto py-4 space-y-4 px-4 overflow-hidden">
      {/* Title */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-purple-600"></div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-300 uppercase tracking-wide cursor-pointer inline-flex items-center gap-2">
          {title}
          {exploreHref ? (
            <Link
              href={exploreHref}
              className="text-xs text-blue-400 font-normal normal-case tracking-normal hover:text-blue-300 transition-colors"
            >
              Explore All
            </Link>
          ) : (
            <span className="text-xs text-blue-400 font-normal normal-case tracking-normal">
              Explore All
            </span>
          )}
        </h2>
      </div>

      {/* Slider */}
      <div className="relative group">
        {/* Left Arrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll("left")}
          className="absolute -left-2 md:left-2 top-1/2 -translate-y-1/2 z-40 w-8 md:w-12 h-12 md:h-16 bg-black/40 xl:bg-blue-500/20 hover:bg-black/60 xl:hover:bg-blue-500/40 flex items-center justify-center text-white transition-colors rounded-full md:rounded-md border border-white/10 backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 md:w-8 h-4 md:h-8" />
        </Button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto hide-scrollbar py-4 px-1 snap-x snap-mandatory scroll-smooth"
          style={{ gap: "12px" }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] md:w-[calc((100%-36px)/4)] lg:w-[calc((100%-48px)/5)] snap-start"
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll("right")}
          className="absolute -right-2 md:right-2 top-1/2 -translate-y-1/2 z-40 w-8 md:w-12 h-12 md:h-16 bg-black/40 xl:bg-blue-500/20 hover:bg-black/60 xl:hover:bg-blue-500/40 flex items-center justify-center text-white transition-colors rounded-full md:rounded-md border border-white/10 backdrop-blur-sm"
        >
          <ChevronRight className="w-4 md:w-8 h-4 md:h-8" />
        </Button>
      </div>
    </div>
  );
}
