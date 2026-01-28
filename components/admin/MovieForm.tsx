"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useGenres } from "@/hooks/useGenres";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Loader2, Upload, X, Crop as CropIcon, Plus, Trash2, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import Cropper from "react-easy-crop";

interface MovieFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function MovieForm({ initialData, isEditing = false }: MovieFormProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const { data: genres } = useGenres();
    const [loading, setLoading] = useState(false);
    const [posterPreview, setPosterPreview] = useState<string | null>(
        initialData?.poster ? getImageUrl(initialData.poster) : null
    );
    const [backdropPreview, setBackdropPreview] = useState<string | null>(
        initialData?.backdrop ? getImageUrl(initialData.backdrop) : null
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [croppedBackdrop, setCroppedBackdrop] = useState<Blob | null>(null);

    // Cropping states
    const [showCropModal, setShowCropModal] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [movieType, setMovieType] = useState<'MOVIE' | 'SERIAL'>(initialData?.type || 'MOVIE');
    const [seasons, setSeasons] = useState<any[]>(() => {
        if (initialData?.episodes && initialData.episodes.length > 0) {
            const grouped = initialData.episodes.reduce((acc: any, ep: any) => {
                const sn = ep.seasonNumber || 1;
                if (!acc[sn]) acc[sn] = [];
                acc[sn].push(ep);
                return acc;
            }, {});
            return Object.entries(grouped).map(([sn, eps]: [string, any]) => ({
                seasonNumber: parseInt(sn),
                episodes: eps.sort((a: any, b: any) => a.episodeNumber - b.episodeNumber)
            }));
        }
        return [{ seasonNumber: 1, episodes: [] }];
    });
    const [expandedSeasons, setExpandedSeasons] = useState<number[]>([1]);

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            trailerUrl: initialData?.trailerUrl || "",
            telegramMovieUrl: initialData?.telegramMovieUrl || "",
            telegramInviteLink: initialData?.telegramInviteLink || "",
            telegramFileId: initialData?.telegramFileId || "",
            country: initialData?.country || "",
            releaseYear: initialData?.releaseYear || new Date().getFullYear(),
            rating: initialData?.rating || 0,
            isPremier: initialData?.isPremier || false,
            genreIds: initialData?.genres?.map((g: any) => g.genre.id) || [],
        }
    });

    const selectedGenres = watch("genreIds");

    const onCropComplete = useCallback((_extended: any, pixels: any) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'poster' | 'backdrop') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (type === 'poster') {
                    setSelectedFile(file);
                    setPosterPreview(result);
                    // Ask if they want to crop this for banner or just use it as poster?
                    // Currently logic: Auto open cropper to make banner from poster
                    setCropImageSrc(result);
                    setShowCropModal(true);
                } else {
                    // Custom backdrop upload
                    setCropImageSrc(result);
                    setShowCropModal(true);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropSave = async () => {
        try {
            if (!cropImageSrc || !croppedAreaPixels) return;
            const croppedImageBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
            setCroppedBackdrop(croppedImageBlob);
            setBackdropPreview(URL.createObjectURL(croppedImageBlob));
            setShowCropModal(false);
            toast.success("Banner muvaffaqiyatli kesildi");
        } catch (e) {
            console.error(e);
            toast.error("Rasmni kesishda xatolik");
        }
    };

    const toggleGenre = (genreId: string) => {
        const current = [...selectedGenres];
        const index = current.indexOf(genreId);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(genreId);
        }
        setValue("genreIds", current);
    };

    const addSeason = () => {
        const nextSeason = seasons.length > 0 ? Math.max(...seasons.map(s => s.seasonNumber)) + 1 : 1;
        setSeasons([...seasons, { seasonNumber: nextSeason, episodes: [] }]);
        setExpandedSeasons([...expandedSeasons, nextSeason]);
    };

    const removeSeason = (index: number) => {
        const newSeasons = seasons.filter((_, i) => i !== index);
        setSeasons(newSeasons);
    };

    const addEpisode = (seasonIndex: number) => {
        const newSeasons = [...seasons];
        const episodes = [...newSeasons[seasonIndex].episodes];
        const nextEpisode = episodes.length > 0 ? Math.max(...episodes.map((e: any) => e.episodeNumber)) + 1 : 1;
        episodes.push({
            title: `Qism ${nextEpisode}`,
            telegramFileId: "",
            episodeNumber: nextEpisode
        });
        newSeasons[seasonIndex] = { ...newSeasons[seasonIndex], episodes };
        setSeasons(newSeasons);
    };

    const removeEpisode = (seasonIndex: number, episodeIndex: number) => {
        const newSeasons = [...seasons];
        const episodes = [...newSeasons[seasonIndex].episodes];
        episodes.splice(episodeIndex, 1);
        newSeasons[seasonIndex] = { ...newSeasons[seasonIndex], episodes };
        setSeasons(newSeasons);
    };

    const updateEpisode = (seasonIndex: number, episodeIndex: number, field: string, value: any) => {
        const newSeasons = [...seasons];
        const episodes = [...newSeasons[seasonIndex].episodes];
        episodes[episodeIndex] = { ...episodes[episodeIndex], [field]: value };
        newSeasons[seasonIndex] = { ...newSeasons[seasonIndex], episodes };
        setSeasons(newSeasons);
    };

    const toggleSeasonExpand = (sn: number) => {
        setExpandedSeasons(prev =>
            prev.includes(sn) ? prev.filter(s => s !== sn) : [...prev, sn]
        );
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("country", data.country);
            formData.append("releaseYear", data.releaseYear.toString());
            formData.append("rating", data.rating.toString());
            formData.append("isPremier", data.isPremier.toString());

            if (data.trailerUrl && data.trailerUrl.trim() !== "") {
                formData.append("trailerUrl", data.trailerUrl);
            }

            if (data.telegramMovieUrl && data.telegramMovieUrl.trim() !== "") {
                formData.append("telegramMovieUrl", data.telegramMovieUrl);
            }
            if (data.telegramInviteLink && data.telegramInviteLink.trim() !== "") {
                formData.append("telegramInviteLink", data.telegramInviteLink);
            }
            if (data.telegramFileId && data.telegramFileId.trim() !== "") {
                formData.append("telegramFileId", data.telegramFileId);
            }

            // Append genre IDs individually as NestJS handles arrays better this way with multipart
            data.genreIds.forEach((id: string) => {
                formData.append("genreIds", id);
            });

            formData.append("type", movieType);

            if (movieType === 'SERIAL') {
                const allEpisodes = seasons.flatMap(s =>
                    s.episodes.map((e: any) => ({
                        ...e,
                        seasonNumber: s.seasonNumber,
                    }))
                );
                formData.append("episodes", JSON.stringify(allEpisodes));
            }

            if (selectedFile) {
                formData.append("poster", selectedFile);
            }

            if (croppedBackdrop) {
                const backdropFile = new File([croppedBackdrop], "backdrop.jpg", { type: "image/jpeg" });
                formData.append("backdrop", backdropFile);
            }

            const url = isEditing
                ? `${process.env.NEXT_PUBLIC_API_URL}/movies/${initialData.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/movies`;

            const method = isEditing ? "patch" : "post";

            await axios({
                method,
                url,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });

            toast.success(isEditing ? "Kino yangilandi" : "Kino qo'shildi");

            if (!isEditing) {
                reset();
                setPosterPreview(null);
                setSelectedFile(null);
            }

            router.push("/admin/movies");
            router.refresh();
        } catch (error: any) {
            console.error("Movie submit error full:", error);
            if (error.response) {
                console.dir(error.response.data);
            }
            const message = error.response?.data?.message;
            if (Array.isArray(message)) {
                toast.error(`Xatolik: ${message.join(", ")}`); // Show all validation errors
            } else {
                toast.error(message || "Xatolik yuz berdi");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                {/* Poster & Banner Section */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-400">Posterni tanlang (Vertical)</label>
                        <div
                            className="relative aspect-[2/3] w-full bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 transition-colors group"
                            onClick={() => document.getElementById("poster-input")?.click()}
                        >
                            {posterPreview ? (
                                <img src={posterPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-500">
                                    <Upload className="h-10 w-10 mb-2 group-hover:text-blue-500 transition-colors" />
                                    <span className="text-xs text-center px-4">Rasmni yuklash uchun bosing</span>
                                </div>
                            )}
                            <input
                                id="poster-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, 'poster')}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-400">Banner Preview (4:3)</label>
                        <div className="relative aspect-[4/3] w-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group">
                            {backdropPreview ? (
                                <>
                                    <img src={backdropPreview} alt="Banner" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setShowCropModal(true)}
                                        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <CropIcon className="h-4 w-4" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-600 text-xs italic">
                                    Poster yuklangandan so'ng banner avtomatik shakllanadi
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-500 italic">
                            Bu rasm asosiy sahifa (slider/premyera) uchun ishlatiladi.
                        </p>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById("backdrop-input")?.click()}
                                className="w-full text-xs"
                            >
                                <Upload className="h-3 w-3 mr-2" />
                                Boshqa rasm yuklash
                            </Button>
                            {backdropPreview && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setCropImageSrc(backdropPreview); // Or posterPreview depending on logic, but reuse current preview if available? 
                                        // Actually if we edit, we might not have base64. 
                                        // Simplest is to only re-crop if we have a source.
                                        // If user wants to re-crop the POSTER, they can re-upload or we need to store poster source.
                                        // User said: "postersni crop qilish ... va primyeralar uchun boshqa img".
                                        // Let's assume re-clicking crop button on banner uses the current POSTER if no custom backdrop, or just re-opens modal.
                                        if (posterPreview) {
                                            setCropImageSrc(posterPreview);
                                            setShowCropModal(true);
                                        } else {
                                            toast.error("Tahrirlash uchun rasm yuklang");
                                        }
                                    }}
                                    className="w-full text-xs"
                                >
                                    <CropIcon className="h-3 w-3 mr-2" />
                                    Posterdan qayta kesish
                                </Button>
                            )}
                        </div>
                        <input
                            id="backdrop-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'backdrop')}
                        />
                    </div>
                </div>

                {/* Form Fields Section */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Kino Nomi</label>
                        <Input
                            {...register("title", { required: "Nom kiritilishi shart" })}
                            placeholder="Masalan: Qasoskorlar"
                            className="bg-gray-900 border-gray-700"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Tavsif (Description)</label>
                        <textarea
                            {...register("description", { required: "Tavsif kiritilishi shart" })}
                            className="w-full min-h-32 bg-gray-900 border border-gray-700 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Kino haqida batafsil ma'lumot..."
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Davlati</label>
                            <Input
                                {...register("country", { required: "Davlat kiritilishi shart" })}
                                placeholder="AQSH"
                                className="bg-gray-900 border-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Yili</label>
                            <Input
                                type="number"
                                {...register("releaseYear", { valueAsNumber: true })}
                                className="bg-gray-900 border-gray-700"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Reyting (0-10)</label>
                            <Input
                                type="number"
                                step="0.1"
                                {...register("rating", { valueAsNumber: true })}
                                className="bg-gray-900 border-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Trailer URL</label>
                            <Input
                                {...register("trailerUrl")}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="bg-gray-900 border-gray-700"
                            />
                            <p className="text-[10px] text-gray-500 mt-1 italic">
                                YouTube linki (watch, youtu.be, yoki shorts)
                            </p>
                        </div>

                    </div>

                    {/* Movie Type Selection */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-400">Kino Turi</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setMovieType('MOVIE')}
                                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${movieType === 'MOVIE'
                                    ? "bg-blue-600/10 border-blue-500 text-blue-500 shadow-lg shadow-blue-500/10"
                                    : "bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700"
                                    }`}
                            >
                                <Upload className="h-5 w-5" />
                                <span className="font-bold">Kino (Film)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setMovieType('SERIAL')}
                                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${movieType === 'SERIAL'
                                    ? "bg-purple-600/10 border-purple-500 text-purple-500 shadow-lg shadow-purple-500/10"
                                    : "bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700"
                                    }`}
                            >
                                <Layers className="h-5 w-5" />
                                <span className="font-bold">Serial</span>
                            </button>
                        </div>
                    </div>

                    {/* Premier Switch */}
                    <div className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-700 rounded-lg">
                        <input
                            type="checkbox"
                            id="isPremier"
                            {...register("isPremier")}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-600 bg-gray-700 border-gray-600"
                        />
                        <div>
                            <label htmlFor="isPremier" className="block text-sm font-medium text-gray-200">
                                Premyera (Slider)
                            </label>
                            <p className="text-xs text-gray-500">
                                Agar yoqilsa, bu kino bosh sahifadagi katta sliderda ko'rinadi.
                            </p>
                        </div>
                    </div>

                    {/* Genres Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-3">Janrlarni tanlang</label>
                        <div className="flex flex-wrap gap-2">
                            {genres?.map((genre: any) => (
                                <button
                                    key={genre.id}
                                    type="button"
                                    onClick={() => toggleGenre(genre.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${selectedGenres.includes(genre.id)
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                        : "bg-gray-900 text-gray-400 border border-gray-700 hover:border-gray-500"
                                        }`}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Telegram Movie URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Telegram Kanal Linki (Majburiy emas)
                        </label>
                        <Input
                            {...register("telegramMovieUrl")}
                            placeholder="https://t.me/kinolar_kanali/123"
                            className="bg-gray-900 border-gray-700"
                        />
                        <p className="text-[10px] text-gray-500 mt-1 italic">
                            Telegram kanalidagi kino postining linkini kiriting
                        </p>
                    </div>

                    {/* Telegram Invite Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Telegram Kanal Invite Link (Kanalga qo'shilish)
                        </label>
                        <Input
                            {...register("telegramInviteLink")}
                            placeholder="https://t.me/+AbCdEf..."
                            className="bg-gray-900 border-gray-700"
                        />
                        <p className="text-[10px] text-gray-500 mt-1 italic">
                            Kanalga qo'shilish linki (Invite Link).
                        </p>
                    </div>

                    {/* Movie/Serial Specific Fields */}
                    {movieType === 'MOVIE' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Telegram File ID (Bot to'g'ridan-to'g'ri yuborishi uchun)
                            </label>
                            <Input
                                {...register("telegramFileId")}
                                placeholder="BAACAgIAAxkBAAEY..."
                                className="bg-gray-900 border-gray-700"
                            />
                            <p className="text-[10px] text-gray-500 mt-1 italic">
                                Bot orqali kinoni darhol yuborish uchun File ID ni kiriting.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-purple-500" />
                                    Fasllar va Qismlar
                                </h3>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={addSeason}
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Fasl Qo'shish
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {seasons.map((season, sIdx) => (
                                    <div key={sIdx} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                                        <div
                                            className="p-4 flex items-center justify-between bg-gray-900 cursor-pointer hover:bg-gray-800/80 transition-colors"
                                            onClick={() => toggleSeasonExpand(season.seasonNumber)}
                                        >
                                            <div className="flex items-center gap-3">
                                                {expandedSeasons.includes(season.seasonNumber) ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                                                <span className="font-bold text-gray-200">{season.seasonNumber}-Fasl</span>
                                                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                                                    {season.episodes.length} qism
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeSeason(sIdx); }}
                                                className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {expandedSeasons.includes(season.seasonNumber) && (
                                            <div className="p-4 space-y-4 border-t border-gray-800/50">
                                                {season.episodes.map((episode: any, eIdx: number) => (
                                                    <div key={eIdx} className="grid grid-cols-1 md:grid-cols-[80px_1fr_2fr_40px] gap-3 items-end bg-black/20 p-3 rounded-lg border border-gray-800/30">
                                                        <div>
                                                            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">№</label>
                                                            <Input
                                                                type="number"
                                                                value={episode.episodeNumber}
                                                                onChange={(e) => updateEpisode(sIdx, eIdx, 'episodeNumber', Number(e.target.value))}
                                                                className="h-9 bg-gray-950 border-gray-800 text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Nom</label>
                                                            <Input
                                                                value={episode.title}
                                                                onChange={(e) => updateEpisode(sIdx, eIdx, 'title', e.target.value)}
                                                                placeholder="Qism nomi"
                                                                className="h-9 bg-gray-950 border-gray-800 text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">File ID</label>
                                                            <Input
                                                                value={episode.telegramFileId}
                                                                onChange={(e) => updateEpisode(sIdx, eIdx, 'telegramFileId', e.target.value)}
                                                                placeholder="Telegram File ID"
                                                                className="h-9 bg-gray-950 border-gray-800 text-sm"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeEpisode(sIdx, eIdx)}
                                                            className="mb-1 p-2 hover:bg-red-500/10 rounded-lg text-gray-600 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addEpisode(sIdx)}
                                                    className="w-full border-dashed border-gray-700 text-gray-400 hover:text-white"
                                                >
                                                    <Plus className="h-3 w-3 mr-1" />
                                                    Qism Qo'shish
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {seasons.length === 0 && (
                                    <div className="text-center py-10 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
                                        <p className="text-gray-500 text-sm">Hali fasllar qo'shilmagan</p>
                                        <Button
                                            type="button"
                                            variant="link"
                                            onClick={addSeason}
                                            className="text-purple-500 font-bold"
                                        >
                                            Fasl yaratish
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div >

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-800">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-gray-400 hover:text-white"
                >
                    Bekor qilish
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-32"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isEditing ? "Saqlash" : "Qo'shish")}
                </Button>
            </div>
            {/* Crop Modal */}
            {
                showCropModal && cropImageSrc && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10">
                        <div className="relative w-full max-w-5xl h-[80vh] flex flex-col bg-[#111827] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1a202c]">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <CropIcon className="h-5 w-5 text-blue-500" />
                                    Banner uchun rasmni kesing (4:3)
                                </h3>
                                <button
                                    onClick={() => setShowCropModal(false)}
                                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="flex-1 relative bg-black">
                                <Cropper
                                    image={cropImageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={4 / 3}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>

                            <div className="p-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#1a202c]">
                                <div className="w-full md:w-64 space-y-2">
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Yaqinlashtirish</span>
                                        <span>{zoom.toFixed(1)}x</span>
                                    </div>
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>

                                <div className="flex gap-3 w-full md:w-auto">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setShowCropModal(false)}
                                        className="flex-1 md:flex-none border border-gray-700 text-gray-300"
                                    >
                                        Bekor qilish
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleCropSave}
                                        className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-8"
                                    >
                                        Saqlash va davom etish
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </form >
    );
}

async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("No 2d context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Canvas is empty"));
                return;
            }
            resolve(blob);
        }, "image/jpeg");
    });
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });
}
