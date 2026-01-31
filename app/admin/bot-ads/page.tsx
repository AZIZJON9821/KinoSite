"use client";

import AdminGuard from "@/components/auth/AdminGuard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Send, Image as ImageIcon, Video, AlertCircle } from "lucide-react";

export default function BotAdsPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<{ sent: number; failed: number } | null>(null);

    const [form, setForm] = useState({
        message: "",
        file: null as File | null
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.message) {
            toast.error("Xabar matni yozilishi shart!");
            return;
        }

        if (!confirm("Diqqat! Bu xabar barcha bot foydalanuvchilariga yuboriladi. Davom etasizmi?")) {
            return;
        }

        setLoading(true);
        setStats(null);

        try {
            const formData = new FormData();
            formData.append("message", form.message);
            if (form.file) {
                formData.append("file", form.file);
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api-backend';
            const { data } = await axios.post(`${apiUrl}/bot/broadcast`, formData, {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            setStats(data);
            toast.success(`Xabar yuborildi! Muvaffaqiyatli: ${data.sent}, Xatolik: ${data.failed}`);
            setForm({ message: "", file: null });
        } catch (error: any) {
            console.error("Broadcast error:", error);
            const errorMsg = error.response?.data?.message || "Xabar yuborishda xatolik yuz berdi";
            toast.error(`Xatolik: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminGuard>
            <div className="container mx-auto px-4 py-10 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Bot Reklama Tizimi 🤖</h1>
                    <p className="text-gray-400">
                        Telegram bot foydalanuvchilariga ommaviy xabar yuborish (Rasm/Video fayl bilan).
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="md:col-span-2">
                        <div className="bg-[#1a202c] border border-gray-800 rounded-xl p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Xabar Matni <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 min-h-[150px]"
                                        placeholder="Xabaringizni shu yerga yozing..."
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        HTML formatlash (bold, italic, link) qo'llab-quvvatlanadi.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Rasm yoki Video yuklash (Ixtiyoriy)
                                    </label>
                                    <Input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
                                        className="bg-gray-900 border-gray-700 text-gray-300 file:bg-blue-600 file:text-white file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-4 file:text-sm hover:file:bg-blue-700"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Fayl to'g'ridan-to'g'ri Telegramga yuklanadi (Serverda saqlanmaydi).
                                    </p>
                                </div>

                                {form.file && (
                                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                                        <p className="text-xs text-gray-400 mb-2">Fayl: {form.file.name}</p>
                                        {form.file.type.startsWith('image') ? (
                                            <img
                                                src={URL.createObjectURL(form.file)}
                                                alt="Preview"
                                                className="max-h-48 rounded mx-auto object-contain"
                                                onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                                            />
                                        ) : (
                                            <video
                                                src={URL.createObjectURL(form.file)}
                                                controls
                                                className="max-h-48 rounded mx-auto w-full"
                                                onLoadedData={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                                            />
                                        )}
                                    </div>
                                )}


                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            Yuborilmoqda... <span className="animate-pulse">⏳</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Send className="h-5 w-5" />
                                            Xabarni Yuborish
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Info / Stats Section */}
                    <div className="space-y-6">
                        {stats && (
                            <div className="bg-green-900/20 border border-green-800 rounded-xl p-6 animate-fade-in">
                                <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5" />
                                    Natija
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-300">Yuborildi:</span>
                                        <span className="font-bold text-green-400">{stats.sent} ta</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-300">Xatolik:</span>
                                        <span className="font-bold text-red-400">{stats.failed} ta</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-[#1a202c] border border-gray-800 rounded-xl p-6">
                            <h3 className="font-bold mb-4 text-gray-200">Eslatmalar</h3>
                            <ul className="space-y-3 text-sm text-gray-400 list-disc list-inside">
                                <li>Xabarlar ketma-ket, kichik pauza bilan yuboriladi (Telegram limiti sababli).</li>
                                <li>Agar foydalanuvchi botni bloklagan bo'lsa, xabar yetib bormaydi.</li>
                                <li>HTML teglardan foydalanishingiz mumkin:
                                    <pre className="mt-2 bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                                        &lt;b&gt;Qalin&lt;/b&gt;{"\n"}
                                        &lt;i&gt;Kursiv&lt;/i&gt;{"\n"}
                                        &lt;a href="link"&gt;Havola&lt;/a&gt;
                                    </pre>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
