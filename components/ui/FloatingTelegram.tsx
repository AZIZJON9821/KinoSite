"use client";

import { Send } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function FloatingTelegram() {
    // Replace with your actual Telegram channel or bot link
    const telegramLink = "https://t.me/KinoSiteUz";

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: [1, 1.1, 1],
                opacity: 1
            }}
            transition={{
                scale: {
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                },
                opacity: { duration: 0.5 }
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[60]"
        >
            <Link
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-[#2190D4] rounded-full shadow-[0_4px_20px_rgba(33,144,212,0.6)] group border border-white/20 overflow-hidden"
            >
                {/* BG Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Telegram Icon (using paper plane SVG) */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 md:w-8 md:h-8 text-white fill-white"
                >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                </svg>

                {/* Animated Ring - Pulsing */}
                <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-full border-2 border-white/40"
                ></motion.div>

                {/* Outer Glow Effect */}
                <div className="absolute -inset-2 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-50 transition-opacity -z-10"></div>
            </Link>
        </motion.div>
    );
}
