import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    q: 'Apakah komplek atau perumahan kami bisa langsung bergabung menggunakan IPL WARGA?',
    a: 'Tentu bisa! IPL WARGA dirancang dengan arsitektur multi-tenant (multi-komplek) yang terbuka secara nasional. Pengurus dari perumahan mandiri, klaster, townhouse, apartemen, maupun RT/RW mana pun dapat langsung mendaftarkan lingkungan mereka, mengatur tarif IPL, dan mengundang warganya.',
  },
  {
    q: 'Apakah aplikasi IPL WARGA resmi, aman, dan bebas dari iklan komersial?',
    a: 'Ya, 100% resmi, aman, dan bebas dari iklan. IPL WARGA fokus murni pada utilitas tata kelola lingkungan warga. Seluruh data kependudukan, transaksi, dan bukti bayar dienkripsi serta tersimpan aman di server terisolasi.',
  },
  {
    q: 'Bagaimana cara warga mulai login dan mengakses data kompleknya?',
    a: 'Warga dapat masuk menggunakan nomor ponsel atau akun yang didaftarkan oleh pengurus perumahan/RT setempat. Setelah login, seluruh informasi blok rumah, tagihan IPL, dan arus kas komplek langsung tampil otomatis.',
  },
  {
    q: 'Bagaimana jika seorang warga memiliki lebih dari satu rumah/unit di komplek berbeda?',
    a: 'IPL WARGA mendukung multi-komplek dan multi-unit dalam satu akun. Warga dapat dengan mudah beralih antar-unit rumah hanya dalam satu kali klik tanpa perlu keluar-masuk (logout) akun.',
  },
  {
    q: 'Metode pembayaran apa saja yang didukung untuk pembayaran IPL?',
    a: 'Warga dapat membayar via QRIS nasional (didukung semua bank seperti BCA, Mandiri, BRI, BNI serta e-wallet GoPay, OVO, Dana, ShopeePay), maupun transfer bank resmi pengurus komplek. Kuitansi digital lunas diterbitkan otomatis.',
  },
  {
    q: 'Apakah warga dan pengurus bisa memantau laporan kas lingkungan secara terbuka?',
    a: 'Ya! Fitur Transparansi Kas Terbuka menjadi fondasi utama IPL WARGA. Setiap warga dan pengurus dapat memantau rincian pemasukan, pengeluaran sampah/keamanan, dan sisa saldo kas secara transparan dan real-time.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="py-20 bg-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Tanya Jawab Warga
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-base text-slate-600">
            Punya pertanyaan mengenai cara kerja atau pemasangan aplikasi? Temukan jawabannya di bawah ini:
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-12 space-y-4">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-emerald-50/50 border-emerald-300/80 shadow-soft'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-base sm:text-lg text-slate-900">
                    {item.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-emerald-700 text-white rotate-180'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-emerald-100/60 animate-in fade-in-50">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support Box */}
        <div className="mt-12 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Masih membutuhkan bantuan pengurus?</h4>
              <p className="text-xs text-slate-500">Hubungi sekretariat atau ketua RT/RW di lingkungan perumahan Anda.</p>
            </div>
          </div>
          <a
            href="#unduh"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs"
          >
            <span>Kembali ke Unduhan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
