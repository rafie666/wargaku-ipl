import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    q: 'Apakah aplikasi Wargaku IPL resmi dan aman dipasang di ponsel Android saya?',
    a: 'Ya, 100% resmi dan aman. Wargaku IPL dikembangkan khusus untuk lingkungan RT/RW dan diverifikasi langsung oleh pengurus. Aplikasi ini tidak mengandung iklan, tidak mencuri data kontak/file pribadi, dan hanya meminta izin yang relevan (seperti penyimpanan untuk menyimpan e-kuitansi dan kamera untuk memotret bukti transfer).',
  },
  {
    q: 'Bagaimana cara saya mendapatkan username dan kata sandi untuk login?',
    a: 'Data seluruh warga terdaftar telah disiapkan oleh admin RT/RW Anda berdasarkan nomor unit rumah (misalnya Blok B-12 / No. 04). Hubungi pengurus RT Anda atau periksa pengumuman di grup WhatsApp warga untuk menerima kredensial akun perdana Anda.',
  },
  {
    q: 'Mengapa aplikasi diunduh langsung dalam bentuk file APK, bukan dari Google Play Store?',
    a: 'Penggunaan APK mandiri memungkinkan pembaruan fitur, perbaikan cepat, dan sinkronisasi kebutuhan lokal lingkungan dapat dilakukan seketika tanpa tertahan antrean verifikasi Play Store. File APK ini adalah build produksi resmi (Release APK).',
  },
  {
    q: 'Bagaimana jika ada warga lansia yang kesulitan menggunakan smartphone?',
    a: 'Sistem Wargaku IPL bersifat inklusif. Warga lansia yang lebih nyaman bertransaksi tunai tetap dapat menitipkan iuran ke petugas rukun tetangga. Bendahara akan menginput bukti bayar ke sistem, sehingga data kas tetap tercatat 100% transparan dan akuntabel.',
  },
  {
    q: 'Metode pembayaran apa saja yang didukung untuk pembayaran IPL?',
    a: 'Warga dapat membayar via QRIS (semua bank seperti BCA, Mandiri, BRI, BNI serta e-wallet seperti GoPay, OVO, Dana, ShopeePay), atau transfer antarbank ke rekening resmi lingkungan. Bukti transfer cukup diunggah ke aplikasi untuk verifikasi kilat.',
  },
  {
    q: 'Apakah warga bisa memantau aliran kas dan pengeluaran lingkungan?',
    a: 'Ya! Salah satu keunggulan utama Wargaku IPL adalah fitur Transparansi Kas Terbuka. Setiap warga yang login dapat melihat total kas masuk, pengeluaran untuk keamanan, kebersihan sampah, perawatan taman, dan saldo sisa secara riil.',
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
