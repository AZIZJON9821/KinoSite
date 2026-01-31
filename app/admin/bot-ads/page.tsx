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
        mediaUrl: "",
        mediaType: "image" as "image" | "video"
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
            const { data } = await axios.post("/api-backend/bot/broadcast", {
                message: form.message,
                mediaUrl: form.mediaUrl || undefined,
                mediaType: form.mediaUrl ? form.mediaType : undefined
            }, {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                }
            });

            setStats(data);
            toast.success(`Xabar yuborildi! Muvaffaqiyatli: ${data.sent}, Xatolik: ${data.failed}`);
            setForm({ message: "", mediaUrl: "", mediaType: "image" });
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
                        Telegram bot foydalanuvchilariga ommaviy xabar yuborish (Broadcast).
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
                                        Media URL (Ixtiyoriy)
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Input
                                                placeholder="https://example.com/image.jpg"
                                                value={form.mediaUrl}
                                                onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                                                className="pl-10"
                                            />
                                            {form.mediaType === 'image' ? (
                                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            )}
                                        </div>
                                        <select
                                            className="bg-gray-900 border border-gray-700 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                                            value={form.mediaType}
                                            onChange={(e) => setForm({ ...form, mediaType: e.target.value as "image" | "video" })}
                                        >
                                            <option value="image">Rasm</option>
                                            <option value="video">Video</option>
                                        </select>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Rasm yoki video internetda ochiq bo'lishi kerak (Direct Link).
                                    </p>
                                </div>

                                {form.mediaUrl && (
                                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                                        <p className="text-xs text-gray-400 mb-2">Media Preview:</p>
                                        {form.mediaType === 'image' ? (
                                            <img src={form.mediaUrl} alt="Preview" className="max-h-48 rounded mx-auto object-contain" />
                                        ) : (
                                            <video src={form.mediaUrl} controls className="max-h-48 rounded mx-auto w-full" />
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
