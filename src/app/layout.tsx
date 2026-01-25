import type { Metadata, Viewport } from "next";
import { Work_Sans } from "next/font/google"; // Font resmi sesuai Brand Guideline
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
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
    default: "PPSDM KM ITS - Portal Pengembangan SDM",
    template: "%s | PPSDM KM ITS", // Contoh: "Dashboard | PPSDM KM ITS"
  },
  description: "Platform terintegrasi untuk manajemen SDM, kaderisasi, dan pengembangan potensi mahasiswa Institut Teknologi Sepuluh Nopember.",
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
    <html lang="id" className={`${workSans.variable} antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
