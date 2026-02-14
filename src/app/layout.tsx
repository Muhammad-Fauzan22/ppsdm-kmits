import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./accessibility.css";
import { NudgeNotification } from "@/components/features/NudgeNotification";
import FloatingKnowledgeWidget from "@/components/knowledge/FloatingKnowledgeWidget";
import StressCheckWidget from "@/components/widgets/StressCheckWidget";
import { ThemeProvider } from "@/components/ThemeProvider";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { PushNotificationManager } from "@/components/pwa/PushNotificationManager";

// OPTIMIZED: Reduced from 8 fonts to 2 fonts for better performance
// Primary font for body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif']
});

// Secondary font for headings
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
  fallback: ['system-ui', 'sans-serif']
});

// Viewport Configuration (Penting untuk Mobile & PWA)
export const viewport: Viewport = {
  themeColor: "#013880",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Metadata Global (SEO & Social)
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
    description: "Platform Pengembangan Mahasiswa ITS",
    images: ["/twitter-image.jpg"],
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

  verification: {
    google: "google-site-verification-code",
  },

  alternates: {
    canonical: "https://ppsdm.its.ac.id",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#013880" },
    ],
  },

  other: {
    "msapplication-TileColor": "#013880",
    "msapplication-config": "/browserconfig.xml",
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

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />




      </head>
      <body className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col overflow-x-hidden">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <InstallPrompt />
        <PushNotificationManager />
        <NudgeNotification />
        <FloatingKnowledgeWidget />
        <StressCheckWidget />
      </body>
    </html>
  );
}
