"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useGenres } from "@/hooks/useGenres";

interface GenreFilterProps {
    selectedGenre: string | null;
    onSelectGenre: (genre: string | null) => void;
}

export function GenreFilter({ selectedGenre, onSelectGenre }: GenreFilterProps) {
    const { data: genres, isLoading } = useGenres();

    if (isLoading) return <div className="h-10 flex gap-2 animate-pulse"><div className="w-16 h-full bg-gray-800 rounded-md" /></div>;

    return (
        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
            <Button
                variant={selectedGenre === null ? "default" : "outline"}
                onClick={() => onSelectGenre(null)}
                className={cn("whitespace-nowrap rounded-full px-6", selectedGenre === null ? "bg-primary border-primary text-white" : "border-gray-700 text-gray-400 hover:text-white hover:border-gray-500")}
            >
                Barchasi
            </Button>
            {genres?.map((genre) => (
                <Button
                    key={genre.id}
                    variant={selectedGenre === genre.id ? "default" : "outline"}
                    onClick={() => onSelectGenre(genre.id)}
                    className={cn("whitespace-nowrap rounded-full px-6", selectedGenre === genre.id ? "bg-primary border-primary text-white" : "border-gray-700 text-gray-400 hover:text-white hover:border-gray-500")}
                >
                    {genre.name}
                </Button>
            ))}
        </div>
    );
}
