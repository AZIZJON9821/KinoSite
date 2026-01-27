import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
            },
            screens: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1100px",
                "2xl": "1100px",
            },
        },
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#E50914", // Netflix-like red, but can be customized
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#1a1a1a",
                    foreground: "#FFFFFF",
                },
                muted: {
                    DEFAULT: "#404040",
                    foreground: "#a3a3a3",
                },
                cinema: {
                    black: "#141414",
                    dark: "#0F0F0F",
                    glass: "rgba(20, 20, 20, 0.8)",
                }
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "hero-gradient": "linear-gradient(to top, #141414 0%, transparent 100%)",
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-in-out",
                "slide-up": "slideUp 0.5s ease-out",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transformation: "translateY(20px)", opacity: "0" },
                    "100%": { transformation: "translateY(0)", opacity: "1" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
