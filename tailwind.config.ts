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
                sans: ['var(--font-work-sans)', 'sans-serif'], // Body Text
                serif: ['var(--font-friz)', 'serif'],         // Headings (Friz Quadrata)
            },
            backgroundImage: {
                // Pattern Resmi "Gerigi/Batik"
                'its-pattern': "url('/patterns/its-key-graphic.svg')",
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)', // Shadow halus "mahal"
                'glow': '0 0 15px rgba(1, 56, 128, 0.15)',     // Efek glow biru tipis
            }
        },
    },
    plugins: [],
};
export default config;
