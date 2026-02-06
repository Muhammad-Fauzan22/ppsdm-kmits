"use client";

export function FAQ() {
    const faqs = [
        {
            q: "Apakah platform ini benar-benar gratis?",
            a: "Ya, 100% gratis untuk mahasiswa ITS, didanai oleh institusi dan research grants."
        },
        {
            q: "Berapa lama assessment lengkap?",
            a: "Rata-rata 30 menit untuk 9 dimensi. Bisa dikerjakan bertahap (save progress)."
        },
        {
            q: "Bagaimana dengan privasi data saya?",
            a: "Data disimpan di server ITS dengan enkripsi end-to-end. Kami tidak membagikan data personal ke pihak ketiga."
        },
        {
            q: "Apakah perlu install aplikasi?",
            a: "Tidak, 100% browser-based. Website ini juga merupakan PWA yang bisa di-install ke home screen."
        },
    ];

    return (
        <section id="faq" className="py-24 bg-slate-50">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Pertanyaan Umum</h2>
                    <div className="h-1 w-20 bg-brand-blue mx-auto rounded-full"></div>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{faq.q}</h3>
                            <p className="text-gray-600">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
