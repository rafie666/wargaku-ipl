import React, { useState } from 'react';
import { ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    q: 'Apakah komplek atau perumahan kami bisa langsung bergabung menggunakan GLOSINDO IPL?',
    a: 'Tentu bisa! GLOSINDO IPL dirancang dengan arsitektur multi-tenant (multi-komplek) yang terbuka secara nasional. Pengurus dari perumahan mandiri, klaster, townhouse, apartemen, maupun RT/RW mana pun dapat langsung mendaftarkan lingkungan mereka, mengatur tarif IPL, dan mengundang warganya.',
  },
  {
    q: 'Apakah aplikasi GLOSINDO IPL resmi, aman, dan bebas dari iklan komersial?',
    a: 'Ya, 100% resmi di bawah naungan PT Global Media Pratama Solusindo, aman, dan bebas dari iklan. GLOSINDO IPL fokus murni pada utilitas tata kelola lingkungan warga. Seluruh data kependudukan, transaksi, dan bukti bayar dienkripsi serta tersimpan aman di server terisolasi.',
  },
  {
    q: 'Bagaimana cara warga mulai login dan mengakses data kompleknya?',
    a: 'Warga dapat masuk menggunakan nomor ponsel atau akun yang didaftarkan oleh pengurus perumahan/RT setempat. Setelah login, seluruh informasi blok rumah, tagihan IPL, dan arus kas komplek langsung tampil otomatis.',
  },
  {
    q: 'Bagaimana jika seorang warga memiliki lebih dari satu rumah/unit di komplek berbeda?',
    a: 'GLOSINDO IPL mendukung multi-komplek dan multi-unit dalam satu akun. Warga dapat dengan mudah beralih antar-unit rumah hanya dalam satu kali klik tanpa perlu keluar-masuk (logout) akun.',
  },
  {
    q: 'Metode pembayaran apa saja yang didukung untuk pembayaran IPL?',
    a: 'Warga dapat membayar via QRIS nasional (didukung semua bank seperti BCA, Mandiri, BRI, BNI serta e-wallet GoPay, OVO, Dana, ShopeePay), maupun transfer bank resmi pengurus komplek. Auto-matching mutasi bank didukung oleh Moota dan kuitansi digital lunas diterbitkan otomatis.',
  },
  {
    q: 'Apakah warga dan pengurus bisa memantau laporan kas lingkungan secara terbuka?',
    a: 'Ya! Fitur Transparansi Kas Terbuka menjadi fondasi utama GLOSINDO IPL. Setiap warga dan pengurus dapat memantau rincian pemasukan, pengeluaran sampah/keamanan, dan sisa saldo kas secara transparan dan real-time.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-800 text-xs font-bold uppercase tracking-wider">
            Tanya Jawab Warga
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Punya pertanyaan mengenai cara kerja atau pemasangan aplikasi? Temukan jawabannya di bawah ini:
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-10 sm:mt-12 space-y-3.5">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-brand-50/40 border-brand-300 shadow-soft'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900">
                    {item.q}
                  </span>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-brand-700 text-white rotate-180'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-brand-100 animate-in fade-in-50">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support Box */}
        <div className="mt-10 sm:mt-12 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Masih membutuhkan bantuan pengurus?</h4>
              <p className="text-xs text-slate-500">Hubungi sekretariat atau ketua RT/RW di lingkungan perumahan Anda.</p>
            </div>
          </div>
          <a
            href="#unduh"
            className="w-full sm:w-auto text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center justify-center gap-1.5 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs"
          >
            <span>Kembali ke Unduhan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
