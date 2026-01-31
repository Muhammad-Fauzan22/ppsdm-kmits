export interface Program {
    name: string;
    code: string;
    url: string;
}

export interface Faculty {
    name: string;
    shortName: string;
    code: string;
    url: string;
    programs: Program[];
}

export const ITS_FACULTIES: Faculty[] = [
    {
        name: "Fakultas Sains dan Analitika Data",
        shortName: "SCIENTICS",
        code: "FSAD",
        url: "https://www.its.ac.id/fsad",
        programs: [
            { name: "Fisika", code: "SF", url: "#" },
            { name: "Matematika", code: "SM", url: "#" },
            { name: "Statistika", code: "SS", url: "#" },
            { name: "Kimia", code: "SK", url: "#" },
            { name: "Biologi", code: "SB", url: "#" },
            { name: "Aktuaria", code: "SA", url: "#" },
            { name: "Sains Analitik dan Instrumentasi Kimia", code: "SAIK", url: "#" }
        ]
    },
    {
        name: "Fakultas Teknologi Industri dan Rekayasa Sistem",
        shortName: "INDSYS",
        code: "FTIRS",
        url: "https://www.its.ac.id/ftirs",
        programs: [
            { name: "Teknik Mesin", code: "TM", url: "#" },
            { name: "Teknik Kimia", code: "TK", url: "#" },
            { name: "Teknik Fisika", code: "TF", url: "#" },
            { name: "Teknik Sistem dan Industri", code: "TI", url: "#" },
            { name: "Teknik Material", code: "TMat", url: "#" },
            { name: "Teknik Pangan", code: "TP", url: "#" }
        ]
    },
    {
        name: "Fakultas Teknik Sipil Perencanaan dan Kebumian",
        shortName: "CIVPLAN",
        code: "FTSPK",
        url: "https://www.its.ac.id/ftspk",
        programs: [
            { name: "Teknik Sipil", code: "TS", url: "#" },
            { name: "Arsitektur", code: "Ars", url: "#" },
            { name: "Teknik Lingkungan", code: "TL", url: "#" },
            { name: "Perencanaan Wilayah dan Kota", code: "PWK", url: "#" },
            { name: "Teknik Geomatika", code: "TG", url: "#" },
            { name: "Teknik Geofisika", code: "TGEO", url: "#" }
        ]
    },
    {
        name: "Fakultas Teknologi Kelautan",
        shortName: "MARTECH",
        code: "FTK",
        url: "https://www.its.ac.id/ftk",
        programs: [
            { name: "Teknik Perkapalan", code: "TPer", url: "#" },
            { name: "Teknik Sistem Perkapalan", code: "TSP", url: "#" },
            { name: "Teknik Kelautan", code: "TKel", url: "#" },
            { name: "Teknik Transportasi Laut", code: "TTL", url: "#" },
            { name: "Teknik Lepas Pantai", code: "TLP", url: "#" }
        ]
    },
    {
        name: "Fakultas Teknologi Elektro dan Informatika Cerdas",
        shortName: "ELECTICS",
        code: "FTEIC",
        url: "https://www.its.ac.id/fteic",
        programs: [
            { name: "Teknik Elektro", code: "TE", url: "#" },
            { name: "Teknik Biomedik", code: "TB", url: "#" },
            { name: "Teknik Komputer", code: "TKomp", url: "#" },
            { name: "Teknik Telekomunikasi", code: "TT", url: "#" },
            { name: "Informatika", code: "IF", url: "#" },
            { name: "Sistem Informasi", code: "SI", url: "#" },
            { name: "Teknologi Informasi", code: "TI", url: "#" }
        ]
    },
    {
        name: "Fakultas Desain Kreatif dan Bisnis Digital",
        shortName: "CREABIZ",
        code: "FDKBD",
        url: "https://www.its.ac.id/creabiz",
        programs: [
            { name: "Desain Produk", code: "Despro", url: "#" },
            { name: "Desain Interior", code: "DI", url: "#" },
            { name: "Desain Komunikasi Visual", code: "DKV", url: "#" },
            { name: "Manajemen Bisnis", code: "MB", url: "#" },
            { name: "Studi Pembangunan", code: "SP", url: "#" }
        ]
    },
    {
        name: "Fakultas Kedokteran dan Kesehatan",
        shortName: "MEDICS",
        code: "FKK",
        url: "https://www.its.ac.id/fkk",
        programs: [
            { name: "Teknologi Kedokteran", code: "TekKed", url: "#" },
            { name: "Kedokteran", code: "Ked", url: "#" }
        ]
    }
];
