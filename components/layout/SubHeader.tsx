"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, User, UserPlus, Flame, Film, Mail, Info, Send, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export function SubHeader() {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState("");

    const handleScrollTo = (id: string) => {
        if (pathname === '/') {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            router.push(`/#${id}`);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="w-full bg-[#1f2937] border-t border-gray-700/50 pt-1 md:pt-4 pb-2 md:pb-6 shadow-inner">
            <div className="container mx-auto px-4 space-y-2 md:space-y-6">

                {/* Mobile Telegram Join Button - Hidden on Desktop */}
                {/* <a
                    href="https://t.me/KinoSitee_Bot"
                    target="_blank"
                    className="xl:hidden w-full bg-[#3498db] hover:bg-[#2980b9] text-white py-3 rounded-md flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.98]"
                >
                    <Send className="h-5 w-5 fill-white" />
                    <span className="text-base font-bold">Bizga Telegramda qo'shiling!</span>
                </a> */}

                {/* Top Row: Auth Buttons & Action Icons (Hybrid) */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-1 md:gap-4">
                    {/* Left: Auth Buttons */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {!session ? (
                            <div className="grid grid-cols-2 xl:flex gap-2 w-full md:w-auto">
                                <Link href="/login" className="hidden xl:block w-full xl:w-auto">
                                    <Button className="bg-[#2a3142] xl:bg-[#2d3748] hover:bg-[#4a5568] text-gray-300 flex items-center justify-center gap-2 h-12 xl:h-9 px-4 rounded-md xl:rounded-sm border-none text-sm xl:text-xs">
                                        <User className="h-4 w-4" />
                                        Royhatdan o'tish
                                    </Button>
                                </Link>
                                {/* <Link href="/register" className="w-full xl:w-auto">
                                    <Button className="bg-[#2a3142] xl:bg-[#2d3748] hover:bg-[#4a5568] text-gray-300 flex items-center justify-center gap-2 h-12 xl:h-9 px-4 rounded-md xl:rounded-sm border-none text-sm xl:text-xs">
                                        Ro'yxatdan o'tish
                                    </Button>
                                </Link> */}
                            </div>
                        ) : (
                            <div className="text-gray-300 text-sm bg-[#2a3142] xl:bg-transparent px-4 py-3 xl:p-0 rounded-md w-full md:w-auto">
                                Xush kelibsiz, <span className="font-bold text-white uppercase">{session.user?.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Right: Desktop Action Icons */}
                    <div className="flex items-center gap-1 w-full md:w-auto justify-end">
                        {/* Desktop-only Icons (Restored) */}
                        <div className="hidden xl:flex items-center gap-1">
                            <Button
                                size="icon"
                                onClick={() => handleScrollTo('new-movies')}
                                className="bg-[#2d3748] hover:bg-[#4a5568] text-gray-400 hover:text-white rounded-sm h-9 w-10 border-none transition-colors"
                                title="Yangi Qo'shilganlar"
                            >
                                <Flame className="h-4 w-4" suppressHydrationWarning />
                            </Button>
                            <Button
                                size="icon"
                                onClick={() => handleScrollTo('top-rated')}
                                className="bg-[#2d3748] hover:bg-[#4a5568] text-gray-400 hover:text-white rounded-sm h-9 w-10 border-none transition-colors"
                                title="Eng Yuqori Reytingli"
                            >
                                <Film className="h-4 w-4" suppressHydrationWarning />
                            </Button>
                            <Button size="icon" className="bg-[#2d3748] hover:bg-[#4a5568] text-gray-400 hover:text-white rounded-sm h-9 w-10 border-none">
                                <Mail className="h-4 w-4" suppressHydrationWarning />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Search Bar */}
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Qidirish..."
                        className="w-full h-12 xl:h-11 bg-[#1a202c] border border-gray-700/50 rounded-md xl:rounded-sm px-6 xl:px-4 text-gray-200 xl:text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-base xl:text-sm italic"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-500 hover:text-white"
                    >
                        <Search className="h-5 w-5 xl:h-4 xl:w-4" suppressHydrationWarning />
                    </button>
                </div>

            </div>
        </div>
    );
}
