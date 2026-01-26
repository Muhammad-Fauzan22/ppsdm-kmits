import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // WARNA UTAMA BARU (Admin & Supervisor)
                // WARNA UTAMA BARU (Admin & Supervisor)
                primary: "#135bec",
                "its-red": "#ef4444",
                "background-light": "#f6f6f8",
                "background-dark": "#101622",
                "card-dark": "#1c1f27",
                "border-dark": "#282e39",

                // Student Portal Specific
                "student-primary": "#003366",
                "student-bg": "#f5f7f8", // background-light
                "student-dark": "#0f1923", // background-dark
                "accent-green": "#078838",
                "text-dark": "#101418",
                "text-light": "#5e758d",
                "card-dark": "#1A1F2B", // Updated to Admin View dark card

                // Mobile & Admin Specific
                "sidebar-dark": "#0B0E14",
                "primary-highlight": "#4DA3FF",
                "primary-100": "#dbeafe", // Added for mobile header
                "surface-dark": "#1b2128",
                "nav-glass": "rgba(15, 25, 35, 0.85)",
                "engineering-red": "#C62828",
                "primary-dark": "#1e3a8a",

                // Student OS Specific
                "card-border": "#27303a",
                "text-subtle": "#9aabbc",
                "student-primary-light": "#004080",

                // WARNA PRIMER ITS
                its: {
                    DEFAULT: "#013880",    // Biru Tua (Official Primary)
                    light: "#007BC0",      // Biru Tua Lambang (Brighter)
                    sky: "#75BEDE",        // Biru Muda Lambang
                    yellow: "#FFBD07",     // Kuning Tua (Accent)
                    gold: "#FFD700",       // Kuning Emas (Seal/Rating)
                    white: "#FFFFFF",
                    black: "#000000",
                    dark: "#0B1120",       // Hitam Kebiruan untuk Teks Utama
                },
                // Surface colors untuk nuansa "Clean"
                surface: {
                    50: "#F8FAFC",      // Background Halaman (Slate-50)
                    100: "#F1F5F9",     // Secondary Background
                    200: "#E2E8F0",
                    card: "#FFFFFF",
                },
                // WARNA FAKULTAS (Untuk Kategori/Dimensi)
                faculty: {
                    scientics: "#0F8140",  // Hijau (Scientics)
                    indsys: "#B31E23",     // Merah (Indsys)
                    civplan: "#231F20",    // Hitam (Civplan)
                    martech: "#26AEE4",    // Biru Laut (Martech)
                    electics: "#FFD700",   // Kuning Emas (Electics)
                    creabiz: "#480082",    // Ungu (Creabiz)
                    vocations: "#F47D52",  // Oranye (Vocations)
                },
            },
            fontFamily: {
                // Tipografi Resmi
                // Tipografi Resmi
                sans: ['var(--font-work-sans)', 'sans-serif'], // Body Text
                serif: ['var(--font-friz)', 'serif'],         // Headings (Friz Quadrata)
                display: ['var(--font-lexend)', 'sans-serif'],
                body: ['var(--font-noto-sans)', 'sans-serif'],
            },
            backgroundImage: {
                // Pattern Resmi "Gerigi/Batik"
                'its-pattern': "url('/patterns/its-key-graphic.svg')",
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 0 15px rgba(1, 56, 128, 0.15)',
                'nav': '0 -4px 20px -5px rgba(0, 0, 0, 0.1)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-right': 'slideInRight 0.5s ease-out',
                marquee: 'marquee 25s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
            },
        },
    },
    plugins: [],
};
export default config;
