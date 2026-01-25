/**
 * KONFIGURASI ASET DINAMIS (GOOGLE DRIVE)
 * 
 * Cara Mengganti Gambar:
 * 1. Upload gambar baru ke Google Drive
 * 2. Pastikan aksesnya "Anyone with the link" (Public)
 * 3. Ambil ID dari URL-nya.
 *    Contoh: https://drive.google.com/file/d/1JY9jpTGLz6CyvOyg1NIM6BciVIAsxran/view
 *    ID-nya adalah: 1JY9jpTGLz6CyvOyg1NIM6BciVIAsxran
 * 4. Paste ID tersebut di bawah ini.
 */

// Helper untuk convert ID menjadi Direct Link
const getGDriveUrl = (id: string) => `https://drive.google.com/uc?export=view&id=${id}`;

export const ASSETS = {
    // 1. LAMBANG ITS (Bundar - Segel Akademik)
    // Digunakan di: Sertifikat, Transkrip, Footer Dokumen Resmi
    lambang_its: getGDriveUrl("1JY9jpTGLz6CyvOyg1NIM6BciVIAsxran"),

    // 2. LOGO ITS (Techno Shield - Branding Web)
    // Digunakan di: Header Website, Social Media Post
    logo_its_biru: getGDriveUrl("1cJAFXk0jpx7L-WOGD7jE4e3uRPerzmfQ"),
    logo_its_putih: getGDriveUrl("1KkdnOc_F8dCkP7CMGZW476KemKyT_vyP"),
    logo_its_hitam: getGDriveUrl("1z8uzFBbPq2j0E0hoO3X0wUCWsFg4agGJ"),

    // 3. WORDMARK ITS (Tulisan ITS stylized)
    wordmark_1: getGDriveUrl("1p0Gix3NDeKpRLEZx89R7tlxBA9m2itnm"),
    wordmark_2: getGDriveUrl("1UKUxz6xZEmuViB_URDiDPQ9ACpVzElNE"),
    wordmark_3: getGDriveUrl("1dOSjdcNOTx7XSUhwsALK8VNQc0IU2mHJ"),

    // 4. LOGO FAKULTAS / ORGANISASI
    logo_diktisaintek_hitam: getGDriveUrl("10SNMXwLftlnEmaZqfYzbVhw3y-d9jxlg"),
    logo_diktisaintek_warna: getGDriveUrl("1uMUCLcbvymaCiLy1lZ6YBmJq-pWUa9NP"),
    logo_saintek_putih: getGDriveUrl("1NaPWYRv0Lv5ymCQJBxziY7evUVj1_TTB"),

    // 5. ASSET LAINNYA
    maskot_seno: getGDriveUrl("1vj3fvkqGjIVDV1IufgYieVWlorvp-ew-"),

    // COMPATIBILITY (Nested Access)
    mascot: {
        seno: getGDriveUrl("1vj3fvkqGjIVDV1IufgYieVWlorvp-ew-")
    }
};

// Export Satuan untuk kemudahan import
export const LOGO_HEADER = ASSETS.logo_its_biru;
export const LOGO_TRANSKRIP = ASSETS.lambang_its;
export const MASKOT_DASHBOARD = ASSETS.maskot_seno;
