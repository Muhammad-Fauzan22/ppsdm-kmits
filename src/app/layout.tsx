import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import "./accessibility.css";
import { NudgeNotification } from "@/components/features/NudgeNotification";


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
    default: "PPSDM KM ITS | Ultimate Human Capital Platform",
    template: "%s | PPSDM KM ITS",
  },
  description: "Platform pengembangan terpadu berbasis data untuk mahasiswa ITS. Bangun portofolio kompetensi melalui asesmen presisi, roadmap terukur.",
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
    title: "PPSDM KM ITS - Excellence in Student Development",
    description: "Sistem manajemen SDM terpadu KM ITS. Akses transkrip LKMM, portofolio, dan asesmen pengembangan diri.",
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
        />
        <script defer data-domain="ppsdm.its.ac.id" src="https://plausible.io/js/script.js"></script>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-focus:absolute focus:not-focus:top-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-opacity-100 focus:bg-white focus:p-4 focus:rounded-md focus:shadow-lg focus:z-50"
        >
          Skip to main content
        </a>
      </head>
      <body className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col overflow-x-hidden">
        {children}
        <NudgeNotification />
      </body>
    </html>
  );
}
