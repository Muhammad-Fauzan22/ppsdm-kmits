import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            borderRadius: {
                "xl": "1rem",
                "2xl": "1.5rem",
            },
            colors: {
                // WARNA UTAMA BARU
                primary: "#135bec",
                "its-red": "#ef4444",
                "background-light": "#f6f6f8",
                "background-dark": "#101622",
                "card-dark": "#1c1f27",
                "border-dark": "#282e39",

                // Design System Tokens
                "its-blue": "#013880",
                "its-gold": "#FFD700",
                "its-dark": "#0A0F1A",
                "brand-blue": "#135bec",
                "brand-accent": "#00d4ff",

                // Student Portal Specific
                "student-primary": "#003366",
                "student-bg": "#f5f7f8",
                "student-dark": "#0f1923",
                "accent-green": "#078838",
                "text-dark": "#101418",
                "text-light": "#5e758d",

                // Mobile & Admin Specific
                "sidebar-dark": "#0B0E14",
                "primary-highlight": "#4DA3FF",
                "primary-100": "#dbeafe",
                "surface-dark": "#1b2128",
                "nav-glass": "rgba(15, 25, 35, 0.85)",
                "engineering-red": "#C62828",
                "primary-dark": "#1e3a8a",
                "card-border": "#27303a",
                "text-subtle": "#9aabbc",
                "student-primary-light": "#004080",

                // WARNA PRIMER ITS
                its: {
                    DEFAULT: "#013880",
                    light: "#007BC0",
                    sky: "#75BEDE",
                    yellow: "#FFBD07",
                    gold: "#FFD700",
                    white: "#FFFFFF",
                    black: "#000000",
                    dark: "#0B1120",
                },
                // Surface colors
                surface: {
                    50: "#F8FAFC",
                    100: "#F1F5F9",
                    200: "#E2E8F0",
                },
                // WARNA FAKULTAS
                faculty: {
                    scientics: "#0F8140",
                    indsys: "#B31E23",
                    civplan: "#231F20",
                    martech: "#26AEE4",
                    electics: "#FFD700",
                    creabiz: "#480082",
                    vocations: "#F47D52",
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                heading: ['var(--font-poppins)', 'sans-serif'],
                serif: ['var(--font-friz)', 'serif'],
                display: ['"Lexend"', 'sans-serif'],
                body: ['"Noto Sans"', 'sans-serif'],
                grotesk: ['"Space Grotesk"', 'sans-serif'],
            },
            backgroundImage: {
                'its-pattern': "url('/patterns/its-key-graphic.svg')",
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 0 15px rgba(1, 56, 128, 0.15)',
                'nav': '0 -4px 20px -5px rgba(0, 0, 0, 0.1)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'fade-out': 'fadeOut 0.5s ease-in-out',
                'scale-up': 'scaleUp 0.5s ease-out',
                'fade-in-up': 'fadeInUp 0.6s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-right': 'slideInRight 0.5s ease-out',
                'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                marquee: 'marquee 25s linear infinite',
                bounce: 'bounce 1s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                scaleUp: {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
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
                bounce: {
                    '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
                    '50%': { transform: 'none', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
                },
                ping: {
                    '75%, 100%': { transform: 'scale(2)', opacity: '0' },
                },
            },
        },
    },
    plugins: [],
};
export default config;
