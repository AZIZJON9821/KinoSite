"use client";

import AdminGuard from "@/components/auth/AdminGuard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { PlusCircle, Trash2, Send, Instagram } from "lucide-react";

interface Channel {
    id: string;
    name: string;
    link: string;
    channelId?: string;
    type: 'TELEGRAM' | 'INSTAGRAM';
    createdAt: string;
}

export default function ChannelsPage() {
    const { data: session } = useSession();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    const [form, setForm] = useState({
        name: "",
        link: "",
        channelId: "",
        type: "TELEGRAM" as "TELEGRAM" | "INSTAGRAM"
    });

    const fetchChannels = async () => {
        try {
            const { data } = await axios.get("/api-backend/channels", {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            });
            setChannels(data);
        } catch (error) {
            console.error("Error fetching channels:", error);
            toast.error("Kanallarni yuklashda xatolik!");
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        if (session?.accessToken) {
            fetchChannels();
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("/api-backend/channels", form, {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            });
            toast.success("Kanal qo'shildi!");
            setForm({ name: "", link: "", channelId: "", type: "TELEGRAM" });
            fetchChannels();
        } catch (error: any) {
            console.error("Error adding channel:", error);
            const errorMsg = error.response?.data?.message || "Xatolik yuz berdi";
            toast.error(`Xatolik: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Haqiqatan ham bu kanalni o'chirmoqchimisiz?")) return;
        try {
            await axios.delete(`/api-backend/channels/${id}`, {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            });
            toast.success("Kanal o'chirildi!");
            fetchChannels();
        } catch (error) {
            toast.error("O'chirishda xatolik!");
        }
    };

    return (
        <AdminGuard>
            <div className="container mx-auto px-4 py-10 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Majburiy Obuna Kanallari 📢</h1>
                    <p className="text-gray-400">
                        Botdan foydalanish uchun majburiy kanallar ro'yxatini boshqarish.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Add Form */}
                    <div className="md:col-span-1">
                        <div className="bg-[#1a202c] border border-gray-800 rounded-xl p-6 sticky top-4">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <PlusCircle className="h-5 w-5 text-blue-500" />
                                Yangi Kanal
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400">Kanal Nomi</label>
                                    <Input
                                        placeholder="Masalan: Kino News"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Turi</label>
                                    <select
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white"
                                        value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                                    >
                                        <option value="TELEGRAM">Telegram</option>
                                        <option value="INSTAGRAM">Instagram</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Link (A'zo bo'lish uchun)</label>
                                    <Input
                                        placeholder="https://t.me/kino"
                                        value={form.link}
                                        onChange={(e) => setForm({ ...form, link: e.target.value })}
                                        required
                                    />
                                </div>
                                {form.type === 'TELEGRAM' && (
                                    <div>
                                        <label className="text-xs text-gray-400">Telegram Channel ID</label>
                                        <Input
                                            placeholder="-100xxxxxxx"
                                            value={form.channelId}
                                            onChange={(e) => setForm({ ...form, channelId: e.target.value })}
                                        />
                                        <p className="text-[10px] text-gray-500 mt-1">
                                            Avtomatik tekshirish uchun kerak. Bot shu kanalda <b>Admin</b> bo'lishi shart!
                                        </p>
                                    </div>
                                )}
                                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                                    {loading ? "Saqlanmoqda..." : "Qo'shish"}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Check List */}
                    <div className="md:col-span-2 space-y-4">
                        {fetchLoading ? (
                            <p className="text-center text-gray-500">Yuklanmoqda...</p>
                        ) : channels.length === 0 ? (
                            <p className="text-center text-gray-500 bg-[#1a202c] p-6 rounded-xl">Hozircha kanallar yo'q</p>
                        ) : (
                            channels.map((channel) => (
                                <div key={channel.id} className="flex items-center justify-between bg-[#1a202c] border border-gray-800 p-4 rounded-xl group hover:border-blue-500/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg ${channel.type === 'TELEGRAM' ? 'bg-blue-500/10 text-blue-500' : 'bg-pink-500/10 text-pink-500'}`}>
                                            {channel.type === 'TELEGRAM' ? <Send className="h-6 w-6" /> : <Instagram className="h-6 w-6" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{channel.name}</h4>
                                            <a href={channel.link} target="_blank" className="text-xs text-blue-400 hover:underline">{channel.link}</a>
                                            {channel.channelId && (
                                                <p className="text-[10px] text-gray-500 font-mono mt-1">ID: {channel.channelId}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(channel.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 bg-gray-900 rounded-lg hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
