/**
 * Engineering Glossary — 100+ terms in Teknik Mesin context
 * Used for term detection in the NLP transformer and tooltip display.
 */

export interface GlossaryTerm {
    term: string;
    definition: string;
    definitionId: string; // Bahasa Indonesia
    category: string;
}

export const ENGINEERING_GLOSSARY: GlossaryTerm[] = [
    // ─── Teknik Mesin Umum ────────────────────────────
    { term: 'CAD', definition: 'Computer-Aided Design — software for creating 2D/3D models', definitionId: 'Desain Berbantuan Komputer — perangkat lunak untuk membuat model 2D/3D', category: 'Design' },
    { term: 'CAM', definition: 'Computer-Aided Manufacturing — automated machining from CAD models', definitionId: 'Manufaktur Berbantuan Komputer — pemesinan otomatis dari model CAD', category: 'Manufacturing' },
    { term: 'CAE', definition: 'Computer-Aided Engineering — simulation and analysis tools', definitionId: 'Rekayasa Berbantuan Komputer — alat simulasi dan analisis', category: 'Design' },
    { term: 'FEA', definition: 'Finite Element Analysis — structural simulation method', definitionId: 'Analisis Elemen Hingga — metode simulasi struktural', category: 'Analysis' },
    { term: 'CFD', definition: 'Computational Fluid Dynamics — fluid flow simulation', definitionId: 'Dinamika Fluida Komputasi — simulasi aliran fluida', category: 'Analysis' },
    { term: 'CNC', definition: 'Computer Numerical Control — automated machine tool control', definitionId: 'Kontrol Numerik Komputer — kontrol mesin otomatis', category: 'Manufacturing' },
    { term: 'GD&T', definition: 'Geometric Dimensioning and Tolerancing — technical drawing standards', definitionId: 'Dimensi Geometris dan Toleransi — standar gambar teknik', category: 'Design' },
    { term: 'BOM', definition: 'Bill of Materials — list of parts in a product', definitionId: 'Daftar Material — daftar komponen dalam suatu produk', category: 'Manufacturing' },

    // ─── Material ─────────────────────────────────────
    { term: 'Tensile Strength', definition: 'Maximum stress a material can withstand while being stretched (MPa)', definitionId: 'Kekuatan tarik maksimum material sebelum putus (MPa)', category: 'Material' },
    { term: 'Yield Strength', definition: 'Stress at which a material begins to deform permanently', definitionId: 'Tegangan saat material mulai berubah bentuk secara permanen', category: 'Material' },
    { term: 'Hardness', definition: 'Resistance of a material to deformation or scratching', definitionId: 'Ketahanan material terhadap deformasi atau goresan', category: 'Material' },
    { term: 'Fatigue', definition: 'Weakening of material from repeated cyclic loading', definitionId: 'Pelemahan material akibat pembebanan siklis berulang', category: 'Material' },
    { term: 'Creep', definition: 'Slow deformation under constant stress at high temperature', definitionId: 'Deformasi lambat di bawah tegangan konstan pada suhu tinggi', category: 'Material' },
    { term: 'Ductility', definition: 'Ability of a material to deform under tensile stress', definitionId: 'Kemampuan material berubah bentuk di bawah tegangan tarik', category: 'Material' },
    { term: 'Brittleness', definition: 'Tendency to fracture without significant deformation', definitionId: 'Kecenderungan patah tanpa deformasi signifikan', category: 'Material' },
    { term: 'Elasticity', definition: 'Ability to return to original shape after deformation', definitionId: 'Kemampuan kembali ke bentuk semula setelah deformasi', category: 'Material' },
    { term: 'Modulus of Elasticity', definition: 'Young\'s Modulus — ratio of stress to strain (GPa)', definitionId: 'Modulus Young — rasio tegangan terhadap regangan (GPa)', category: 'Material' },
    { term: 'Poisson\'s Ratio', definition: 'Ratio of lateral strain to axial strain', definitionId: 'Rasio regangan lateral terhadap regangan aksial', category: 'Material' },
    { term: 'Composite', definition: 'Material made from two or more constituents with different properties', definitionId: 'Material dari dua atau lebih unsur dengan sifat berbeda', category: 'Material' },
    { term: 'Alloy', definition: 'Metallic material composed of two or more elements', definitionId: 'Material logam yang terdiri dari dua atau lebih unsur', category: 'Material' },
    { term: 'Polymer', definition: 'Large molecules made of repeating structural units', definitionId: 'Molekul besar dari unit struktural berulang', category: 'Material' },
    { term: 'Ceramic', definition: 'Non-metallic solid material with high heat resistance', definitionId: 'Material padat non-logam dengan ketahanan panas tinggi', category: 'Material' },

    // ─── Termodinamika ────────────────────────────────
    { term: 'Entropy', definition: 'Measure of disorder or randomness in a system', definitionId: 'Ukuran ketidakteraturan dalam suatu sistem', category: 'Thermodynamics' },
    { term: 'Enthalpy', definition: 'Total heat content of a system (H = U + PV)', definitionId: 'Kandungan panas total sistem (H = U + PV)', category: 'Thermodynamics' },
    { term: 'Carnot Cycle', definition: 'Most efficient theoretical thermodynamic cycle', definitionId: 'Siklus termodinamika teoritis paling efisien', category: 'Thermodynamics' },
    { term: 'Heat Transfer', definition: 'Movement of thermal energy between bodies', definitionId: 'Perpindahan energi termal antar benda', category: 'Thermodynamics' },
    { term: 'Conduction', definition: 'Heat transfer through direct contact', definitionId: 'Perpindahan panas melalui kontak langsung', category: 'Thermodynamics' },
    { term: 'Convection', definition: 'Heat transfer through fluid movement', definitionId: 'Perpindahan panas melalui pergerakan fluida', category: 'Thermodynamics' },
    { term: 'Radiation', definition: 'Heat transfer through electromagnetic waves', definitionId: 'Perpindahan panas melalui gelombang elektromagnetik', category: 'Thermodynamics' },
    { term: 'Adiabatic', definition: 'Process with no heat exchange with surroundings', definitionId: 'Proses tanpa pertukaran panas dengan lingkungan', category: 'Thermodynamics' },
    { term: 'Isothermal', definition: 'Process at constant temperature', definitionId: 'Proses pada suhu konstan', category: 'Thermodynamics' },
    { term: 'Isobaric', definition: 'Process at constant pressure', definitionId: 'Proses pada tekanan konstan', category: 'Thermodynamics' },

    // ─── Mekanika Fluida ──────────────────────────────
    { term: 'Reynolds Number', definition: 'Dimensionless number predicting flow regime (laminar/turbulent)', definitionId: 'Bilangan tak berdimensi untuk memprediksi rezim aliran', category: 'Fluid Mechanics' },
    { term: 'Bernoulli Equation', definition: 'Conservation of energy in fluid flow', definitionId: 'Konservasi energi dalam aliran fluida', category: 'Fluid Mechanics' },
    { term: 'Viscosity', definition: 'Measure of a fluid\'s resistance to flow', definitionId: 'Ukuran hambatan fluida terhadap aliran', category: 'Fluid Mechanics' },
    { term: 'Laminar Flow', definition: 'Smooth, orderly fluid motion (Re < 2300)', definitionId: 'Gerakan fluida yang halus dan teratur (Re < 2300)', category: 'Fluid Mechanics' },
    { term: 'Turbulent Flow', definition: 'Chaotic fluid motion with eddies (Re > 4000)', definitionId: 'Gerakan fluida kacau dengan pusaran (Re > 4000)', category: 'Fluid Mechanics' },
    { term: 'Boundary Layer', definition: 'Thin layer of fluid near a surface with velocity gradient', definitionId: 'Lapisan tipis fluida dekat permukaan dengan gradien kecepatan', category: 'Fluid Mechanics' },
    { term: 'Drag', definition: 'Force opposing motion through a fluid', definitionId: 'Gaya yang menghambat gerakan melalui fluida', category: 'Fluid Mechanics' },
    { term: 'Lift', definition: 'Force perpendicular to flow direction', definitionId: 'Gaya tegak lurus terhadap arah aliran', category: 'Fluid Mechanics' },

    // ─── Mekanika & Dinamika ──────────────────────────
    { term: 'Torque', definition: 'Rotational force (τ = F × r)', definitionId: 'Gaya putar (τ = F × r)', category: 'Mechanics' },
    { term: 'Stress', definition: 'Internal force per unit area (σ = F/A)', definitionId: 'Gaya internal per satuan luas (σ = F/A)', category: 'Mechanics' },
    { term: 'Strain', definition: 'Deformation per unit length (ε = ΔL/L)', definitionId: 'Deformasi per satuan panjang (ε = ΔL/L)', category: 'Mechanics' },
    { term: 'Shear Stress', definition: 'Stress parallel to the material cross-section', definitionId: 'Tegangan sejajar penampang material', category: 'Mechanics' },
    { term: 'Bending Moment', definition: 'Internal moment causing bending in a beam', definitionId: 'Momen internal yang menyebabkan lentur pada balok', category: 'Mechanics' },
    { term: 'Deflection', definition: 'Displacement of a structural element under load', definitionId: 'Perpindahan elemen struktural di bawah beban', category: 'Mechanics' },
    { term: 'Moment of Inertia', definition: 'Resistance to rotational acceleration (I)', definitionId: 'Hambatan terhadap percepatan rotasi (I)', category: 'Mechanics' },
    { term: 'Hooke\'s Law', definition: 'Stress is proportional to strain (σ = Eε)', definitionId: 'Tegangan sebanding dengan regangan (σ = Eε)', category: 'Mechanics' },
    { term: 'Free Body Diagram', definition: 'Diagram showing all forces acting on a body', definitionId: 'Diagram yang menunjukkan semua gaya pada suatu benda', category: 'Mechanics' },

    // ─── Manufaktur ───────────────────────────────────
    { term: 'Turning', definition: 'Machining process using a lathe', definitionId: 'Proses pemesinan menggunakan mesin bubut', category: 'Manufacturing' },
    { term: 'Milling', definition: 'Machining with a rotating cutter', definitionId: 'Pemesinan dengan pemotong berputar', category: 'Manufacturing' },
    { term: 'Drilling', definition: 'Creating holes using a rotating drill bit', definitionId: 'Membuat lubang dengan mata bor berputar', category: 'Manufacturing' },
    { term: 'Welding', definition: 'Joining metals by melting and fusing', definitionId: 'Menyambung logam dengan melelehkan dan melebur', category: 'Manufacturing' },
    { term: 'Casting', definition: 'Forming by pouring molten material into a mold', definitionId: 'Pembentukan dengan menuang material cair ke cetakan', category: 'Manufacturing' },
    { term: 'Forging', definition: 'Shaping metal using compressive forces', definitionId: 'Membentuk logam dengan gaya tekan', category: 'Manufacturing' },
    { term: 'Injection Molding', definition: 'Manufacturing by injecting molten material into a mold', definitionId: 'Manufaktur dengan menyuntikkan material cair ke cetakan', category: 'Manufacturing' },
    { term: '3D Printing', definition: 'Additive manufacturing building layer by layer', definitionId: 'Manufaktur aditif membangun lapis demi lapis', category: 'Manufacturing' },
    { term: 'Surface Roughness', definition: 'Measure of texture of a machined surface (Ra)', definitionId: 'Ukuran tekstur permukaan hasil pemesinan (Ra)', category: 'Manufacturing' },
    { term: 'Tolerance', definition: 'Permissible variation in a dimension', definitionId: 'Variasi yang diizinkan dalam suatu dimensi', category: 'Manufacturing' },

    // ─── Kontrol & Mekatronika ────────────────────────
    { term: 'PID Controller', definition: 'Proportional-Integral-Derivative feedback controller', definitionId: 'Kontroler umpan balik Proporsional-Integral-Derivatif', category: 'Mechatronics' },
    { term: 'Sensor', definition: 'Device that detects physical quantities', definitionId: 'Perangkat pendeteksi besaran fisika', category: 'Mechatronics' },
    { term: 'Actuator', definition: 'Device that converts energy into motion', definitionId: 'Perangkat yang mengubah energi menjadi gerakan', category: 'Mechatronics' },
    { term: 'Feedback Loop', definition: 'System where output is fed back as input', definitionId: 'Sistem di mana keluaran dikembalikan sebagai masukan', category: 'Mechatronics' },
    { term: 'Servo Motor', definition: 'Motor with precise position control', definitionId: 'Motor dengan kontrol posisi presisi', category: 'Mechatronics' },
    { term: 'Stepper Motor', definition: 'Motor that moves in discrete steps', definitionId: 'Motor yang bergerak dalam langkah diskrit', category: 'Mechatronics' },
    { term: 'Arduino', definition: 'Open-source microcontroller platform', definitionId: 'Platform mikrokontroler sumber terbuka', category: 'Mechatronics' },
    { term: 'IoT', definition: 'Internet of Things — connected physical devices', definitionId: 'Internet of Things — perangkat fisik terhubung', category: 'Mechatronics' },
    { term: 'SCADA', definition: 'Supervisory Control and Data Acquisition', definitionId: 'Kontrol Pengawasan dan Akuisisi Data', category: 'Mechatronics' },
    { term: 'PLC', definition: 'Programmable Logic Controller — industrial computer', definitionId: 'Kontroler Logika Terprogram — komputer industri', category: 'Mechatronics' },

    // ─── Energi & Konversi ────────────────────────────
    { term: 'Turbine', definition: 'Rotary engine extracting energy from fluid flow', definitionId: 'Mesin putar yang mengekstrak energi dari aliran fluida', category: 'Energy' },
    { term: 'Compressor', definition: 'Device that increases gas pressure', definitionId: 'Perangkat yang meningkatkan tekanan gas', category: 'Energy' },
    { term: 'Heat Exchanger', definition: 'Device for transferring heat between fluids', definitionId: 'Perangkat untuk memindahkan panas antar fluida', category: 'Energy' },
    { term: 'Boiler', definition: 'Vessel for generating steam from water', definitionId: 'Bejana untuk menghasilkan uap dari air', category: 'Energy' },
    { term: 'Combustion', definition: 'Chemical reaction producing heat and light', definitionId: 'Reaksi kimia yang menghasilkan panas dan cahaya', category: 'Energy' },
    { term: 'Efficiency', definition: 'Ratio of useful output to total input (η = Wout/Win)', definitionId: 'Rasio keluaran berguna terhadap masukan total (η = Wout/Win)', category: 'Energy' },
    { term: 'Renewable Energy', definition: 'Energy from naturally replenishing sources', definitionId: 'Energi dari sumber yang dapat diperbaharui secara alami', category: 'Energy' },
    { term: 'Solar Cell', definition: 'Device converting sunlight to electricity', definitionId: 'Perangkat pengubah sinar matahari menjadi listrik', category: 'Energy' },

    // ─── Standar & Kualitas ───────────────────────────
    { term: 'ISO 9001', definition: 'Quality management system standard', definitionId: 'Standar sistem manajemen mutu', category: 'Standards' },
    { term: 'Six Sigma', definition: 'Methodology for eliminating defects (3.4 DPMO)', definitionId: 'Metodologi untuk menghilangkan cacat (3,4 DPMO)', category: 'Standards' },
    { term: 'Lean Manufacturing', definition: 'Minimizing waste while maximizing value', definitionId: 'Meminimalkan pemborosan sambil memaksimalkan nilai', category: 'Standards' },
    { term: 'Kaizen', definition: 'Continuous improvement philosophy', definitionId: 'Filosofi perbaikan berkelanjutan', category: 'Standards' },
    { term: 'FMEA', definition: 'Failure Mode and Effects Analysis', definitionId: 'Analisis Mode Kegagalan dan Efeknya', category: 'Standards' },
    { term: 'Quality Control', definition: 'Process ensuring products meet specifications', definitionId: 'Proses memastikan produk memenuhi spesifikasi', category: 'Standards' },

    // ─── Digital & Industri 4.0 ───────────────────────
    { term: 'Digital Twin', definition: 'Virtual replica of a physical system', definitionId: 'Replika virtual dari sistem fisik', category: 'Industry 4.0' },
    { term: 'Machine Learning', definition: 'AI algorithms that improve through experience', definitionId: 'Algoritma AI yang berkembang melalui pengalaman', category: 'Industry 4.0' },
    { term: 'Industry 4.0', definition: 'Fourth industrial revolution — smart factories', definitionId: 'Revolusi industri keempat — pabrik cerdas', category: 'Industry 4.0' },
    { term: 'Additive Manufacturing', definition: 'Building 3D objects by adding material layer by layer', definitionId: 'Membangun objek 3D dengan menambahkan material lapis demi lapis', category: 'Industry 4.0' },
    { term: 'Robotics', definition: 'Design and application of robots', definitionId: 'Desain dan aplikasi robot', category: 'Industry 4.0' },
    { term: 'Simulation', definition: 'Computer-based model of real-world processes', definitionId: 'Model berbasis komputer dari proses dunia nyata', category: 'Industry 4.0' },
    { term: 'Cloud Computing', definition: 'On-demand computing resources over the internet', definitionId: 'Sumber daya komputasi sesuai permintaan melalui internet', category: 'Industry 4.0' },
    { term: 'Big Data', definition: 'Large complex datasets requiring advanced analytics', definitionId: 'Dataset besar dan kompleks yang memerlukan analitik canggih', category: 'Industry 4.0' },
    { term: 'Predictive Maintenance', definition: 'Using data to predict equipment failures before they occur', definitionId: 'Menggunakan data untuk memprediksi kegagalan peralatan', category: 'Industry 4.0' },
    { term: 'Autonomous Vehicle', definition: 'Self-driving vehicle using AI and sensors', definitionId: 'Kendaraan otonom menggunakan AI dan sensor', category: 'Industry 4.0' },
];

// Build a fast lookup map
export const GLOSSARY_MAP = new Map<string, GlossaryTerm>(
    ENGINEERING_GLOSSARY.map(t => [t.term.toLowerCase(), t])
);

// Get all unique categories
export const GLOSSARY_CATEGORIES = [...new Set(ENGINEERING_GLOSSARY.map(t => t.category))];
