"use client";

import { useActiveAds, Advertisement } from "@/hooks/useAds";
import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const AD_DURATION = 10; // seconds
const DELAY_BETWEEN_ADS = 2000; // milliseconds
const LOOP_INTERVAL = 3 * 60 * 1000; // 3 minutes

export function AdPopup() {
    const { data: ads } = useActiveAds();
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [status, setStatus] = useState<'showing' | 'delay' | 'waiting'>('waiting');
    const [timeLeft, setTimeLeft] = useState(AD_DURATION);
    const [hasCompletedCycle, setHasCompletedCycle] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Use refs to always have the latest values
    const adsRef = useRef(ads);
    const currentAdIndexRef = useRef(currentAdIndex);

    // Update refs when values change
    useEffect(() => {
        adsRef.current = ads;
    }, [ads]);

    useEffect(() => {
        currentAdIndexRef.current = currentAdIndex;
    }, [currentAdIndex]);

    // Start ad sequence on initial load
    useEffect(() => {
        if (ads && ads.length > 0 && status === 'waiting' && !hasCompletedCycle) {
            console.log('🎬 Starting ad sequence with', ads.length, 'ads');
            setStatus('showing');
            setCurrentAdIndex(0);
            setTimeLeft(AD_DURATION);
        }
    }, [ads, status, hasCompletedCycle]);

    // Handle restart after 3-minute waiting period
    useEffect(() => {
        if (status === 'waiting' && hasCompletedCycle) {
            console.log('⏰ All ads completed. Waiting 3 minutes before restart...');
            timeoutRef.current = setTimeout(() => {
                console.log('✅ 3 minutes passed. Restarting ad sequence...');
                setHasCompletedCycle(false);
                setCurrentAdIndex(0);
                setTimeLeft(AD_DURATION);
                setStatus('showing');
            }, LOOP_INTERVAL);

            return () => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            };
        }
    }, [status, hasCompletedCycle]);

    // Handle ad countdown timer
    useEffect(() => {
        if (status === 'showing') {
            // Start countdown timer
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            };
        }
    }, [status, currentAdIndex]);

    // Timer reaches 0 - just log it, X button becomes available
    useEffect(() => {
        if (timeLeft === 0 && status === 'showing') {
            const totalAds = adsRef.current?.length || 0;
            const currentIndex = currentAdIndexRef.current;

            console.log(`⏱️ Timer finished for ad ${currentIndex + 1}/${totalAds}. X button now available.`);
        }
    }, [timeLeft, status]);

    // Handle video end - auto advance to next ad
    const handleVideoEnd = () => {
        const totalAds = adsRef.current?.length || 0;
        const currentIndex = currentAdIndexRef.current;

        console.log(`🎬 Video ad ${currentIndex + 1}/${totalAds} finished playing`);

        if (currentIndex < totalAds - 1) {
            // More ads to show
            console.log(`⏭️ Auto-advancing to ad ${currentIndex + 2}/${totalAds} after 2s delay`);
            setStatus('delay');
            timeoutRef.current = setTimeout(() => {
                setCurrentAdIndex(currentIndex + 1);
                setTimeLeft(AD_DURATION);
                setStatus('showing');
            }, DELAY_BETWEEN_ADS);
        } else {
            // All ads shown, mark cycle as complete and wait
            console.log('🏁 All ads shown!');
            setHasCompletedCycle(true);
            setStatus('waiting');
        }
    };

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Called when user clicks X button (Manual Close)
    const handleCloseAd = (e: React.MouseEvent) => {
        e.stopPropagation();

        const totalAds = adsRef.current?.length || 0;
        const currentIndex = currentAdIndexRef.current;

        console.log(`❌ User closed ad ${currentIndex + 1}/${totalAds}`);

        if (currentIndex < totalAds - 1) {
            // More ads to show
            setStatus('delay');
            timeoutRef.current = setTimeout(() => {
                setCurrentAdIndex(currentIndex + 1);
                setTimeLeft(AD_DURATION);
                setStatus('showing');
            }, DELAY_BETWEEN_ADS);
        } else {
            // All ads shown
            setHasCompletedCycle(true);
            setStatus('waiting');
        }
    };

    const handleAdClick = () => {
        if (currentAd?.link) {
            window.open(currentAd.link, '_blank');
        }
    };

    const currentAd = ads?.[currentAdIndex];

    if (status !== 'showing' || !currentAd) return null;

    const getAdUrl = (path: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        return `${baseUrl}/uploads/ads/${path}`;
    };

    return (
        <AnimatePresence>
            {status === 'showing' && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    className="fixed bottom-4 right-4 z-[100] w-80 sm:w-96 bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-800/80 backdrop-blur-sm absolute top-0 left-0 right-0 z-10 pointer-events-none">
                        <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-700 px-2 py-0.5 rounded">
                            Reklama
                        </span>
                        <div className="flex items-center gap-2 pointer-events-auto">
                            {timeLeft > 0 ? (
                                <span className="text-xs text-white font-mono">{timeLeft}s</span>
                            ) : (
                                <button
                                    onClick={handleCloseAd}
                                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors animate-pulse"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content - Clickable */}
                    <div
                        className={`aspect-video w-full bg-black relative cursor-pointer group`}
                        onClick={handleAdClick}
                    >
                        {currentAd.type === 'VIDEO' ? (
                            <video
                                key={currentAd.id}
                                src={getAdUrl(currentAd.mediaUrl)}
                                autoPlay
                                muted
                                playsInline
                                onEnded={handleVideoEnd}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <img
                                key={currentAd.id}
                                src={getAdUrl(currentAd.mediaUrl)}
                                alt={currentAd.title}
                                className="w-full h-full object-contain"
                            />
                        )}

                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                            <h4 className="text-white font-bold text-sm truncate">{currentAd.title}</h4>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
