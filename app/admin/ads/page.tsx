"use client";

import { useState } from "react";
import { useAds, useCreateAd, useDeleteAd, useToggleAdStatus } from "@/hooks/useAds";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Trash2, Video, Image as ImageIcon, Upload } from "lucide-react";
import { getImageUrl, getAdUrl } from "@/lib/utils";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function AdsPage() {
    const { data: ads, isLoading } = useAds();
    const createAd = useCreateAd();
    const deleteAd = useDeleteAd();
    const toggleStatus = useToggleAdStatus();

    const [newAdTitle, setNewAdTitle] = useState("");
    const [newAdLink, setNewAdLink] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !newAdTitle) return;

        const formData = new FormData();
        formData.append("title", newAdTitle);
        if (newAdLink) formData.append("link", newAdLink);
        formData.append("file", selectedFile);

        try {
            await createAd.mutateAsync(formData);
            toast.success("Reklama qo'shildi");
            setNewAdTitle("");
            setNewAdLink("");
            setSelectedFile(null);
        } catch (error) {
            toast.error("Xatolik yuz berdi");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Rostdan ham o'chirmoqchimisiz?")) {
            await deleteAd.mutateAsync(id);
            toast.success("O'chirildi");
        }
    };

    return (
        <div className="p-6 space-y-8 text-white">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Reklamalar Boshqaruvi</h1>
            </div>

            {/* Create Ad Form */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 className="text-lg font-semibold mb-4">Yangi reklama qo'shish</h2>
                <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-1/3">
                        <label className="block text-xs text-gray-400 mb-1">Nomi</label>
                        <Input
                            value={newAdTitle}
                            onChange={(e) => setNewAdTitle(e.target.value)}
                            placeholder="Coca Cola banner"
                            className="bg-gray-900 border-gray-600"
                            required
                        />
                    </div>
                    <div className="w-full md:w-1/3">
                        <label className="block text-xs text-gray-400 mb-1">Fayl (Rasm yoki Video)</label>
                        <Input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="bg-gray-900 border-gray-600 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            required
                        />

                    </div>
                    <div className="w-full md:w-1/3">
                        <label className="block text-xs text-gray-400 mb-1">Havola (Link) - ixtiyoriy</label>
                        <Input
                            value={newAdLink}
                            onChange={(e) => setNewAdLink(e.target.value)}
                            placeholder="https://instagram.com/..."
                            className="bg-gray-900 border-gray-600"
                        />
                    </div>
                    <Button type="submit" disabled={createAd.isPending} className="bg-green-600 hover:bg-green-700">
                        {createAd.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-4 h-4 mr-2" /> Yuklash</>}
                    </Button>
                </form>
            </div>

            {/* Ads List */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Mavjud Reklamalar</h2>
                {isLoading ? (
                    <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ads?.map((ad: any) => (
                            <div key={ad.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 relative group">
                                <div className="aspect-video bg-black relative">
                                    {ad.type === 'VIDEO' ? (
                                        <video
                                            src={getAdUrl(ad.mediaUrl)}
                                            className="w-full h-full object-cover opacity-60"
                                        />
                                    ) : (
                                        <div className="relative w-full h-full opacity-60">
                                            <Image
                                                src={getAdUrl(ad.mediaUrl)}
                                                alt={ad.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {ad.type === 'VIDEO' ? <Video className="w-10 h-10 text-white/50" /> : <ImageIcon className="w-10 h-10 text-white/50" />}
                                    </div>
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => handleDelete(ad.id)}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-4 flex justify-between items-center bg-gray-900/50">
                                    <div>
                                        <h3 className="font-bold text-sm">{ad.title}</h3>
                                        <p className="text-xs text-gray-500">{new Date(ad.createdAt).toLocaleDateString()}</p>
                                        {ad.link && <p className="text-[10px] text-blue-400 truncate w-32">{ad.link}</p>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs ${ad.isActive ? "text-green-400" : "text-gray-500"}`}>
                                            {ad.isActive ? "Faol" : "O'chiq"}
                                        </span>
                                        <div
                                            onClick={() => toggleStatus.mutate({ id: ad.id, isActive: !ad.isActive })}
                                            className={`w-10 h-5 flex items-center bg-gray-700 rounded-full p-1 cursor-pointer transition-colors ${ad.isActive ? "bg-green-600" : ""}`}
                                        >
                                            <div
                                                className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${ad.isActive ? "translate-x-5" : ""}`}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {ads?.length === 0 && (
                            <p className="text-gray-500 col-span-full text-center py-8">Reklamalar mavjud emas</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
