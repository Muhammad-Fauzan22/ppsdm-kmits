/**
 * ITS Website Structure - Based on Official ITS Website (its.ac.id)
 * Complete navigation structure and data sources for web scraping
 */

export interface ITSNavItem {
  label: string;
  href: string;
  icon?: string;
  children?: ITSNavItem[];
  scrapable?: boolean;
  sourceUrl?: string;
}

export interface ITSNavSection {
  title: string;
  items: ITSNavItem[];
}

// Main Navigation - Top Bar (Target Audience)
export const ITS_MAIN_NAV: ITSNavSection = {
  title: "Menu Utama ITS",
  items: [
    {
      label: "Calon Mahasiswa",
      href: "https://www.its.ac.id/admission/",
      scrapable: true,
      sourceUrl: "https://www.its.ac.id/admission/",
      children: [
        { label: "Info Beasiswa", href: "https://www.its.ac.id/beasiswa/" },
        { label: "Program Sarjana", href: "https://www.its.ac.id/admission/program-sarjana/" },
        { label: "Program Pascasarjana", href: "https://www.its.ac.id/admission/program-pascasarjana/" },
        { label: "Program Profesi", href: "https://www.its.ac.id/admission/program-profesi/" },
        { label: "Program Vokasi", href: "https://www.its.ac.id/admission/program-vokasi/" },
        { label: "Jalur Masuk", href: "https://www.its.ac.id/admission/jalur-masuk/" },
      ]
    },
    {
      label: "Mahasiswa",
      href: "https://www.its.ac.id/mahasiswa/",
      scrapable: true,
      sourceUrl: "https://www.its.ac.id/mahasiswa/",
      children: [
        { label: "Portal Akademik", href: "https://my.its.ac.id/" },
        { label: "Jadwal Kuliah", href: "https://www.its.ac.id/mahasiswa/jadwal-kuliah/" },
        { label: "Kalender Akademik", href: "https://www.its.ac.id/mahasiswa/kalender-akademik/" },
        { label: "Beasiswa Mahasiswa", href: "https://www.its.ac.id/mahasiswa/beasiswa/" },
        { label: "Organisasi Kemahasiswaan", href: "https://www.its.ac.id/mahasiswa/organisasi/" },
        { label: "Prestasi Mahasiswa", href: "https://www.its.ac.id/mahasiswa/prestasi/" },
      ]
    },
    {
      label: "Mahasiswa Baru",
      href: "https://www.its.ac.id/admission/mahasiswa-baru/",
      scrapable: true,
      sourceUrl: "https://www.its.ac.id/admission/mahasiswa-baru/",
      children: [
        { label: "Tata Cara Registrasi", href: "https://www.its.ac.id/admission/registrasi/" },
        { label: "Biaya Kuliah", href: "https://www.its.ac.id/admission/biaya-kuliah/" },
        { label: "Layanan Keuangan", href: "https://www.its.ac.id/admission/keuangan/" },
        { label: "Fasilitas Kampus", href: "https://www.its.ac.id/admission/fasilitas/" },
        { label: "Pengenalan Kampus", href: "https://www.its.ac.id/admission/pkks/" },
      ]
    },
    {
      label: "Dosen & Staf",
      href: "https://www.its.ac.id/dosen-staf/",
      scrapable: true,
      sourceUrl: "https://www.its.ac.id/dosen-staf/",
      children: [
        { label: "Portal Dosen", href: "https://my.its.ac.id/" },
        { label: "Sistem Informasi Dosen", href: "https://www.its.ac.id/dosen-staf/sistem-informasi/" },
        { label: "Pengembangan Karir", href: "https://www.its.ac.id/dosen-staf/pengembangan-karir/" },
        { label: "Penelitian & Pengabdian", href: "https://www.its.ac.id/dosen-staf/penelitian-pengabdian/" },
        { label: "Hibah & Funding", href: "https://www.its.ac.id/dosen-staf/hibah/" },
      ]
    },
    {
      label: "Orang Tua",
      href: "https://www.its.ac.id/orang-tua/",
      scrapable: true,
      sourceUrl: "https://www.its.ac.id/orang-tua/",
      children: [
        { label: "Panduan Orang Tua", href: "https://www.its.ac.id/orang-tua/panduan/" },
        { label: "Info Keuangan", href: "https://www.its.ac.id/orang-tua/keuangan/" },
        { label: "Kontak Penting", href: "https://www.its.ac.id/orang-tua/kontak/" },
        { label: "FAQ Orang Tua", href: "https://www.its.ac.id/orang-tua/faq/" },
      ]
    },
    {
      label: "Alumni",
      href: "https://alumni.its.ac.id/",
      scrapable: true,
      sourceUrl: "https://alumni.its.ac.id/",
      children: [
        { label: "Ikatan Alumni ITS", href: "https://alumni.its.ac.id/ikatan/" },
        { label: "Tracer Study", href: "https://alumni.its.ac.id/tracer/" },
        { label: "Kontribusi Alumni", href: "https://alumni.its.ac.id/kontribusi/" },
        { label: "Job Vacancy", href: "https://alumni.its.ac.id/vacancy/" },
        { label: "Networking", href: "https://alumni.its.ac.id/networking/" },
      ]
    },
    {
      label: "Live",
      href: "https://www.its.ac.id/live/",
      scrapable: false,
    },
    {
      label: "myITS",
      href: "https://my.its.ac.id/",
      scrapable: false,
    },
  ]
};

// Secondary Navigation - Main Menu
export const ITS_SECONDARY_NAV: ITSNavSection = {
  title: "Menu Kedua ITS",
  items: [
    {
      label: "Profil ITS",
      href: "https://www.its.ac.id/profil/",
      scrapable: true,
      sourceUrl: "https://www.its.ac.id/profil/",
      children: [
        { label: "Sejarah ITS", href: "https://www.its.ac.id/profil/sejarah/" },
        { label: "Visi, Misi & Nilai", href: "https://www.its.ac.id/profil/visi-misi/" },
        { label: "Pimpinan ITS", href: "https://www.its.ac.id/profil/pimpinan/" },
        { label: "Struktur Organisasi", href: "https://www.its.ac.id/profil/struktur-organisasi/" },
        { label: "Fakultas & Departemen", href: "https://www.its.ac.id/profil/fakultas-departemen/" },
        { label: "Kantor & Unit", href: "https://www.its.ac.id/profil/kantor-unit/" },
        { label: "Kerjasama", href: "https://www.its.ac.id/profil/kerjasama/" },
        { label: "Penghargaan", href: "https://www.its.ac.id/profil/penghargaan/" },
        { label: "Statistik ITS", href: "https://www.its.ac.id/profil/statistik/" },
      ]
    },
    {
      label: "Pendaftaran",
      href: "https://www.its.ac.id/admission/",
      scrapable: true,
      sourceUrl: "https://www.its.ac.id/admission/",
      children: [
        { label: "Pendaftaran Sarjana", href: "https://www.its.ac.id/admission/sarjana/" },
        { label: "Pendaftaran Magister", href: "https://www.its.ac.id/admission/magister/" },
        { label: "Pendaftaran Doktor", href: "https://www.its.ac.id/admission/doktor/" },
        { label: "Pendaftaran Profesi", href: "https://www.its.ac.id/admission/profesi/" },
        { label: "Pendaftaran Vokasi", href: "https://www.its.ac.id/admission/vokasi/" },
        { label: "Pendaftaran Internasional", href: "https://www.its.ac.id/admission/international/" },
      ]
    },
    {
      label: "Kuliah di ITS",
      href: "https://www.its.ac.id/kuliah/",
      scrapable: true,
      sourceUrl: "https://www.its.ac.id/kuliah/",
      children: [
        { label: "Program Sarjana (S1)", href: "https://www.its.ac.id/kuliah/sarjana/" },
        { label: "Program Magister (S2)", href: "https://www.its.ac.id/kuliah/magister/" },
        { label: "Program Doktor (S3)", href: "https://www.its.ac.id/kuliah/doktor/" },
        { label: "Program Profesi", href: "https://www.its.ac.id/kuliah/profesi/" },
        { label: "Program Vokasi (D3/D4)", href: "https://www.its.ac.id/kuliah/vokasi/" },
        { label: "Kredit Semester", href: "https://www.its.ac.id/kuliah/kredit-semester/" },
        { label: "Kurikulum & Silabus", href: "https://www.its.ac.id/kuliah/kurikulum/" },
        { label: "MBKM", href: "https://www.its.ac.id/kuliah/mbkm/" },
        { label: "Internasional Class", href: "https://www.its.ac.id/kuliah/internasional/" },
      ]
    },
    {
      label: "Riset",
      href: "https://www.its.ac.id/riset/",
      scrapable: true,
      sourceUrl: "https://www.its.ac.id/riset/",
      children: [
        { label: "Pusat Riset ITS", href: "https://www.its.ac.id/riset/pusat/" },
        { label: "Laboratorium", href: "https://www.its.ac.id/riset/laboratorium/" },
        { label: "Publikasi Ilmiah", href: "https://www.its.ac.id/riset/publikasi/" },
        { label: "Hibah Penelitian", href: "https://www.its.ac.id/riset/hibah/" },
        { label: "Kerjasama Riset", href: "https://www.its.ac.id/riset/kerjasama/" },
        { label: "Inovasi Teknologi", href: "https://www.its.ac.id/riset/inovasi/" },
        { label: "Repository", href: "https://repository.its.ac.id/" },
      ]
    },
    {
      label: "Inovasi",
      href: "https://www.its.ac.id/inovasi/",
      scrapable: true,
      sourceUrl: "https://www.its.ac.id/inovasi/",
      children: [
        { label: "Inkubator Bisnis", href: "https://www.its.ac.id/inovasi/inkubator/" },
        { label: "Startup ITS", href: "https://www.its.ac.id/inovasi/startup/" },
        { label: "Teknologi Tervalidasi", href: "https://www.its.ac.id/inovasi/teknologi/" },
        { label: "Paten & Hak Cipta", href: "https://www.its.ac.id/inovasi/paten/" },
        { label: "Research to Market", href: "https://www.its.ac.id/inovasi/r2m/" },
        { label: "Techno Park", href: "https://www.its.ac.id/inovasi/techno-park/" },
      ]
    },
    {
      label: "Inisiatif",
      href: "https://www.its.ac.id/inisiatif/",
      scrapable: true,
      sourceUrl: "https://www.its.ac.id/inisiatif/",
      children: [
        { label: "ITS Goes Global", href: "https://www.its.ac.id/inisiatif/global/" },
        { label: "Sustainability", href: "https://www.its.ac.id/inisiatif/sustainability/" },
        { label: "Digital Transformation", href: "https://www.its.ac.id/inisiatif/digital/" },
        { label: "Industri 4.0", href: "https://www.its.ac.id/inisiatif/industri4/" },
        { label: "Smart Campus", href: "https://www.its.ac.id/inisiatif/smart-campus/" },
        { label: "Entrepreneurship", href: "https://www.its.ac.id/inisiatif/entrepreneurship/" },
      ]
    },
    {
      label: "Layanan",
      href: "https://www.its.ac.id/layanan/",
      scrapable: true,
      sourceUrl: "https://www.its.ac.id/layanan/",
      children: [
        { label: "Layanan Akademik", href: "https://www.its.ac.id/layanan/akademik/" },
        { label: "Perpustakaan", href: "https://www.its.ac.id/layanan/perpustakaan/" },
        { label: "Keuangan & Pembayaran", href: "https://www.its.ac.id/layanan/keuangan/" },
        { label: "Kesehatan", href: "https://www.its.ac.id/layanan/kesehatan/" },
        { label: "Asrama", href: "https://www.its.ac.id/layanan/asrama/" },
        { label: "Pengembangan Karir", href: "https://www.its.ac.id/layanan/karir/" },
        { label: "Hukum & Konseling", href: "https://www.its.ac.id/layanan/hukum-konseling/" },
        { label: "Helpdesk IT", href: "https://www.its.ac.id/layanan/helpdesk/" },
      ]
    },
    {
      label: "Berita",
      href: "https://www.its.ac.id/news/",
      scrapable: true,
      sourceUrl: "https://www.its.ac.id/news/",
      children: [
        { label: "Berita Terkini", href: "https://www.its.ac.id/news/" },
        { label: "Pengumuman", href: "https://www.its.ac.id/news/pengumuman/" },
        { label: "Event & Agenda", href: "https://www.its.ac.id/news/event/" },
        { label: "Prestasi", href: "https://www.its.ac.id/news/prestasi/" },
        { label: "Opini & Editorial", href: "https://www.its.ac.id/news/opini/" },
        { label: "Media Coverage", href: "https://www.its.ac.id/news/media/" },
        { label: "Press Release", href: "https://www.its.ac.id/news/press-release/" },
      ]
    },
  ]
};

// Faculty & Programs - Comprehensive
export const ITS_FACULTIES_DETAILED = [
  {
    code: "FSAD",
    name: "Fakultas Sains dan Analitika Data",
    shortName: "SAIN",
    departments: [
      { code: "MA", name: "Matematika", degree: "S1", accreditation: "A" },
      { code: "FI", name: "Fisika", degree: "S1", accreditation: "A" },
      { code: "KI", name: "Kimia", degree: "S1", accreditation: "A" },
      { code: "BI", name: "Biologi", degree: "S1", accreditation: "A" },
      { code: "SA", name: "Statistika", degree: "S1", accreditation: "A" },
      { code: "AK", name: "Aktuaria", degree: "S1", accreditation: "A" },
      { code: "SC", name: "Sains Komputasi", degree: "S1", accreditation: "A" },
    ],
    url: "https://www.its.ac.id/fsad/"
  },
  {
    code: "FTIRS",
    name: "Fakultas Teknologi Industri dan Rekayasa Sistem",
    shortName: "TIRS",
    departments: [
      { code: "TF", name: "Teknik Fisika", degree: "S1", accreditation: "A" },
      { code: "TK", name: "Teknik Kimia", degree: "S1", accreditation: "A" },
      { code: "TI", name: "Teknik Industri", degree: "S1", accreditation: "A" },
      { code: "TM", name: "Teknik Material dan Metalurgi", degree: "S1", accreditation: "A" },
      { code: "TA", name: "Teknik Pangan", degree: "S1", accreditation: "A" },
      { code: "PL", name: "Teknik Logistik", degree: "S1", accreditation: "A" },
    ],
    url: "https://www.its.ac.id/ftirs/"
  },
  {
    code: "FTSPK",
    name: "Fakultas Teknik Sipil, Perencanaan, dan Kebumian",
    shortName: "Civil",
    departments: [
      { code: "TS", name: "Teknik Sipil", degree: "S1", accreditation: "A" },
      { code: "AR", name: "Arsitektur", degree: "S1", accreditation: "A" },
      { code: "TL", name: "Teknik Lingkungan", degree: "S1", accreditation: "A" },
      { code: "PW", name: "Perencanaan Wilayah dan Kota", degree: "S1", accreditation: "A" },
      { code: "GP", name: "Teknik Geofisika", degree: "S1", accreditation: "A" },
      { code: "TG", name: "Teknik Geomatika", degree: "S1", accreditation: "A" },
    ],
    url: "https://www.its.ac.id/ftspk/"
  },
  {
    code: "FTK",
    name: "Fakultas Teknologi Kelautan",
    shortName: "Marine",
    departments: [
      { code: "TKL", name: "Teknik Kelautan", degree: "S1", accreditation: "A" },
      { code: "TSK", name: "Teknik Sistem Perkapalan", degree: "S1", accreditation: "A" },
      { code: "TTR", name: "Teknik Perkapalan", degree: "S1", accreditation: "A" },
      { code: "TTP", name: "Teknik Transportasi Laut", degree: "S1", accreditation: "A" },
      { code: "KPL", name: "Teknik Lepas Pantai", degree: "S1", accreditation: "A" },
    ],
    url: "https://www.its.ac.id/ftk/"
  },
  {
    code: "FTEIC",
    name: "Fakultas Teknologi Elektro dan Informatika Cerdas",
    shortName: "EIC",
    departments: [
      { code: "EL", name: "Teknik Elektro", degree: "S1", accreditation: "A" },
      { code: "IF", name: "Teknik Informatika", degree: "S1", accreditation: "A" },
      { code: "SI", name: "Sistem Informasi", degree: "S1", accreditation: "A" },
      { code: "TIK", name: "Teknologi Informasi", degree: "S1", accreditation: "A" },
      { code: "TC", name: "Teknik Komputer", degree: "S1", accreditation: "A" },
      { code: "BIOM", name: "Teknik Biomedik", degree: "S1", accreditation: "A" },
      { code: "BIOI", name: "Teknik Biosistem", degree: "S1", accreditation: "A" },
      { code: "TRK", name: "Rekayasa Kosmetik", degree: "S1", accreditation: "A" },
    ],
    url: "https://www.its.ac.id/fteic/"
  },
  {
    code: "FADBD",
    name: "Fakultas Desain Kreatif dan Bisnis Digital",
    shortName: "VCD",
    departments: [
      { code: "DI", name: "Desain Produk Industri", degree: "S1", accreditation: "A" },
      { code: "DKV", name: "Desain Komunikasi Visual", degree: "S1", accreditation: "A" },
      { code: "DIK", name: "Desain Interior", degree: "S1", accreditation: "A" },
      { code: "BD", name: "Bisnis Digital", degree: "S1", accreditation: "A" },
      { code: "MB", name: "Manajemen Bisnis", degree: "S1", accreditation: "A" },
    ],
    url: "https://www.its.ac.id/vocational/"
  },
  {
    code: "FKK",
    name: "Fakultas Kedokteran dan Kesehatan",
    shortName: "Medicine",
    departments: [
      { code: "KD", name: "Pendidikan Kedokteran", degree: "S1", accreditation: "A" },
      { code: "PSK", name: "Psikologi", degree: "S1", accreditation: "A" },
    ],
    url: "https://www.its.ac.id/fkk/"
  },
];

// Quick Stats
export const ITS_STATS = {
  students: "30,000+",
  faculties: 7,
  departments: 39,
  studyPrograms: 37,
  researchers: "1,500+",
  publications: "5,000+",
  patents: "200+",
  ranking: "Top 10 Indonesia",
  internationalStudents: "2,000+",
  partnerUniversities: "300+",
  alumni: "100,000+",
};

// Scraper Configuration
export const ITS_SCRAPER_CONFIG = {
  baseUrl: "https://www.its.ac.id",
  newsUrl: "https://www.its.ac.id/news/",
  admissionUrl: "https://www.its.ac.id/admission/",
  researchUrl: "https://www.its.ac.id/riset/",
  innovationUrl: "https://www.its.ac.id/inovasi/",
  studentUrl: "https://www.its.ac.id/mahasiswa/",
  
  // Scraping endpoints
  endpoints: {
    news: "/news/",
    pengumuman: "/news/pengumuman/",
    events: "/news/event/",
    prestasi: "/news/prestasi/",
    beasiswa: "/beasiswa/",
    admission: "/admission/",
    research: "/riset/",
    innovation: "/inovasi/",
    faculties: "/kuliah/",
    students: "/mahasiswa/",
  },
  
  // Rate limiting
  rateLimit: {
    delay: 3000, // 3 seconds between requests
    maxRequests: 100,
    maxPages: 10,
  },
  
  // Categories for auto-tagging
  categories: [
    { name: "Akademik", keywords: ["kuliah", "ujian", "semester", "sks", "kurikulum", "jadwal", "akademik"] },
    { name: "Penelitian", keywords: ["riset", "penelitian", "hibah", "publikasi", "jurnal", "laboratorium"] },
    { name: "Inovasi", keywords: ["inovasi", "startup", "paten", "teknologi", "inkubator", "bisnis"] },
    { name: "Beasiswa", keywords: ["beasiswa", "funding", "biaya", "kuliah", "gratis", "bantuan"] },
    { name: "Pengumuman", keywords: ["pengumuman", "info", "informasi", "update", "terbaru"] },
    { name: "Prestasi", keywords: ["prestasi", "juara", "menang", "penghargaan", "lomba", "kompetisi"] },
    { name: "Event", keywords: ["event", "acara", "seminar", "workshop", "webinar", "konferensi"] },
    { name: "Kemahasiswaan", keywords: ["mahasiswa", "organisasi", "bem", "hima", "kegiatan"] },
    { name: "Kerjasama", keywords: ["kerjasama", "kolaborasi", "mou", "partnership", "internasional"] },
  ],
};

// Export combined structure
export const ITS_WEBSITE_STRUCTURE = {
  mainNav: ITS_MAIN_NAV,
  secondaryNav: ITS_SECONDARY_NAV,
  faculties: ITS_FACULTIES_DETAILED,
  stats: ITS_STATS,
  scraperConfig: ITS_SCRAPER_CONFIG,
};

export default ITS_WEBSITE_STRUCTURE;
