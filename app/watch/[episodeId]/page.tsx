"use client";

import { useParams, useSearchParams } from "next/navigation";
import { VideoPlayer } from "@/components/features/VideoPlayer";
import { getResourceUrl } from "@/lib/utils";
import { useEpisodes } from "@/hooks/useEpisodes";
import { useMovie } from "@/hooks/useMovies";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Assuming we need to fetch the specific episode info or find it in the list
import { useState } from "react";

// Assuming we need to fetch the specific episode info or find it in the list
export default function WatchPage() {
    const { episodeId } = useParams();
    const searchParams = useSearchParams();
    const movieId = searchParams.get('movieId');
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Epizodlar va Kino ma'lumotlarini olish
    const { data: episodes, isLoading: episodesLoading } = useEpisodes(movieId as string);
    const { data: movie, isLoading: movieLoading } = useMovie(movieId as string);

    const isLoading = episodesLoading || movieLoading;

    if (isLoading || !episodes) {
        return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    const currentEpisode = episodes.find(ep => ep.id === episodeId);
    const nextEpisode = episodes.find(ep => ep.episodeNumber === (currentEpisode?.episodeNumber || 0) + 1);

    if (!currentEpisode) return <div className="text-white">Episode not found</div>;

    // Telegram orqali ko'rish logikasi
    const handleTelegramWatch = () => {
        if (!movie?.telegramInviteLink || !movie?.telegramMovieUrl) return;

        setIsRedirecting(true);
        // 1. Telegram invite link yangi oynada ochiladi
        window.open(movie.telegramInviteLink, '_blank');

        // 2. 4 soniyadan keyin kino postiga o'tadi
        setTimeout(() => {
            window.location.href = movie.telegramMovieUrl!;
            setIsRedirecting(false);
        }, 4000); // 1.5s -> 4s
    };

    const showTelegramButton = movie?.telegramInviteLink && movie?.telegramMovieUrl;

    return (
        <div className="min-h-screen bg-black flex flex-col">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full p-4 z-50 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                <Link href={`/movies/${movieId}`}>
                    <Button variant="ghost" className="text-white hover:bg-white/10">
                        <ArrowLeft className="mr-2" /> Orqaga
                    </Button>
                </Link>
                <div className="text-gray-300 font-medium pr-4">
                    {movie?.title} - {currentEpisode.episodeNumber}-qism
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex items-center justify-center bg-black">
                <div className="w-full h-full max-h-screen flex items-center justify-center">
                    {showTelegramButton ? (
                        <div className="text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm max-w-md w-full mx-4">
                            <h2 className="text-2xl font-bold text-white mb-4">Telegram orqali ko'rish</h2>
                            <p className="text-gray-400 mb-8">
                                Ushbu kinoni sifatli formatda va reklamasiz bizning maxsus Telegram kanalimizda tomosha qiling.
                            </p>

                            <Button
                                onClick={handleTelegramWatch}
                                disabled={isRedirecting}
                                className="w-full h-14 text-lg bg-[#0088cc] hover:bg-[#007dba] text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-wait"
                            >
                                <Send className="mr-2 h-5 w-5" />
                                {isRedirecting ? "Kanalga o'tilmoqda..." : "Telegramda Ko'rish"}
                            </Button>

                            <p className="text-xs text-gray-500 mt-4">
                                Tugmani bosgach, avval kanalga qo'shilasiz, so'ngra kino ochiladi.
                            </p>
                            {isRedirecting && (
                                <p className="text-yellow-400 text-sm mt-4 animate-pulse font-medium bg-yellow-400/10 p-2 rounded">
                                    Iltimos, ochilgan oynada kanalga qo'shiling! <br />
                                    Kino 4 soniyadan so'ng ochiladi...
                                </p>
                            )}
                        </div>
                    ) : (
                        <VideoPlayer
                            src={`${process.env.NEXT_PUBLIC_API_URL}/episodes/stream/${currentEpisode.id}`}
                            poster={getResourceUrl(currentEpisode.thumbnailUrl, 'poster')}
                            autoPlay={true}
                            onEnded={() => {
                                if (nextEpisode) {
                                    window.location.href = `/watch/${nextEpisode.id}?movieId=${movieId}`;
                                }
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
