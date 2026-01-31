"use client";

import { useMovie, useSavedMovies, useToggleSaveMovie } from "@/hooks/useMovies";
import { Button } from "@/components/ui/Button";
import { Play, Plus, Check } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getImageUrl, getYouTubeEmbedUrl } from "@/lib/utils";
import { useSession } from "next-auth/react";


export default function MovieDetailPage() {
    const params = useParams();
    const router = useRouter();
    const movieId = params?.id as string;
    const { data: session } = useSession();
    const { data: movie, isLoading: movieLoading } = useMovie(movieId);
    const { data: savedMovies } = useSavedMovies(!!session);
    const { mutate: toggleSave, isPending: isSaving } = useToggleSaveMovie();

    const isSaved = savedMovies?.some((m: any) => m.id === movie?.id);

    const handleToggleSave = () => {
        if (!session) {
            router.push("/login"); // Redirect to login if not authenticated
            return;
        }
        if (movie?.id) {
            toggleSave(movie.id);
        }
    };

    if (movieLoading || !movie) {
        return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    return (
        <div className="min-h-screen bg-[#1a1f2e] text-white">
            <div className="container mx-auto px-4 md:px-8 py-4 pt-20 md:pt-24">

                {/* Movie Title */}
                <div className="mb-4">
                    <div className="flex items-start gap-3">
                        <div className="w-1 h-12 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <h1 className="text-2xl md:text-3xl font-black leading-tight uppercase">
                            {movie.title}
                        </h1>
                    </div>
                </div>

                {/* POSTER + INFO TABLE SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-6 mb-6 items-start">
                    {/* Poster */}
                    <div className="relative group">
                        <div className="aspect-[2/3] w-full rounded-lg overflow-hidden shadow-2xl relative">
                            <img
                                src={getImageUrl(movie.poster)}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Info Table */}
                    <div className="bg-[#1e2433] rounded-lg overflow-hidden">
                        <div className="divide-y divide-gray-700/50">
                            {/* NOMI */}
                            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-0 sm:gap-4 border-b border-gray-700/30 sm:border-none">
                                <div className="bg-[#2a3142] px-4 py-2 sm:py-4 text-gray-400 font-semibold text-xs sm:text-sm uppercase">
                                    NOMI
                                </div>
                                <div className="px-4 py-2 sm:py-4 text-gray-200 font-medium text-sm sm:text-base">
                                    {movie.title}
                                </div>
                            </div>

                            {/* JANR */}
                            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-0 sm:gap-4 border-b border-gray-700/30 sm:border-none">
                                <div className="bg-[#2a3142] px-4 py-2 sm:py-4 text-gray-400 font-semibold text-xs sm:text-sm uppercase">
                                    JANR
                                </div>
                                <div className="px-4 py-2 sm:py-4 text-gray-200 font-medium text-sm sm:text-base">
                                    {movie.genres.map((g: any) => g?.genre?.name || g?.name || (typeof g === 'string' ? g : '')).filter(Boolean).join(' / ')}
                                </div>
                            </div>

                            {/* DAVLATI */}
                            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-0 sm:gap-4 border-b border-gray-700/30 sm:border-none">
                                <div className="bg-[#2a3142] px-4 py-2 sm:py-4 text-gray-400 font-semibold text-xs sm:text-sm uppercase">
                                    DAVLATI
                                </div>
                                <div className="px-4 py-2 sm:py-4 text-gray-200 font-medium text-sm sm:text-base">
                                    {(movie.country as any)?.name || (typeof movie.country === 'string' ? movie.country : 'N/A')}
                                </div>
                            </div>

                            {/* YILI */}
                            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-0 sm:gap-4 border-b border-gray-700/30 sm:border-none">
                                <div className="bg-[#2a3142] px-4 py-2 sm:py-4 text-gray-400 font-semibold text-xs sm:text-sm uppercase">
                                    YILI
                                </div>
                                <div className="px-4 py-2 sm:py-4 text-gray-200 font-medium text-sm sm:text-base">
                                    {movie.releaseYear}
                                </div>
                            </div>

                            {/* REJISSYOR */}
                            {movie.director && (
                                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-0 sm:gap-4 border-b border-gray-700/30 sm:border-none">
                                    <div className="bg-[#2a3142] px-4 py-2 sm:py-4 text-gray-400 font-semibold text-xs sm:text-sm uppercase">
                                        REJISSYOR
                                    </div>
                                    <div className="px-4 py-2 sm:py-4 text-gray-200 font-medium text-sm sm:text-base">
                                        {movie.director}
                                    </div>
                                </div>
                            )}

                            {/* DAVOMIYLIGI */}
                            {movie.duration && (
                                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-0 sm:gap-4 border-b border-gray-700/30 sm:border-none">
                                    <div className="bg-[#2a3142] px-4 py-2 sm:py-4 text-gray-400 font-semibold text-xs sm:text-sm uppercase">
                                        DAVOMIYLIGI
                                    </div>
                                    <div className="px-4 py-2 sm:py-4 text-gray-200 font-medium text-sm sm:text-base">
                                        {movie.duration} daqiqa
                                    </div>
                                </div>
                            )}

                            {/* YOSH CHEGARASI */}
                            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-0 sm:gap-4 border-b border-gray-700/30 sm:border-none">
                                <div className="bg-[#2a3142] px-4 py-2 sm:py-4 text-gray-400 font-semibold text-xs sm:text-sm uppercase">
                                    YOSH CHEGARASI
                                </div>
                                <div className="px-4 py-2 sm:py-4">
                                    <span className="inline-flex items-center justify-center bg-blue-600 text-white font-bold px-3 py-1 rounded text-base sm:text-lg">
                                        {movie.ageRating || '18+'}
                                    </span>
                                </div>
                            </div>

                            {/* REYTING */}
                            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-0 sm:gap-4 border-b border-gray-700/30 sm:border-none">
                                <div className="bg-[#2a3142] px-4 py-2 sm:py-4 text-gray-400 font-semibold text-xs sm:text-sm uppercase">
                                    REYTING
                                </div>
                                <div className="px-4 py-2 sm:py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-400 text-xl sm:text-2xl">★</span>
                                        <span className="text-yellow-400 font-bold text-lg sm:text-xl">{movie.rating}</span>
                                    </div>
                                </div>
                            </div>

                            {/* TAVSIF */}
                            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-0 sm:gap-4">
                                <div className="bg-[#2a3142] px-4 py-2 sm:py-4 text-gray-400 font-semibold text-xs sm:text-sm uppercase">
                                    TAVSIF
                                </div>
                                <div className="px-4 py-3 sm:py-4 text-gray-300 leading-relaxed text-xs sm:text-sm italic">
                                    {movie.description}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* TRAILER SECTION */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <span className="w-1 h-7 bg-blue-500 rounded-full"></span>
                        Treiler
                    </h2>
                    {movie.trailerUrl && getYouTubeEmbedUrl(movie.trailerUrl) ? (
                        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-700/50">
                            <iframe
                                src={getYouTubeEmbedUrl(movie.trailerUrl) || ''}
                                title="Movie Trailer"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="aspect-video w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border border-gray-700/50">
                            <p className="text-gray-500 text-base">Treiler mavjud emas</p>
                        </div>
                    )}
                </div>

                {/* SEASONS SECTION */}
                {movie.type === 'SERIAL' && movie.episodes && movie.episodes.length > 0 && (
                    <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-3">
                            <span className="w-1.5 h-7 bg-purple-500 rounded-full shadow-[0_0_10px_purple]"></span>
                            Fasllar
                        </h2>
                        <div className="flex flex-wrap gap-2 sm:gap-4">
                            {Array.from(new Set(movie.episodes.map((ep: any) => ep.seasonNumber || 1)))
                                .sort((a: any, b: any) => a - b)
                                .map((sn: any) => (
                                    <a
                                        key={sn}
                                        href={`https://t.me/KinoSitee_Bot?start=seas_${movie.id}_${sn}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block group"
                                    >
                                        <Button className="py-2.5 px-6 text-sm sm:text-base font-bold bg-[#1a202c] hover:bg-purple-600 border border-gray-700 hover:border-purple-500 transition-all rounded-xl shadow-lg hover:shadow-purple-500/20">
                                            {sn}-Fasl
                                        </Button>
                                    </a>
                                ))}
                        </div>
                    </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {movie.type === 'MOVIE' && (movie.telegramMovieUrl || movie.episodes?.[0]) ? (
                        <a
                            href={
                                movie.episodes?.[0]
                                    ? `https://t.me/KinoSitee_Bot?start=ep_${movie.episodes[0].id}`
                                    : `https://t.me/KinoSitee_Bot?start=mov_${movie.id}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <Button className="w-full py-5 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-xl shadow-blue-500/25 transition-all rounded-xl border border-blue-400/20 group">
                                <Play className="mr-2 fill-white h-6 w-6 group-hover:scale-110 transition-transform" />
                                Kinoni Ko'rish
                            </Button>
                        </a>
                    ) : movie.type === 'MOVIE' ? (
                        <Button disabled className="w-full py-5 text-lg font-bold bg-gray-700 text-gray-500 cursor-not-allowed rounded-lg">
                            <Play className="mr-2 h-6 w-6" /> Kino Mavjud Emas
                        </Button>
                    ) : null}
                    <Button
                        variant="secondary"
                        className={`w-full py-5 text-lg font-semibold border border-gray-600/50 rounded-lg transition-all ${movie.type === 'SERIAL' ? 'sm:col-span-2' : ''} ${isSaved ? 'bg-green-600/20 text-green-500 hover:bg-green-600/30 border-green-500/50' : 'bg-gray-800/70 hover:bg-gray-700/90'}`}
                        onClick={handleToggleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        ) : isSaved ? (
                            <Check className="mr-2 h-6 w-6" />
                        ) : (
                            <Plus className="mr-2 h-6 w-6" />
                        )}
                        {isSaved ? "Saqlangan" : "Saqlash"}
                    </Button>
                </div>

                {/* Backdrop Image (Optional) */}
                {movie.backdropUrl && (
                    <div className="mt-8 rounded-lg overflow-hidden shadow-xl border border-gray-700/50">
                        <img
                            src={getImageUrl(movie.backdropUrl)}
                            alt={`${movie.title} backdrop`}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
