import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import ReactQueryProvider from "@/lib/react-query";
import NextAuthSessionProvider from "@/components/providers/SessionProvider";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHeader } from "@/components/layout/SubHeader";
import { CircularNav } from "@/components/layout/CircularNav";
import { AdPopup } from "@/components/features/AdPopup";
import { FloatingTelegram } from "@/components/ui/FloatingTelegram";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    icons: {
        icon: "/play.png",
    },
    title: "KINOSITE | Premium Movie Streaming",
    description: "Watch the latest movies and series in high quality.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body className={inter.variable}>
                <NextAuthSessionProvider>
                    <ReactQueryProvider>
                        <div className="flex flex-col min-h-screen bg-[#111827]">
                            <Header />
                            <div className="pt-20 flex flex-col gap-1"> {/* Header height offset */}
                                <CircularNav />
                                <SubHeader />
                                <main className="flex-grow text-foreground antialiased selection:bg-primary selection:text-white">
                                    {children}
                                </main>
                            </div>
                            <Footer />
                        </div>
                        <Toaster position="bottom-right" toastOptions={{
                            style: {
                                background: '#333',
                                color: '#fff',
                            },
                        }} />
                        <AdPopup />
                        <FloatingTelegram />
                    </ReactQueryProvider>
                </NextAuthSessionProvider>
            </body>
        </html>
    );
}
