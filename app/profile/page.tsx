"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSavedMovies } from "@/hooks/useMovies";
import { MovieGrid } from "@/components/ui/MovieGrid";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { data: savedMovies, isLoading: savedMoviesLoading } = useSavedMovies(status === "authenticated");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    if (!session) return null;

    return (
        <div className="bg-transparent text-white">

            <div className="container mx-auto px-4 md:px-8 py-10">
                <div className="bg-gray-900/50 p-4 sm:p-8 rounded-xl border border-gray-800 backdrop-blur-sm shadow-xl">
                    <h1 className="text-3xl font-bold mb-8">Account</h1>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 text-center sm:text-left">
                        {session.user?.image ? (
                            <img src={session.user.image} alt={session.user.name || "User"} className="w-20 h-20 rounded-full border-2 border-primary/50 shadow-lg" />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-2xl font-bold shadow-lg">
                                {session.user?.name?.[0] || "U"}
                            </div>
                        )}

                        <div className="min-w-0 w-full">
                            <h2 className="text-xl font-bold text-white mb-1 truncate">{session.user?.name}</h2>
                            <p className="text-gray-400 break-all mb-2">{session.user?.email}</p>
                            <div className="inline-block px-3 py-1 bg-gray-800/50 border border-gray-700/50 rounded-full">
                                <p className="text-gray-500 text-xs">A'zo bo'lgan: 2024</p>
                            </div>
                        </div>
                    </div>

                    <div>

                        <div className="pt-6 border-t border-gray-800">
                            <Button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                variant="destructive"
                                className="w-full"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]"></span>
                        Saqlangan kinolar
                    </h2>
                    {savedMoviesLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-primary w-8 h-8" />
                        </div>
                    ) : savedMovies && savedMovies.length > 0 ? (
                        <div className="w-full overflow-x-auto scrollbar-hide">
                            <MovieGrid movies={savedMovies} />
                        </div>
                    ) : (
                        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-10 text-center">
                            <p className="text-gray-400 text-lg">Hozircha saqlangan kinolar yo'q</p>
                            <Button
                                variant="outline"
                                className="mt-4 border-gray-700 text-gray-300 hover:text-white"
                                onClick={() => router.push('/movies')}
                            >
                                Kinolarni ko'rish
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
