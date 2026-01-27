"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="relative min-h-screen w-full bg-black flex items-center justify-center bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Header Logo */}
            <div className="absolute top-0 left-0 p-6 z-20">
                <Link href="/" className="text-4xl font-bold text-primary tracking-tighter">KINOSITE</Link>
            </div>

            {/* Login Box */}
            <div className="relative z-10 w-full max-w-md bg-black/75 p-16 rounded-lg backdrop-blur-sm shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-8">Sign In</h1>

                <div className="space-y-4">
                    <Button
                        onClick={() => signIn('google', { callbackUrl: '/profile' })}
                        className="w-full bg-white text-black hover:bg-gray-200 h-12 text-base font-medium flex items-center justify-center gap-3"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </Button>

                    <div className="text-center text-gray-400 text-sm mt-4">
                        New to KINOSITE? <Link href="/" className="text-white hover:underline">Sign up now</Link>.
                    </div>

                    <div className="text-xs text-gray-500 mt-8">
                        This page is protected by Google reCAPTCHA to ensure you're not a bot.
                    </div>
                </div>
            </div>
        </div>
    );
}
