import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google"; // Optimized fonts
import "./globals.css";
import "./accessibility.css";
import { NudgeNotification } from "@/components/features/NudgeNotification";
import { ThemeProvider } from "@/components/ThemeProvider";



const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: 'swap',
  weight: ['300', '400', '500', '600', '700']
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap'
});

// 1. Viewport Configuration (Penting untuk Mobile & PWA)
export const viewport: Viewport = {
  themeColor: "#013880", // Warna ITS Blue di browser bar
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// 2. Metadata Global (SEO & Social)
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://ppsdm.its.ac.id"),
  title: {
    default: "PPSDM KM ITS - Platform Pengembangan Mahasiswa",
    template: "%s | PPSDM KM ITS",
  },
  description: "Platform Pengembangan Sumber Daya Manusia - Keluarga Mahasiswa ITS. Asesmen holistik 9 dimensi pengembangan mahasiswa.",
  keywords: ["ITS", "PPSDM", "Mahasiswa", "Kaderisasi", "Surabaya", "KM ITS", "Pengembangan Diri"],
  authors: [{ name: "Tim IT PPSDM KM ITS" }],

  // PWA Manifest
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PPSDM ITS",
  },

  // Open Graph (Tampilan Link di WhatsApp/LinkedIn/FB)
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://ppsdm.its.ac.id",
    title: "PPSDM KM ITS - Platform Pengembangan Mahasiswa",
    description: "Platform pengembangan holistik 9 dimensi untuk mahasiswa ITS. Asesmen, pembelajaran, dan portofolio kompetensi.",
    siteName: "PPSDM KM ITS",
    images: [
      {
        url: "/og-image.jpg", // Wajib ada di folder public/
        width: 1200,
        height: 630,
        alt: "PPSDM KM ITS Dashboard Preview",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "PPSDM KM ITS",
    description: "Portal Pengembangan Sumber Daya Mahasiswa ITS.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png", // Icon untuk "Add to Home Screen" di iPhone
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* Preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload Material Symbols for faster icon rendering */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/materialsymbolsoutlined/v192/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Material Symbols Outlined with proper loading strategy */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        {/* Critical CSS for icon rendering - prevents FOIT and ensures fallback */}
        <style dangerouslySetInnerHTML={{
          __html: `
          /* Material Symbols font face with swap display */
          @font-face {
            font-family: 'Material Symbols Outlined';
            font-style: normal;
            font-weight: 100 700;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/materialsymbolsoutlined/v192/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA.woff2) format('woff2');
          }
          
          .material-symbols-outlined {
            font-family: 'Material Symbols Outlined', 'Material Icons', sans-serif;
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            width: 24px;
            height: 24px;
            overflow: hidden;
          }
          
          /* Loading state - show skeleton */
          .material-symbols-outlined:empty,
          .material-symbols-outlined[data-loading="true"] {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading-shimmer 1.5s infinite;
            border-radius: 4px;
          }
          
          @keyframes loading-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          
          /* Fallback for when font fails to load - show Unicode character */
          .material-symbols-outlined:not(:empty) {
            animation: none;
            background: none;
          }
          
          /* Ensure icons are visible once loaded */
          .material-symbols-loaded .material-symbols-outlined {
            background: none;
            animation: none;
          }
        `}} />
      </head>
      <body className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col overflow-x-hidden transition-colors duration-300">
        <ThemeProvider>
          {/* Skip to main content link for accessibility - moved to body */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Skip to main content
          </a>
          {children}
          <NudgeNotification />
        </ThemeProvider>
      </body>
    </html>
  );
}
