"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Bell, User, ChevronDown, PlayCircle, ShieldCheck, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useGenres } from "@/hooks/useGenres";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();
    const { data: genres } = useGenres();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { label: "BOSH SAHIFA", href: "/" },
        {
            label: "KINOLAR",
            href: "#",
            children: [
                { label: "BARCHA KINOLAR", href: "/movies?type=MOVIE&excludeGenres=anime,multfilm" },
                {
                    label: "ANIMELAR",
                    href: "/movies?type=MOVIE&genre=anime"
                },
                {
                    label: "MULTFILMLAR",
                    href: "/movies?type=MOVIE&genre=multfilm"
                },
                {
                    label: "SERIALLAR",
                    href: "/movies?type=SERIAL"
                },
            ]
        },
        {
            label: "SERIALLAR",
            href: "#",
            children: [
                { label: "BARCHA SERIALLAR", href: "/movies?type=SERIAL" },
                { label: "DETEKTIV", href: "/movies?type=SERIAL&genre=detektiv" },
                { label: "ROMANTIK", href: "/movies?type=SERIAL&genre=romantik" },
                { label: "JANGARI", href: "/movies?type=SERIAL&genre=jangari" },
                { label: "KOMEDIYA", href: "/movies?type=SERIAL&genre=komediya" },
                { label: "SARGUZASHT", href: "/movies?type=SERIAL&genre=sarguzasht" },
            ]
        },

        {
            label: "JANR",
            href: "#",
            children: [
                ...(Array.isArray(genres)
                    ? genres
                        .filter(g => g.name.toLowerCase() !== "serial")
                        .map(g => ({
                            label: g.name,
                            href: `/movies?genre=${g.name}`
                        }))
                    : [])
            ]
        },
        { label: "RANDOM", href: "/random" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-colors duration-500 font-sans",
                isScrolled ? "bg-[#1a202c]/95 backdrop-blur-sm shadow-md" : "bg-[#1a202c]"
            )}
        >
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
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

                {/* NAVIGATION - Desktop */}
                <nav className="hidden xl:flex items-center gap-6">
                    {navItems.map((item) => (
                        <div key={item.label} className="relative group">
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-1 text-[13px] font-bold text-gray-300 hover:text-blue-400 transition-colors uppercase py-6",
                                    pathname === item.href && "text-white"
                                )}
                            >
                                {item.label}
                                {item.children && <ChevronDown className="h-3 w-3 mt-0.5 group-hover:rotate-180 transition-transform" />}
                            </Link>

                            {/* DROPDOWN */}
                            {item.children && item.children.length > 0 && (
                                <div className="absolute left-0 top-full w-48 bg-[#1f2937] border-t-2 border-blue-500 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 rounded-b-md overflow-hidden">
                                    <div className="py-2 flex flex-col">
                                        {item.children.map(child => (
                                            <Link
                                                key={child.label}
                                                href={child.href}
                                                className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-left"
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* MOBILE MENU BUTTON/TITLE */}
                <div className="xl:hidden flex items-center order-first mr-1">
                    <Button
                        variant="ghost"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="h-10 w-10 p-0 hover:bg-white/10 rounded-full text-gray-300"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>

                {/* RIGHT SIDE ACTIONS */}
                <div className="flex items-center gap-1 md:gap-4">
                    {session ? (
                        <div className="flex items-center gap-1">
                            {(session.user.role?.toUpperCase() === 'ADMIN' || session.user.role?.toUpperCase() === 'SUPER_ADMIN') && (
                                <Link href="/admin">
                                    <Button variant="ghost" className="h-10 w-10 md:h-11 md:w-11 p-0 hover:bg-white/10 rounded-full text-blue-400">
                                        <ShieldCheck className="h-6 w-6 md:h-7 md:w-7" />
                                    </Button>
                                </Link>
                            )}
                            <Link href="/profile">
                                <Button variant="ghost" className="h-10 w-10 md:h-11 md:w-11 p-0 hover:bg-white/10 rounded-full">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="User" className="h-9 w-9 md:h-11 md:w-11 rounded-full border border-gray-600" />
                                    ) : (
                                        <User className="h-6 w-6 md:h-7 md:w-7 text-gray-300" />
                                    )}
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center">
                            <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-white/10 rounded-full xl:hidden">
                                <User className="h-6 w-6 text-gray-400" />
                            </Button>
                            <Button variant="default" className="hidden xl:flex bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-6 uppercase text-xs tracking-wider rounded-sm ml-2">
                                Kirish
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* MOBILE NAVIGATION DRAWER */}
            <div
                className={cn(
                    "fixed inset-0 top-[82px] z-40 bg-[#1f2937] transition-transform duration-300 xl:hidden overflow-y-auto px-4 py-8",
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <nav className="flex flex-col gap-3">
                    {navItems
                        .map((item, index) => {
                            const colors = ['border-orange-500', 'border-green-500', 'border-blue-500', 'border-purple-500', 'border-yellow-500', 'border-red-500'];
                            const borderColor = colors[index % colors.length];
                            const isOpen = activeDropdown === item.label;

                            return (
                                <div key={item.label} className={cn("bg-[#2d3748] border-b-2 rounded-sm transition-all duration-300", borderColor)}>
                                    <div className="flex flex-col">
                                        <div
                                            className="flex items-center justify-between px-4 py-3 cursor-pointer"
                                            onClick={() => {
                                                if (item.children) {
                                                    setActiveDropdown(isOpen ? null : item.label);
                                                } else {
                                                    setIsMenuOpen(false);
                                                }
                                            }}
                                        >
                                            <div className="flex-1">
                                                {item.children ? (
                                                    <span className={cn(
                                                        "text-sm font-bold text-gray-300 uppercase",
                                                        isOpen && "text-white"
                                                    )}>
                                                        {item.label}
                                                    </span>
                                                ) : (
                                                    <Link
                                                        href={item.href}
                                                        className={cn(
                                                            "text-sm font-bold text-gray-300 hover:text-white uppercase block w-full",
                                                            pathname === item.href && "text-white"
                                                        )}
                                                    >
                                                        {item.label}
                                                    </Link>
                                                )}
                                            </div>
                                            {item.children && (
                                                <ChevronDown className={cn(
                                                    "h-4 w-4 text-gray-400 transition-transform duration-300",
                                                    isOpen && "rotate-180 text-white"
                                                )} />
                                            )}
                                        </div>
                                        {item.children && isOpen && (
                                            <div className="bg-[#1a202c]/50 px-4 py-2 flex flex-col gap-2">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.label}
                                                        href={child.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="text-xs text-gray-400 hover:text-white py-2 border-t border-gray-700/50"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </nav>

            </div>

            {/* SEPARATOR LINE */}
            <div className="w-full h-[2px] flex">
                <div className="h-full w-1/5 bg-blue-500"></div>
                <div className="h-full w-1/5 bg-green-500"></div>
                <div className="h-full w-1/5 bg-red-500"></div>
                <div className="h-full w-1/5 bg-yellow-500"></div>
                <div className="h-full w-1/5 bg-purple-500"></div>
            </div>
        </header>
    );
}
