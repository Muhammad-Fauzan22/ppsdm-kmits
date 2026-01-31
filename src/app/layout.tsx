import type { Metadata, Viewport } from "next";
import { Work_Sans, Space_Grotesk, Noto_Sans, Manrope, Merriweather, Lexend, Inter, Poppins } from "next/font/google"; // Font resmi sesuai Brand Guideline
import "./globals.css";
import { NudgeNotification } from "@/components/features/NudgeNotification";


const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: 'swap'
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: 'swap',
  weight: ['300', '400', '500', '600', '700']
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: 'swap',
  weight: ['400', '500', '700']
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: 'swap'
});

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: 'swap'
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: 'swap'
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap'
});

const poppins = Poppins({
  weight: ['400', '500', '600'],
  subsets: ["latin"],
  variable: "--font-poppins",
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
    default: "PPSDM KMM | Ultimate Human Capital Platform",
    template: "%s | PPSDM KMM",
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
    <html lang="id" className={`${workSans.variable} ${spaceGrotesk.variable} ${notoSans.variable} ${manrope.variable} ${merriweather.variable} ${lexend.variable} ${inter.variable} ${poppins.variable} antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col overflow-x-hidden">
        {children}
        <NudgeNotification />
      </body>
    </html>
  );
}
