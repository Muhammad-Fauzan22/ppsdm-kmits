import { createClient } from '@/lib/supabase/client';

// Fungsi sakti untuk mengubah Link GDrive menjadi Link Gambar Langsung
export const getDirectLink = (driveLink: string | null) => {
    if (!driveLink) return "/images/placeholder.png"; // Fallback aman

    // Ambil File ID menggunakan Regex
    const match = driveLink.match(/\/d\/(.+?)\//);
    const fileId = match ? match[1] : null;

    if (!fileId) return driveLink; // Kembalikan asli jika gagal parse

    // Gunakan domain Google Content yang cepat (lh3)
    return `https://lh3.googleusercontent.com/d/${fileId}`;
};

// Interface untuk hasil config
export interface AssetConfig {
    its: {
        lambang: string;
        wordmark: {
            v1: string;
            v2: string;
            v3: string;
        };
        logo: {
            blue: string;
            white: string;
            black: string;
        };
    };
    dikti: {
        black: string;
        color: string;
        white: string;
    };
    mascot: {
        seno: string;
    };
}

// Fungsi Fetcher untuk Client/Server Component
// Note: Karena menggunakan createClient dari @/lib/supabase/client (Browser Client),
// fungsi ini paling aman dipanggil di Client Component balutan useEffect/SWR,
// ATAU di Server Component jika createClient tersebut dikonfigurasi universal.
// Namun untuk amannya di Server Component sebaiknya gunakan createServerClient dari utils server.
// Untuk sekarang kita ikuti pola user, tapi agar lebih robust di Server Component,
// kita akan handle error gracefully.

export async function getAssetConfig(): Promise<AssetConfig> {
    const supabase = createClient();

    // Ambil semua config dari DB
    const { data } = await supabase
        .from('app_config')
        .select('key, value');

    // Default values jika DB kosong/error
    const defaults = {
        its_lambang: '/images/lambang-its-bundar.png',
        its_logo_blue: '/logo-m-its.png',
    };

    const configMap: Record<string, string> = {};

    data?.forEach((item: any) => {
        configMap[item.key] = getDirectLink(item.value);
    });

    // Return objek terstruktur
    return {
        its: {
            lambang: configMap['its_lambang'] || defaults.its_lambang,
            wordmark: {
                v1: configMap['its_wordmark_1'] || '',
                v2: configMap['its_wordmark_2'] || '',
                v3: configMap['its_wordmark_3'] || '',
            },
            logo: {
                blue: configMap['its_logo_blue'] || defaults.its_logo_blue,
                white: configMap['its_logo_white'] || '',
                black: configMap['its_logo_black'] || '',
            }
        },
        dikti: {
            black: configMap['dikti_logo_black'] || '',
            color: configMap['dikti_logo_color'] || '',
            white: configMap['dikti_logo_white'] || '',
        },
        mascot: {
            seno: configMap['mascot_seno'] || ''
        }
    };
}
