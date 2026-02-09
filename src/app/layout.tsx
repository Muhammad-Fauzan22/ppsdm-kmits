import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./accessibility.css";
import { NudgeNotification } from "@/components/features/NudgeNotification";

// Optimized: Reduced from 8 fonts to 2 fonts
// Primary: Inter for body text (400, 500, 600, 700)
// Secondary: Space Grotesk for headings (300, 400, 500, 600, 700)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
});

// Viewport Configuration
export const viewport: Viewport = {
  themeColor: "#013880",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Metadata
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://ppsdm.its.ac.id"),
  title: {
    default: "PPSDM KM ITS - Platform Pengembangan Mahasiswa",
    template: "%s | PPSDM KM ITS",
  },
  description: "Platform Pengembangan Sumber Daya Manusia - Keluarga Mahasiswa ITS. Asesmen holistik 9 dimensi pengembangan mahasiswa.",
  keywords: ["ITS", "PPSDM", "Mahasiswa", "Kaderisasi", "Surabaya", "KM ITS", "Pengembangan Diri"],
  authors: [{ name: "Tim IT PPSDM KM ITS" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PPSDM ITS",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://ppsdm.its.ac.id",
    title: "PPSDM KM ITS - Platform Pengembangan Mahasiswa",
    description: "Platform pengembangan holistik 9 dimensi untuk mahasiswa ITS",
    siteName: "PPSDM KM ITS",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "PPSDM KM ITS Platform"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PPSDM KM ITS",
    description: "Platform pengembangan holistik 9 dimensi untuk mahasiswa ITS",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Material Symbols - load with display: swap */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        
        {/* Critical CSS inline for faster first paint */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical font loading styles */
          .font-sans { font-family: var(--font-inter), system-ui, -apple-system, sans-serif; }
          .font-heading { font-family: var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif; }
          
          /* Prevent FOIT (Flash of Invisible Text) */
          html { font-family: var(--font-inter), system-ui, sans-serif; }
          
          /* Material Symbols styles */
          .material-symbols-outlined {
            font-family: 'Material Symbols Outlined', sans-serif;
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
          
          /* Loading state */
          .material-symbols-outlined:empty {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading-shimmer 1.5s infinite;
            border-radius: 4px;
          }
          
          @keyframes loading-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}} />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col overflow-x-hidden`}>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to main content
        </a>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <NudgeNotification />
      </body>
    </html>
  );
}
