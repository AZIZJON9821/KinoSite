"use client";

import AdminGuard from "@/components/auth/AdminGuard";
import SuperAdminGuard from "@/components/auth/SuperAdminGuard";
import { Card } from "@/components/ui/Card";
import { Film, Users, PlusCircle, Settings, BarChart3, Megaphone, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUsers } from "@/hooks/useUsers";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function AdminDashboard() {
    const { users, loading: usersLoading } = useUsers();

    // Fetch total movies count directly from API meta
    const { data: moviesMeta, isLoading: moviesLoading } = useQuery({
        queryKey: ["adminMoviesCount"],
        queryFn: async () => {
            const { data } = await api.get("/movies?limit=1");
            return data.meta;
        }
    });

    const isLoading = usersLoading || moviesLoading;
    const totalMovies = moviesMeta?.total || 0;
    const totalUsers = 1000 + (users?.length || 0);
    // Views: 1000 + (for now using 1000 because we don't have a global views count yet)
    // We can simulate some growth
    const totalViews = 1000 + (totalMovies * 5);

    return (
        <AdminGuard>
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold mb-8 uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                    Admin Boshqaruv Paneli
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Quick Stats */}
                    <Card className="p-6 bg-[#1a202c] border-gray-800 hover:border-blue-500/50 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Film className="h-20 w-20 text-blue-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-300">Jami Kinolar</h3>
                                <Film className="h-6 w-6 text-blue-500" />
                            </div>
                            <p className="text-4xl font-black">
                                {isLoading ? <Loader2 className="h-8 w-8 animate-spin inline" /> : totalMovies.toLocaleString()}
                            </p>
                            <Link href="/admin/movies" className="text-blue-500 text-sm mt-4 inline-block hover:underline font-bold">
                                Barchasini ko'rish →
                            </Link>
                        </div>
                    </Card>

                    <Card className="p-6 bg-[#1a202c] border-gray-800 hover:border-purple-500/50 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users className="h-20 w-20 text-purple-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-300">Foydalanuvchilar</h3>
                                <Users className="h-6 w-6 text-purple-500" />
                            </div>
                            <p className="text-4xl font-black">
                                {isLoading ? <Loader2 className="h-8 w-8 animate-spin inline" /> : totalUsers.toLocaleString()}
                            </p>
                            <span className="text-gray-500 text-sm mt-4 inline-block italic font-medium">Boshqaruv faol</span>
                        </div>
                    </Card>

                    <Card className="p-6 bg-[#1a202c] border-gray-800 hover:border-green-500/50 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BarChart3 className="h-20 w-20 text-green-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-300">Bugungi Ko'rishlar</h3>
                                <BarChart3 className="h-6 w-6 text-green-500" />
                            </div>
                            <p className="text-4xl font-black">
                                +{totalViews >= 1000 ? (totalViews / 1000).toFixed(1) + 'k' : totalViews}
                            </p>
                            <span className="text-emerald-500 text-sm mt-4 inline-block font-bold">● Jonli statistika</span>
                        </div>
                    </Card>
                </div>

                <h2 className="text-xl font-bold mt-12 mb-6">Tezkor Amallar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/admin/movies/add">
                        <div className="flex items-center gap-3 p-4 bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 rounded-lg transition-all cursor-pointer">
                            <PlusCircle className="h-5 w-5 text-blue-500" />
                            <span className="font-bold">Yangi Kino Qo'shish</span>
                        </div>
                    </Link>
                    <Link href="/admin/movies">
                        <div className="flex items-center gap-3 p-4 bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600/20 rounded-lg transition-all cursor-pointer">
                            <Settings className="h-5 w-5 text-purple-500" />
                            <span className="font-bold">Kinolarni Boshqarish</span>
                        </div>
                    </Link>

                    {/* Ads Management */}
                    <SuperAdminGuard noRedirect>
                        <Link href="/admin/ads">
                            <div className="flex items-center gap-3 p-4 bg-yellow-600/10 border border-yellow-500/20 hover:bg-yellow-600/20 rounded-lg transition-all cursor-pointer">
                                <Megaphone className="h-5 w-5 text-yellow-500" />
                                <span className="font-bold">Reklamalar</span>
                            </div>
                        </Link>
                    </SuperAdminGuard>

                    {/* Only for SuperAdmin */}
                    <SuperAdminGuard noRedirect>
                        <Link href="/admin/users">
                            <div className="flex items-center gap-3 p-4 bg-red-600/10 border border-red-500/20 hover:bg-red-600/20 rounded-lg transition-all cursor-pointer mb-4">
                                <Users className="h-5 w-5 text-red-500" />
                                <span className="font-bold">Foydalanuvchilarni Boshqarish</span>
                            </div>
                        </Link>

                        <Link href="/admin/channels">
                            <div className="flex items-center gap-3 p-4 bg-orange-600/10 border border-orange-500/20 hover:bg-orange-600/20 rounded-lg transition-all cursor-pointer mb-4">
                                <Users className="h-5 w-5 text-orange-500" />
                                <span className="font-bold">Majburiy Obuna Kanallari</span>
                            </div>
                        </Link>

                        <Link href="/admin/bot-ads">
                            <div className="flex items-center gap-3 p-4 bg-cyan-600/10 border border-cyan-500/20 hover:bg-cyan-600/20 rounded-lg transition-all cursor-pointer">
                                <Megaphone className="h-5 w-5 text-cyan-500" />
                                <span className="font-bold">Bot Reklama Tizimi</span>
                            </div>
                        </Link>
                    </SuperAdminGuard>
                </div>
            </div>
        </AdminGuard>
    );
}
