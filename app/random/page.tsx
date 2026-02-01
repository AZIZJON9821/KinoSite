"use client";

import { useState } from "react";
import { useGenres } from "@/hooks/useGenres";
import api from "@/lib/axios";
import { Movie } from "@/types/movie";
import { Button } from "@/components/ui/Button";
import { Loader2, Shuffle, Play, ChevronRight, Info, Film, Tv, Palette, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";

type CategoryID = 'MOVIE' | 'SERIAL' | 'ANIME' | 'MULTFILM';

interface Category {
    id: CategoryID;
    label: string;
    icon: React.ReactNode;
    color: string;
}

export default function RandomPage() {
    const { data: genres, isLoading: genresLoading } = useGenres();
    const [selectedCategories, setSelectedCategories] = useState<CategoryID[]>(['MOVIE']);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [result, setResult] = useState<Movie | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [seenMovies, setSeenMovies] = useState<string[]>([]);

    const categories: Category[] = [
        {
            id: 'MOVIE',
            label: 'Kinolar',
            icon: <div className="relative">
                <Film className="h-10 w-10 text-blue-400" />
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20"></div>
            </div>,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'SERIAL',
            label: 'Seriallar',
            icon: <div className="relative">
                <Tv className="h-10 w-10 text-purple-400" />
                <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20"></div>
            </div>,
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'ANIME',
            label: 'Animelar',
            icon: <div className="relative">
                <Zap className="h-10 w-10 text-orange-400" />
                <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20"></div>
            </div>,
            color: 'from-orange-500 to-yellow-500'
        },
        {
            id: 'MULTFILM',
            label: 'Multfilmlar',
            icon: <div className="relative">
                <Palette className="h-10 w-10 text-emerald-400" />
                <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20"></div>
            </div>,
            color: 'from-green-500 to-emerald-500'
        },
    ];

    const toggleCategory = (id: CategoryID) => {
        setSelectedCategories(prev =>
            prev.includes(id)
                ? (prev.length > 1 ? prev.filter(c => c !== id) : prev)
                : [...prev, id]
        );
    };

    const toggleGenre = (genreName: string) => {
        setSelectedGenres(prev =>
            prev.includes(genreName)
                ? prev.filter(g => g !== genreName)
                : [...prev, genreName]
        );
    };

    const handleRandomSearch = async () => {
        setIsSearching(true);
        setError(null);
        setResult(null);

        try {
            const params = new URLSearchParams();
            params.append('limit', '400'); // Larger batch for randomness
            params.append('sortBy', 'newest');

            if (selectedGenres.length > 0) {
                params.append('genre', selectedGenres[0]);
            }

            const { data } = await api.get(`/movies?${params.toString()}`);
            let movies: Movie[] = [];

            if (Array.isArray(data)) movies = data;
            else if (data?.data && Array.isArray(data.data)) movies = data.data;
            else if (data?.results && Array.isArray(data.results)) movies = data.results;

            const filteredMovies = movies.filter(movie => {
                const movieGenres = movie.genres.map((g: any) => g.genre?.name?.toLowerCase() || "");
                const isAnime = movieGenres.includes('anime');
                const isMultfilm = movieGenres.includes('multfilm');

                return selectedCategories.some(cat => {
                    if (cat === 'SERIAL') return movie.type === 'SERIAL';
                    if (cat === 'ANIME') return isAnime;
                    if (cat === 'MULTFILM') return isMultfilm;
                    if (cat === 'MOVIE') return movie.type === 'MOVIE' && !isAnime && !isMultfilm;
                    return false;
                });
            });

            // Filter by genres if more than one selected (first one is handled by API param if present)
            const finalResults = filteredMovies.filter(movie => {
                if (selectedGenres.length <= 1) return true;
                const movieGenreNames = movie.genres.map((g: any) => g.genre?.name?.toLowerCase() || "");
                return selectedGenres.every(sg => movieGenreNames.includes(sg.toLowerCase()));
            });

            if (finalResults.length === 0) {
                setError("Hech narsa topilmadi. Boshqa filtrlarni tanlab ko'ring.");
            } else {
                // Filter out already seen movies
                let availableMovies = finalResults.filter(m => !seenMovies.includes(m.id));

                // If all movies have been seen, reset history and use all results
                if (availableMovies.length === 0) {
                    availableMovies = finalResults;
                    setSeenMovies([]);
                }

                const randomIndex = Math.floor(Math.random() * availableMovies.length);
                const selectedMovie = availableMovies[randomIndex];

                setResult(selectedMovie);
                setSeenMovies(prev => [...prev, selectedMovie.id]);
            }
        } catch (err) {
            console.error("Random search error:", err);
            setError("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white pt-24 pb-12 px-4 selection:bg-blue-500/30 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16 relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-600/10 blur-[100px] -z-10 animate-pulse"></div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic uppercase">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-cyan-400 drop-shadow-sm">RANDOM</span> TANLASH
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
                        Nima ko'rishni bilmayapsizmi? <br className="hidden md:block" />
                        Filtrlarni tanlang va biz sizga eng yaxshisini topib beramiz!
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* FILTERS SIDE */}
                    <div className="lg:col-span-5 space-y-12">
                        {/* CATEGORY */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                                    Kategoriya
                                </h3>
                                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-bold border border-blue-500/20">KO'P TANLASH MUMKIN</span>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                {categories.map(cat => {
                                    const isActive = selectedCategories.includes(cat.id);
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => toggleCategory(cat.id)}
                                            className={cn(
                                                "group relative flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 transition-all duration-300 overflow-hidden",
                                                isActive
                                                    ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_20px_50px_-15px_rgba(59,130,246,0.5)]"
                                                    : "border-gray-800 bg-gray-900/40 text-gray-400 hover:border-gray-700 hover:bg-gray-900/60"
                                            )}
                                        >
                                            <div className={cn(
                                                "mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                                                isActive ? "text-blue-400" : "text-gray-500"
                                            )}>
                                                {cat.icon}
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>

                                            {/* Selection Dot */}
                                            {isActive && (
                                                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* GENRES */}
                        <section>
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-8">
                                <div className="w-1.5 h-4 bg-purple-500 rounded-full"></div>
                                Janrlar
                            </h3>
                            <div className="flex flex-wrap gap-2.5">
                                {genresLoading ? (
                                    <div className="flex items-center gap-3 text-gray-500 bg-gray-900/50 px-6 py-4 rounded-2xl w-full border border-gray-800 border-dashed">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span className="text-sm font-medium">Janrlar yuklanmoqda...</span>
                                    </div>
                                ) : (
                                    genres?.map((genre: any) => {
                                        if (['anime', 'multfilm', 'serial'].includes(genre.name.toLowerCase())) return null;
                                        const isSelected = selectedGenres.includes(genre.name);
                                        return (
                                            <button
                                                key={genre.id}
                                                onClick={() => toggleGenre(genre.name)}
                                                className={cn(
                                                    "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 border-2",
                                                    isSelected
                                                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30"
                                                        : "bg-gray-800/40 border-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-200 hover:border-gray-700"
                                                )}
                                            >
                                                {genre.name}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </section>

                        <Button
                            onClick={handleRandomSearch}
                            disabled={isSearching}
                            className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl gap-4 rounded-2xl shadow-2xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 uppercase tracking-tighter italic"
                        >
                            {isSearching ? <Loader2 className="h-7 w-7 animate-spin" /> : <Shuffle className="h-7 w-7" />}
                            TASODIFIY QIDIRISH
                        </Button>
                    </div>

                    {/* RESULT SIDE */}
                    <div className="lg:col-span-7 min-h-[500px] flex items-center justify-center relative">
                        {/* Background Decoration */}
                        <div className="absolute inset-0 bg-blue-500/[0.03] blur-[120px] rounded-full pointer-events-none"></div>

                        {error && (
                            <div className="bg-red-500/5 border-2 border-red-500/20 px-10 py-8 rounded-[2rem] text-center animate-shake max-w-sm">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Info className="h-8 w-8 text-red-400" />
                                </div>
                                <p className="text-red-400 font-bold leading-relaxed">{error}</p>
                            </div>
                        )}

                        {!result && !isSearching && !error && (
                            <div className="text-center space-y-6 text-gray-500 animate-fade-in">
                                <div className="w-24 h-24 mx-auto rounded-[2rem] bg-gray-900 flex items-center justify-center border-4 border-gray-800 border-dashed group hover:border-blue-500/50 transition-colors">
                                    <Shuffle className="h-10 w-10 opacity-30 group-hover:opacity-50 group-hover:rotate-180 transition-all duration-700" />
                                </div>
                                <div className="space-y-2">
                                    <p className="font-black text-lg text-gray-400 uppercase tracking-widest italic">Tayyormisiz?</p>
                                    <p className="text-sm font-medium max-w-xs mx-auto text-gray-500">Filtrlarni tanlang va qidiruvni bosing</p>
                                </div>
                            </div>
                        )}

                        {isSearching && (
                            <div className="flex flex-col items-center gap-10">
                                <div className="relative">
                                    <div className="w-40 h-40 rounded-[2.5rem] border-4 border-blue-500/10 border-t-blue-500 animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Shuffle className="h-12 w-12 text-blue-500 animate-pulse" />
                                    </div>
                                    <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20"></div>
                                </div>
                                <div className="text-center space-y-3">
                                    <p className="text-blue-400 font-black animate-pulse tracking-[0.3em] text-2xl italic uppercase">IZLANMOQDA...</p>
                                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Sizga yoqadigan narsani topyapmiz</p>
                                </div>
                            </div>
                        )}

                        {result && !isSearching && (
                            <div className="w-full animate-scale-in">
                                <Link href={`/movies/${result.id}`} className="group relative block rounded-[2.5rem] overflow-hidden bg-gray-900 border border-gray-800 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-blue-500/40 hover:-translate-y-2">
                                    <div className="flex flex-col md:block relative">
                                        <div className="aspect-[4/5] md:aspect-[16/9] lg:aspect-[4/5] relative overflow-hidden">
                                            <Image
                                                src={getImageUrl(result.poster)}
                                                alt={result.title}
                                                fill
                                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent opacity-90 transition-opacity group-hover:opacity-80 md:block hidden"></div>
                                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f172a] to-transparent md:hidden"></div>

                                            {/* Quick Info */}
                                            <div className="absolute top-4 left-4 md:top-6 md:left-6 flex gap-2 md:gap-3">
                                                <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl bg-yellow-500 text-black text-[10px] md:text-xs font-black tracking-tight flex items-center gap-1.5 md:gap-2 shadow-2xl">
                                                    <Zap className="h-3.5 w-3.5 md:h-4 md:w-4 fill-current" />
                                                    {result.rating.toFixed(1)}
                                                </div>
                                                <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-xl text-white text-[10px] md:text-xs font-black tracking-tight shadow-2xl uppercase border border-white/10">
                                                    {result.releaseYear}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative md:absolute md:bottom-0 md:left-0 w-full p-6 md:p-10 space-y-4 md:space-y-6 bg-[#0f172a] md:bg-transparent">
                                            <div className="space-y-2 md:space-y-3">
                                                <div className="flex items-center gap-2 md:gap-3 text-blue-400 text-[8px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] uppercase italic">
                                                    <div className="h-[1px] md:h-[2px] w-6 md:w-8 bg-blue-500"></div>
                                                    SIZ UCHUN MAXSUS
                                                </div>
                                                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight  transition-colors uppercase italic tracking-tighter">
                                                    {result.title}
                                                </h2>
                                            </div>

                                            <p className="text-gray-400 text-xs md:text-sm lg:text-base line-clamp-3 md:line-clamp-2 lg:line-clamp-3 font-medium max-w-lg leading-relaxed opacity-80">
                                                {result.description}
                                            </p>

                                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 sm:gap-5 pt-2 md:pt-4">
                                                <Button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        let url = `https://t.me/KinoSitee_Bot?start=mov_${result.id}`;
                                                        if (result.type === 'SERIAL') {
                                                            url = `https://t.me/KinoSitee_Bot?start=seas_${result.id}_1`;
                                                        }
                                                        window.open(url, '_blank');
                                                    }}
                                                    className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 md:px-10 h-12 md:h-14 rounded-xl md:rounded-2xl gap-2 md:gap-3 shadow-2xl shadow-blue-600/40 group-hover:scale-105 transition-all text-xs md:text-sm uppercase italic tracking-widest w-full sm:w-auto"
                                                >
                                                    <Play className="h-5 w-5 md:h-6 md:w-6 fill-current" />
                                                    TOMOSHA QILISH
                                                </Button>
                                                <Link href={`/movies/${result.id}`} className="w-full sm:w-auto">
                                                    <Button variant="ghost" className="text-white hover:bg-white/10 font-black px-6 md:px-8 h-12 md:h-14 rounded-xl md:rounded-2xl gap-2 md:gap-3 border-2 border-white/5 backdrop-blur-md group-hover:border-white/20 transition-all text-xs md:text-sm uppercase tracking-widest w-full">
                                                        BATAFSIL
                                                        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.95) translateY(30px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-scale-in {
                    animation: scale-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                
                @media (max-width: 640px) {
                    .group.relative.block.rounded-\[2\.5rem\] {
                        border-radius: 2rem;
                    }
                    div.absolute.bottom-0.left-0.w-full.p-10 {
                        padding: 1.5rem;
                    }
                    h2.text-4xl.md\:text-5xl {
                        font-size: 1.75rem;
                    }
                    p.text-gray-400.text-sm.md\:text-base {
                        font-size: 0.75rem;
                        line-height: 1.4;
                    }
                }
            `}</style>
        </div>
    );
}
