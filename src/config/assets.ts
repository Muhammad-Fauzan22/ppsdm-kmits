/**
 * KONFIGURASI ASET DINAMIS (GOOGLE DRIVE)
 * 
 * Sesuai permintaan: Skema Konfigurasi JSON yang mudah diganti ID-nya.
 * URL otomatis digenerate menggunakan helper getImageUrl.
 */

// Helper Function (utils/imageLoader.js equivalent)
export function getImageUrl(fileId: string) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export const ASSETS = {
    logos: {
        its: {
            lambang: getImageUrl("1JY9jpTGLz6CyvOyg1NIM6BciVIAsxran"),
            workmark_1: getImageUrl("1p0Gix3NDeKpRLEZx89R7tlxBA9m2itnm"),
            biru: getImageUrl("1cJAFXk0jpx7L-WOGD7jE4e3uRPerzmfQ"),
            putih: getImageUrl("1KkdnOc_F8dCkP7CMGZW476KemKyT_vyP"),
            hitam: getImageUrl("1z8uzFBbPq2j0E0hoO3X0wUCWsFg4agGJ"),
            workmark_3: getImageUrl("1dOSjdcNOTx7XSUhwsALK8VNQc0IU2mHJ"),
            workmark_2: getImageUrl("1UKUxz6xZEmuViB_URDiDPQ9ACpVzElNE")
        },
        diktisaintek: {
            hitam: getImageUrl("10SNMXwLftlnEmaZqfYzbVhw3y-d9jxlg"),
            warna: getImageUrl("1uMUCLcbvymaCiLy1lZ6YBmJq-pWUa9NP")
        },
        saintek: {
            putih: getImageUrl("1NaPWYRv0Lv5ymCQJBxziY7evUVj1_TTB")
        }
    },
    maskot: {
        seno_studio: getImageUrl("1vj3fvkqGjIVDV1IufgYieVWlorvp-ew-")
    },
    // Compatibility keys for existing code (dashboard, etc.)
    // We map old keys to new schema to prevent breakage during migration
    its: {
        logo: {
            blue: getImageUrl("1cJAFXk0jpx7L-WOGD7jE4e3uRPerzmfQ"), // map to biru
            // ... other legacy mappings if needed
        }
    }
};

export type AssetConfig = typeof ASSETS;
