"use client";

import SuperAdminGuard from "@/components/auth/SuperAdminGuard";
import AdminGuard from "@/components/auth/AdminGuard";
import { Card } from "@/components/ui/Card";
import { useUsers, User } from "@/hooks/useUsers";
import { Loader2, UserMinus, ShieldCheck, ShieldAlert, UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";

export default function UsersManagement() {
    const { users, loading, updateRole, deleteUser, addUser } = useUsers();
    const { data: session } = useSession();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "ADMIN" });
    const [adding, setAdding] = useState(false);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);
        const success = await addUser(newUser);
        setAdding(false);
        if (success) {
            setShowAddForm(false);
            setNewUser({ name: "", email: "", role: "ADMIN" });
        }
    };

    const [viewFilter, setViewFilter] = useState<'ADMINS' | 'USERS'>('ADMINS');
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = users.filter(user => {
        const matchesRole = viewFilter === 'ADMINS'
            ? (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')
            : user.role === 'USER';

        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesRole && matchesSearch;
    });

    return (
        <AdminGuard>
            <SuperAdminGuard>
                <div className="container mx-auto px-4 py-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2 uppercase">
                                Foydalanuvchilar
                            </h1>
                            <p className="text-gray-400">Tizimdagi admin va foydalanuvchilarni boshqarish</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-[#1a202c] border border-gray-800 px-4 py-2 rounded-lg text-sm font-bold text-gray-300">
                                Jami: {users.length}
                            </div>
                            <Button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className={`${showAddForm ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold transition-all flex items-center gap-2`}
                            >
                                <Plus className={`h-4 w-4 transition-transform ${showAddForm ? 'rotate-45' : ''}`} />
                                {showAddForm ? "Bekor qilish" : "Qo'shish"}
                            </Button>
                        </div>
                    </div>

                    {/* Filter & Search Row */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
                        <div className="flex gap-2 bg-[#1a202c] p-1.5 rounded-xl border border-gray-800 w-full md:w-fit">
                            <button
                                onClick={() => setViewFilter('ADMINS')}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-black tracking-widest transition-all duration-300 ${viewFilter === 'ADMINS'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                            >
                                ADMINLAR
                            </button>
                            <button
                                onClick={() => setViewFilter('USERS')}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-black tracking-widest transition-all duration-300 ${viewFilter === 'USERS'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                            >
                                USERLAR
                            </button>
                        </div>

                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Ismi yoki email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-[#1a202c] border-gray-800 focus:border-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    {showAddForm && (
                        <Card className="p-6 mb-10 bg-[#1a202c]/50 backdrop-blur-md border border-blue-500/30 animate-in fade-in slide-in-from-top-4 duration-300">
                            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">F.I.SH</label>
                                    <Input
                                        required
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        placeholder="Ism sharif"
                                        className="bg-[#0f172a] border-gray-800 focus:border-blue-500 text-white font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Email</label>
                                    <Input
                                        required
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        placeholder="email@example.com"
                                        className="bg-[#0f172a] border-gray-800 focus:border-blue-500 text-white font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Rol</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        className="w-full h-10 px-3 bg-[#0f172a] border border-gray-800 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-medium"
                                    >
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                        <option value="USER">USER</option>
                                    </select>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={adding}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black uppercase tracking-widest h-10"
                                >
                                    {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : "TASDIQLASH"}
                                </Button>
                            </form>
                        </Card>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4 text-blue-500">
                            <Loader2 className="h-12 w-12 animate-spin" />
                            <p className="font-bold animate-pulse">Yuklanmoqda...</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredUsers.length === 0 ? (
                                <div className="text-center py-20 bg-[#1a202c]/30 rounded-2xl border border-gray-800/50">
                                    <p className="text-gray-500 font-bold italic">Tanlangan turdagi foydalanuvchilar topilmadi</p>
                                </div>
                            ) : (
                                filteredUsers.map((user: User) => (
                                    <Card
                                        key={user.id}
                                        className="p-5 bg-[#1a202c]/50 backdrop-blur-md border-gray-800 hover:border-blue-500/30 transition-all duration-300 group relative overflow-hidden"
                                    >
                                        {/* Animated background glow on hover */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-10 transition duration-500"></div>

                                        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
                                            <div className="flex items-center gap-6 w-full sm:w-auto">
                                                <div className="relative">
                                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-gray-700 group-hover:border-blue-500/50 transition-colors overflow-hidden">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <span className="text-2xl font-black text-white">{user.name[0]}</span>
                                                        )}
                                                    </div>
                                                    <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#1a202c] ${user.role === 'SUPER_ADMIN' ? 'bg-red-500' :
                                                        user.role === 'ADMIN' ? 'bg-blue-500' :
                                                            'bg-green-500'
                                                        }`}></div>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-wide">
                                                        {user.name}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm font-medium mb-2">{user.email}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className={`text-[10px] px-3 py-1 rounded-md font-black uppercase tracking-wider ${user.role === 'SUPER_ADMIN' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                            user.role === 'ADMIN' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                                'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                                            }`}>
                                                            {user.role}
                                                        </span>
                                                        <span className="text-[10px] px-3 py-1 rounded-md font-bold bg-white/5 text-gray-500 border border-white/5 uppercase">
                                                            Qo'shildi: {new Date(user.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                                {user.role !== 'SUPER_ADMIN' && (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 font-bold"
                                                        onClick={() => updateRole(user.id, 'SUPER_ADMIN')}
                                                    >
                                                        <ShieldAlert className="h-4 w-4 mr-2" />
                                                        SUPER
                                                    </Button>
                                                )}
                                                {user.role !== 'ADMIN' && (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500/20 font-bold"
                                                        onClick={() => updateRole(user.id, 'ADMIN')}
                                                    >
                                                        <ShieldCheck className="h-4 w-4 mr-2" />
                                                        ADMIN
                                                    </Button>
                                                )}
                                                {user.role !== 'USER' && (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="bg-gray-500/10 text-gray-400 hover:bg-gray-500 hover:text-white border border-gray-500/20 font-bold"
                                                        onClick={() => updateRole(user.id, 'USER')}
                                                    >
                                                        <UserMinus className="h-4 w-4 mr-2" />
                                                        USER
                                                    </Button>
                                                )}
                                                <div className="w-[1px] h-8 bg-gray-800 mx-1 hidden sm:block"></div>
                                                {user.id !== session?.user?.id && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/10 font-bold ml-2"
                                                        onClick={() => deleteUser(user.id)}
                                                    >
                                                        O'CHIRISH
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </SuperAdminGuard>
        </AdminGuard>
    );
}
