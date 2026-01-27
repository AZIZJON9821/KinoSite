"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "@/types/movie";
import { Star } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useToggleSaveMovie, useSavedMovies } from "@/hooks/useMovies";
import { useSession } from "next-auth/react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import Image from "next/image";

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { mutate: toggleSave } = useToggleSaveMovie();
  const { data: savedMovies } = useSavedMovies(!!session?.user);

  const isSaved = savedMovies?.some((m: any) => m.id === movie.id);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation(); // Card bosilishini oldini olish
    if (!session) {
      router.push("/login");
      return;
    }
    toggleSave(movie.id);
  };

  return (
    <motion.div
      onClick={() => router.push(`/movies/${movie.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "relative w-full aspect-[2/3] cursor-pointer rounded-md xl:rounded-2xl overflow-hidden shadow-2xl bg-[#0f172a] transform transition-all duration-300",
        className
      )}
    >
      {/* Poster */}
      <Image
        src={getImageUrl(movie.poster)}
        alt={movie.title}
        fill
        className="object-cover"
        loading="lazy"
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
      />

      {/* Pastki info container */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        {/* Gradient + blur faqat matn orqasida */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-b-md xl:rounded-b-2xl" />

        {/* Title va info */}
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2">
            {/* Title: bitta qator, oxirida ... */}
            <h3
              className="text-white font-bold text-sm sm:text-base truncate flex-1"
              title={movie.title} // Hoverda to‘liq matn ko‘rsin
            >
              {movie.title}
            </h3>

            {/* Save button */}
            <button
              onClick={handleSave}
              className="text-gray-300 hover:text-green-400 transition-colors mt-0.5"
              title={isSaved ? "Saqlanganlardan o'chirish" : "Saqlash"}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-green-500 fill-green-500" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Rating va boshqa info */}
          <div className="flex items-center gap-2 text-xs mt-1 text-gray-200">
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Star className="w-3 h-3 fill-emerald-400" />
              {movie.rating.toFixed(1)}
            </div>
            <span>{movie.releaseYear}</span>
            <span className="bg-gray-700/60 px-1.5 rounded text-[10px] font-semibold">
              {movie.ageRating || "16+"}
            </span>
          </div>
        </div>
      </div>

      {/* Hover janrlar (hozircha bo‘sh) */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 left-0 right-0 px-3 text-xs text-gray-300"
          >
            {/* Agar kerak bo‘lsa janr yoki qo‘shimcha info shu yerga qo‘yiladi */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
