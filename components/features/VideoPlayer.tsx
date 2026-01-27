"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
    src: string;
    poster?: string;
    autoPlay?: boolean;
    onEnded?: () => void;
}

export function VideoPlayer({ src, poster, autoPlay = false, onEnded }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (autoPlay) {
            video.play().catch(() => setIsPlaying(false));
        }

        const handleTimeUpdate = () => setCurrentTime(video.currentTime);
        const handleDurationChange = () => setDuration(video.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            if (onEnded) onEnded();
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("durationchange", handleDurationChange);
        video.addEventListener("ended", handleEnded);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("durationchange", handleDurationChange);
            video.removeEventListener("ended", handleEnded);
        };
    }, [autoPlay, onEnded]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            videoRef.current?.parentElement?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        // @ts-ignore
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    return (
        <div
            className="relative w-full aspect-video bg-black group overflow-hidden rounded-lg shadow-2xl"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-contain"
                onClick={togglePlay}
            />

            {/* Controls Overlay */}
            <div
                className={cn(
                    "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-4 pt-12 transition-opacity duration-300",
                    showControls || !isPlaying ? "opacity-100" : "opacity-0"
                )}
            >
                {/* Progress Bar */}
                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer mb-4 accent-primary hover:h-2 transition-all"
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:text-primary">
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
                        </Button>

                        <div className="flex items-center gap-2 group/volume relative">
                            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:text-primary">
                                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                            </Button>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.1}
                                value={isMuted ? 0 : volume}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    setVolume(val);
                                    if (videoRef.current) videoRef.current.volume = val;
                                    setIsMuted(val === 0);
                                }}
                                className="w-20 accent-primary hidden group-hover/volume:block transition-all"
                            />
                        </div>

                        <span className="text-sm text-gray-300 font-medium">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-white hover:text-primary">
                            <SkipForward className="h-6 w-6" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:text-primary">
                            {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Center Play Button (only when paused) */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 p-4 rounded-full backdrop-blur-sm border border-white/20">
                        <Play className="h-12 w-12 text-white fill-white ml-1" />
                    </div>
                </div>
            )}
        </div>
    );
}
