/**
 * Static engineering knowledge seed data.
 * Contains formulas, facts, and definitions to preload the Knowledge Hub.
 */

import { transformContent } from './transformer';
import type { KnowledgeItem } from './types';

interface SeedItem {
    title: string;
    content: string;
    category: string;
    tags: string[];
}

const SEED_DATA: SeedItem[] = [
    // ─── Rumus Teknik Mesin ───────────────────────────
    {
        title: 'Hukum Hooke — Elastisitas Material',
        content: 'Hukum Hooke menyatakan bahwa tegangan (Stress) sebanding dengan regangan (Strain) selama material masih dalam batas elastis. Rumusnya: σ = Eε, dimana σ adalah tegangan (MPa), E adalah Modulus of Elasticity atau Modulus Young (GPa), dan ε adalah regangan (tanpa satuan). Baja karbon rendah memiliki Modulus of Elasticity sekitar 200 GPa, aluminium sekitar 70 GPa, dan tembaga sekitar 120 GPa.',
        category: 'formula',
        tags: ['Stress', 'Strain', 'Modulus of Elasticity', 'Hooke\'s Law'],
    },
    {
        title: 'Bilangan Reynolds — Mekanika Fluida',
        content: 'Reynolds Number (Re) adalah bilangan tak berdimensi yang digunakan untuk memprediksi pola aliran fluida. Rumus: Re = ρVD/μ, dimana ρ adalah densitas fluida, V adalah kecepatan aliran, D adalah diameter pipa, dan μ adalah Viscosity dinamis. Jika Re < 2300, aliran bersifat Laminar Flow. Jika Re > 4000, aliran menjadi Turbulent Flow. Daerah antara 2300-4000 disebut daerah transisi.',
        category: 'formula',
        tags: ['Reynolds Number', 'Laminar Flow', 'Turbulent Flow', 'Viscosity'],
    },
    {
        title: 'Efisiensi Siklus Carnot',
        content: 'Carnot Cycle adalah siklus termodinamika teoritis yang menghasilkan Efficiency maksimum. Efisiensi Carnot: η = 1 - Tc/Th, dimana Tc adalah suhu reservoir dingin dan Th adalah suhu reservoir panas (dalam Kelvin). Tidak ada mesin panas yang bisa melebihi efisiensi Carnot. Contoh: dengan Th = 500 K dan Tc = 300 K, efisiensi maksimum = 40%.',
        category: 'formula',
        tags: ['Carnot Cycle', 'Efficiency', 'Entropy'],
    },
    {
        title: 'Persamaan Bernoulli — Aliran Fluida',
        content: 'Bernoulli Equation mendeskripsikan hubungan antara tekanan, kecepatan, dan ketinggian dalam aliran fluida ideal. Bentuk umum: P + ½ρv² + ρgh = konstan. P adalah tekanan statis (Pa), ρ adalah densitas fluida (kg/m³), v adalah kecepatan aliran (m/s), g adalah percepatan gravitasi (9.81 m/s²), dan h adalah ketinggian (m). Prinsip ini digunakan dalam desain sayap pesawat dan venturimeter.',
        category: 'formula',
        tags: ['Bernoulli Equation', 'Lift', 'Drag'],
    },
    {
        title: 'Momen Inersia — Rotasi',
        content: 'Moment of Inertia (I) mengukur hambatan benda terhadap perubahan rotasi. Untuk silinder pejal: I = ½mr², untuk bola: I = ⅖mr², untuk batang tipis (sumbu tengah): I = ¹⁄₁₂mL². Torque yang diperlukan untuk menghasilkan percepatan sudut: τ = Iα, dimana α adalah percepatan sudut (rad/s²). Konsep ini penting dalam desain flywheel dan gearbox.',
        category: 'formula',
        tags: ['Moment of Inertia', 'Torque'],
    },

    // ─── Fakta Material ───────────────────────────────
    {
        title: 'Sifat Mekanik Baja Karbon',
        content: 'Baja karbon adalah Alloy besi dengan karbon (0.05-2.0%). Tensile Strength baja karbon rendah (AISI 1020) sekitar 400 MPa, sedangkan baja karbon tinggi (AISI 1095) mencapai 965 MPa. Yield Strength AISI 1020 sekitar 350 MPa. Hardness diukur dengan skala Rockwell (HRC) atau Brinell (BHN). Baja ini banyak digunakan dalam konstruksi, otomotif, dan manufaktur karena kombinasi kekuatan, Ductility, dan harga yang ekonomis.',
        category: 'material',
        tags: ['Tensile Strength', 'Yield Strength', 'Alloy', 'Hardness'],
    },
    {
        title: 'Material Komposit dalam Industri Modern',
        content: 'Composite adalah material yang terdiri dari matriks (resin, polimer) dan penguat (serat karbon, fiberglass). Carbon Fiber Reinforced Polymer (CFRP) memiliki Tensile Strength hingga 1500 MPa dengan densitas sangat rendah (1.6 g/cm³). Dibandingkan baja, CFRP 5x lebih kuat per satuan berat. Aplikasi utama: pesawat Boeing 787 (50% Composite), mobil Formula 1, dan turbin angin. Tantangan utama adalah biaya produksi dan daur ulang.',
        category: 'material',
        tags: ['Composite', 'Tensile Strength', 'Polymer'],
    },
    {
        title: 'Keramik Teknik — Material Tahan Suhu Tinggi',
        content: 'Ceramic teknik seperti alumina (Al₂O₃) dan silikon karbida (SiC) memiliki titik leleh sangat tinggi (>2000 °C) dan Hardness luar biasa. SiC memiliki Hardness ~2800 HV dan tahan terhadap korosi kimia. Aplikasi: pelapis turbin gas, bantalan presisi, dan alat potong. Kekurangannya adalah Brittleness — mudah patah mendadak tanpa deformasi plastis. Penelitian terbaru mengembangkan Ceramic matriks komposit untuk mengurangi kelemahan ini.',
        category: 'material',
        tags: ['Ceramic', 'Hardness', 'Brittleness'],
    },

    // ─── Proses Manufaktur ────────────────────────────
    {
        title: 'CNC Machining — Revolusi Manufaktur Presisi',
        content: 'CNC (Computer Numerical Control) adalah teknologi yang mengontrol mesin perkakas melalui program komputer (G-code). Proses CNC meliputi Turning (bubut), Milling (frais), dan Drilling (bor). Akurasi CNC modern mencapai ±0.001 mm dengan Surface Roughness Ra 0.4 μm. Mesin CNC 5-axis memungkinkan pemesinan geometri kompleks dalam satu setup. Industri 4.0 mengintegrasikan CNC dengan IoT untuk Predictive Maintenance.',
        category: 'manufacturing',
        tags: ['CNC', 'Turning', 'Milling', 'Drilling', 'Surface Roughness'],
    },
    {
        title: '3D Printing — Masa Depan Manufaktur',
        content: '3D Printing atau Additive Manufacturing membangun objek lapis demi lapis dari model digital. Teknologi populer: FDM (Fused Deposition Modeling) menggunakan Polymer filamen, SLA (Stereolithography) menggunakan resin cair, SLM (Selective Laser Melting) untuk logam. Resolusi terbaik mencapai 25 μm per lapisan. NASA menggunakan 3D Printing untuk membuat komponen roket dari Alloy titanium. Pasar global 3D Printing diperkirakan mencapai $50 miliar pada 2030.',
        category: 'manufacturing',
        tags: ['3D Printing', 'Additive Manufacturing', 'Polymer'],
    },
    {
        title: 'Welding — Teknik Penyambungan Logam',
        content: 'Welding adalah proses menyambung material dengan meleburkan bagian sambungan. Jenis utama: SMAW (Shielded Metal Arc Welding), MIG/MAG (Metal Inert/Active Gas), TIG (Tungsten Inert Gas), dan Friction Stir Welding. Kekuatan sambungan Welding bisa mencapai 100% dari material dasar jika dilakukan benar. Parameter kritis: arus listrik (A), tegangan (V), kecepatan travel, dan gas pelindung. Pengelasan robot (Robotics) meningkatkan konsistensi dan produktivitas 300%.',
        category: 'manufacturing',
        tags: ['Welding', 'Robotics'],
    },

    // ─── Kontrol & Mekatronika ────────────────────────
    {
        title: 'PID Controller — Otak Sistem Otomasi',
        content: 'PID Controller adalah algoritma kontrol yang paling banyak digunakan di industri. Tiga komponen: P (Proporsional) merespons error saat ini, I (Integral) menghilangkan offset steady-state, D (Derivatif) memprediksi error masa depan. Output = Kp·e(t) + Ki·∫e(t)dt + Kd·de(t)/dt. Tuning PID bisa menggunakan metode Ziegler-Nichols. Aplikasi: kontrol suhu oven industri, Servo Motor positioning, cruise control mobil, dan drone stabilization.',
        category: 'mechatronics',
        tags: ['PID Controller', 'Sensor', 'Actuator', 'Feedback Loop', 'Servo Motor'],
    },
    {
        title: 'IoT dalam Manufaktur Cerdas',
        content: 'IoT (Internet of Things) menghubungkan mesin, Sensor, dan sistem melalui internet untuk monitoring real-time. Dalam konteks Industry 4.0, IoT memungkinkan Predictive Maintenance yang mengurangi downtime hingga 50%. Sensor vibration pada motor listrik mengirim data ke Cloud Computing untuk analisis menggunakan Machine Learning. Platform seperti SCADA dan PLC terkoneksi membentuk ekosistem pabrik cerdas (Smart Factory). Investasi IoT industri global mencapai $200 miliar.',
        category: 'mechatronics',
        tags: ['IoT', 'Industry 4.0', 'Predictive Maintenance', 'SCADA', 'PLC'],
    },

    // ─── Energi ───────────────────────────────────────
    {
        title: 'Turbin Gas — Konversi Energi Tinggi',
        content: 'Turbine gas modern mengkonversi energi kimia bahan bakar menjadi energi mekanik melalui Combustion. Suhu inlet Turbine modern mencapai 1500 °C menggunakan blade berpendingin. Efficiency Turbine gas siklus sederhana sekitar 35%, tapi combined cycle (gas + uap) mencapai 60%. Compressor aksial meningkatkan tekanan udara masuk 30-40 kali. GE 9HA menghasilkan 571 MW dengan efisiensi 64%. Teknologi blade menggunakan Ceramic coating dan single-crystal Alloy.',
        category: 'energy',
        tags: ['Turbine', 'Combustion', 'Compressor', 'Efficiency'],
    },
    {
        title: 'Heat Exchanger — Perpindahan Panas Efisien',
        content: 'Heat Exchanger adalah perangkat untuk mentransfer panas antara dua fluida tanpa pencampuran. Tipe utama: shell-and-tube (paling umum), plate, fin-tube, dan Heat pipe. Efektivitas Heat Exchanger tergantung pada luas permukaan, koefisien perpindahan panas, dan pola aliran (counter-flow lebih efisien dari parallel-flow). Koefisien perpindahan panas Convection air: 5-25 W/m²·K, Convection air paksa: 25-250 W/m²·K, Convection cairan: 100-20000 W/m²·K.',
        category: 'energy',
        tags: ['Heat Exchanger', 'Heat Transfer', 'Convection'],
    },

    // ─── Standar & Kualitas ───────────────────────────
    {
        title: 'Six Sigma — Menuju Zero Defect',
        content: 'Six Sigma adalah metodologi kualitas yang menargetkan tidak lebih dari 3.4 cacat per satu juta peluang (DPMO). Menggunakan pendekatan DMAIC: Define, Measure, Analyze, Improve, Control. Toyota mengombinasikan Lean Manufacturing dengan Six Sigma menjadi Lean Six Sigma. Alat statistik: control chart, FMEA, Pareto diagram, dan fishbone diagram. Kaizen (perbaikan berkelanjutan) menjadi budaya inti. Perusahaan yang menerapkan Six Sigma melaporkan penghematan rata-rata 2-3% dari revenue.',
        category: 'standards',
        tags: ['Six Sigma', 'Lean Manufacturing', 'Kaizen', 'FMEA', 'Quality Control'],
    },

    // ─── Digital Twin & Industri 4.0 ──────────────────
    {
        title: 'Digital Twin — Replika Virtual Sistem Fisik',
        content: 'Digital Twin adalah representasi virtual real-time dari aset fisik menggunakan data Sensor dan Simulation. GE menggunakan Digital Twin untuk memonitor 30.000 Turbine di seluruh dunia. Data dari IoT Sensor diproses dengan Machine Learning untuk memprediksi kegagalan dan mengoptimalkan performa. Siemens memperkirakan Digital Twin mengurangi waktu pengembangan produk 50% dan biaya prototipe 90%. Pasar Digital Twin diproyeksikan mencapai $48 miliar pada 2026.',
        category: 'industry4',
        tags: ['Digital Twin', 'Simulation', 'Machine Learning', 'IoT'],
    },
];

/**
 * Get seed data as KnowledgeItem-ready objects.
 * Each item is enriched with interactive metadata from the NLP transformer.
 */
export function getSeedData(): Omit<KnowledgeItem, 'id' | 'created_at' | 'updated_at'>[] {
    return SEED_DATA.map(item => {
        const metadata = transformContent(item.content, item.category);

        return {
            source: 'seed',
            title: item.title,
            content: item.content,
            summary: item.content.substring(0, 200),
            url: null,
            image_url: null,
            published_at: new Date().toISOString(),
            interactive_metadata: metadata,
            category: item.category,
            tags: item.tags,
            is_current: true,
        };
    });
}
