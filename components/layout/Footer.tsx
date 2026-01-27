import Link from "next/link";
import { PlayCircle } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-[#1a202c] border-t border-gray-800 py-6 px-4 mt-auto">
            <div className="container mx-auto flex flex-col items-center justify-center">
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-0 group shrink-0">
                    <span className="text-xl md:text-3xl font-black italic tracking-tighter text-white uppercase">KIN</span>
                    <div className="relative ml-0.5 md:ml-1.5 mr-0">
                        <PlayCircle className="h-6 w-6 md:h-9 md:w-9 text-blue-500 fill-blue-500/20 group-hover:text-blue-400 transition-colors" />
                        <div className="absolute inset-0 bg-blue-500 blur-lg opacity-30 rounded-full"></div>
                    </div>
                    <span className="text-xl md:text-3xl font-black italic tracking-tighter text-white uppercase">SITE</span>
                    <span className="text-sm md:text-xl font-bold text-gray-500 italic mt-auto ml-0.5">.COM</span>
                </Link>

                <div className="mt-8 text-center text-[10px] text-gray-600 uppercase tracking-[0.3em] font-bold opacity-40">
                    © {new Date().getFullYear()} KINOSITE. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
