"use client";

import { Episode } from "@/types/movie";
import { Play } from "lucide-react";
import Link from "next/link";
import { cn, getImageUrl } from "@/lib/utils";

interface EpisodeListProps {
    episodes: Episode[];
    movieId: string;
    coverImage?: string;
}

export function EpisodeList({ episodes, movieId, coverImage }: EpisodeListProps) {
    if (!episodes || episodes.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-6">Episodes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {episodes.map((episode, index) => (
                    <Link
                        key={episode.id}
                        href={`/watch/${episode.id}?movieId=${movieId}`}
                        className="group flex gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        {/* Thumbnail */}
                        <div className="relative w-40 aspect-video rounded overflow-hidden flex-shrink-0 bg-gray-800">
                            <img
                                src={getImageUrl(episode.thumbnailUrl || coverImage)}
                                alt={episode.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                            <span className="absolute bottom-1 left-1 text-[10px] bg-black/80 px-1 rounded text-white">
                                {episode.duration}m
                            </span>
                        </div>

                        {/* Info */}
                        <div className="flex flex-col justify-center">
                            <h4 className="text-white font-semibold group-hover:text-primary transition-colors line-clamp-1">
                                {index + 1}. {episode.title}
                            </h4>
                            <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                                {episode.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
