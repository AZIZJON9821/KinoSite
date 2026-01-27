import { Movie } from "@/types/movie";
import { MovieCard } from "../ui/MovieCard";

interface MovieGridProps {
    movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
    if (!movies || movies.length === 0) {
        return (
            <div className="text-center text-gray-500 py-20">
                No movies found.
            </div>
        );
    }

    return (
        <div
            className="
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                xl:grid-cols-6
                gap-4
                w-full
                max-w-full
            "
        >
            {movies.map((movie) => (
                <div
                    key={movie.id}
                    className="w-full overflow-hidden"
                >
                    <MovieCard movie={movie} />
                </div>
            ))}
        </div>
    );
}
