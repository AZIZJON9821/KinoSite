"use client";

import AdminGuard from "@/components/auth/AdminGuard";
import MovieForm from "@/components/admin/MovieForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AddMoviePage() {
    return (
        <AdminGuard>
            <div className="container mx-auto px-4 py-10">
                <Link href="/admin/movies" className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors w-fit">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Kinolarga qaytish
                </Link>

                <div className="mb-10">
                    <h1 className="text-3xl font-bold">Yangi Kino Qo'shish</h1>
                    <p className="text-gray-500">Ma'lumotlarni to'ldiring va poster yuklang</p>
                </div>

                <div className="bg-[#1a202c] border border-gray-800 rounded-xl p-6 md:p-10 shadow-xl">
                    <MovieForm />
                </div>
            </div>
        </AdminGuard>
    );
}
