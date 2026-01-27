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

            <div className="container mx-auto px-4 py-10">
                <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800">
                    <h1 className="text-3xl font-bold mb-8">Account</h1>

                    <div className="flex items-center gap-6 mb-8">
                        {session.user?.image ? (
                            <img src={session.user.image} alt={session.user.name || "User"} className="w-20 h-20 rounded-full" />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-2xl font-bold">
                                {session.user?.name?.[0] || "U"}
                            </div>
                        )}

                        <div>
                            <h2 className="text-xl font-semibold">{session.user?.name}</h2>
                            <p className="text-gray-400">{session.user?.email}</p>
                            <p className="text-gray-500 text-sm mt-1">Member since 2024</p>
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
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-green-500 rounded-full"></span>
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
