export interface EmergencyResource {
    id: string;
    name: string;
    category: 'medical' | 'counseling' | 'hotline' | 'security';
    phone: string;
    whatsapp?: string;
    email?: string;
    website?: string;
    location?: string;
    locationLink?: string;
    availableHours: string;
    description: string;
    priority: 1 | 2 | 3;
}

export const EMERGENCY_RESOURCES: EmergencyResource[] = [
    // Campus Resources
    {
        id: 'its_medical',
        name: 'ITS Medical Center',
        category: 'medical',
        phone: '031-5947360',
        location: 'Jl. Arief Rahman Hakim',
        locationLink: 'https://goo.gl/maps/example',
        availableHours: '24/7 (Emergency)',
        description: 'Pusat layanan kesehatan utama kampus ITS. Tersedia ambulans dan dokter jaga.',
        priority: 1
    },
    {
        id: 'its_counseling',
        name: 'Unit Konseling Mahasiswa (Bimbingan Konseling)',
        category: 'counseling',
        phone: '0811-3322-1111',
        whatsapp: '0811-3322-1111',
        email: 'konseling@its.ac.id',
        availableHours: 'Mon-Fri, 08:00 - 16:00',
        description: 'Layanan psikolog profesional gratis untuk mahasiswa ITS. Dijamin kerahasiaan.',
        priority: 2
    },
    {
        id: 'skk_security',
        name: 'SKK ITS (Keamanan Kampus)',
        category: 'security',
        phone: '031-5925000',
        availableHours: '24/7',
        description: 'Hubungi jika mengalami keadaan darurat keamanan di dalam lingkungan kampus.',
        priority: 1
    },

    // National & External Resources
    {
        id: 'pulih',
        name: 'Yayasan Pulih',
        category: 'counseling',
        phone: '021-78842580',
        website: 'https://yayasanpulih.org',
        availableHours: '09:00 - 17:00',
        description: 'Layanan konseling psikologis pemulihan trauma dan krisis.',
        priority: 2
    },
    {
        id: 'lisa_hotline',
        name: 'LISA (Love Inside Suicide Awareness)',
        category: 'hotline',
        phone: '+62-811-3855-472',
        availableHours: '24/7',
        description: 'Layanan pencegahan bunuh diri dan kesehatan mental darurat (Bahasa Indonesia & English).',
        priority: 1
    }
];
