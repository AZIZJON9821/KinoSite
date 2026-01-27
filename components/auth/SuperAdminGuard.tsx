"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function SuperAdminGuard({ children, noRedirect = false }: { children: React.ReactNode, noRedirect?: boolean }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading" || noRedirect) return;

        if (!session) {
            router.push("/login");
        } else {
            const userRole = session.user.role?.toUpperCase();
            if (userRole !== "SUPER_ADMIN") {
                router.push("/");
            }
        }
    }, [session, status, router, noRedirect]);

    if (status === "loading") {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#111827]">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            </div>
        );
    }

    const userRole = session?.user?.role?.toUpperCase();
    if (!session || userRole !== "SUPER_ADMIN") {
        return null;
    }

    return <>{children}</>;
}
