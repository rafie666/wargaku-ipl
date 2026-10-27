import React from 'react';
import { 
  CreditCard, 
  Wallet, 
  FileText, 
  ShieldAlert, 
  Bell, 
  QrCode, 
  CheckCircle, 
  ArrowRight,
  Receipt,
  Users,
  Eye,
  Smartphone
} from 'lucide-react';

const FEATURE_LIST = [
  {
    id: 'ipl-payment',
    icon: CreditCard,
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'Pembayaran IPL & E-Kuitansi Sah',
    desc: 'Bayar iuran kebersihan, keamanan, dan fasum via QRIS nasional atau Transfer Bank. Bukti lunas diterbitkan otomatis dan tersimpan abadi di ponsel Anda.',
    badge: 'Otomatis & Akurat',
  },
  {
    id: 'virtual-card',
    icon: QrCode,
    iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Kartu Digital Warga (Virtual ID)',
    desc: 'Identitas resmi penghuni lingkungan dengan kode unik dan format rumah baku (contoh: Blok B-12 / No. 04). Praktis ditunjukkan ke pos satpam saat verifikasi.',
    badge: 'Format Standar',
  },
  {
    id: 'transparency',
    icon: Eye,
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Transparansi Kas Lingkungan',
    desc: 'Setiap warga berhak tahu alokasi dana iuran. Pantau arus kas masuk, pengeluaran sampah, perbaikan fasilitas, dan saldo kas RT/RW secara terbuka dan real-time.',
    badge: '100% Terbuka',
  },
  {
    id: 'emergency',
    icon: ShieldAlert,
    iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
    title: 'Tombol Darurat & Pos Satpam',
    desc: 'Butuh bantuan cepat saat insiden medis, kebakaran, atau kecurigaan keamanan? Hubungi pos jaga satpam kompleks dan kontak darurat dalam satu sentuhan.',
    badge: 'Respon Cepat',
  },
  {
    id: 'surat-rt',
    icon: FileText,
    iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'Layanan Surat RT & RW Digital',
    desc: 'Urus surat pengantar domisili, izin renovasi, atau SKCK tanpa antri dan tanpa mengganggu waktu istirahat ketua RT. Cetak dan unduh dokumen langsung dari HP.',
    badge: 'Bebas Antri',
  },
  {
    id: 'pengaduan',
    icon: Bell,
    iconBg: 'bg-teal-50 text-teal-700 border-teal-200',
    title: 'Pengaduan Masalah Fasilitas Umum',
    desc: 'Lampu jalan mati, got mampet, atau fasilitas taman rusak? Foto langsung dan kirim laporan pengaduan. Pantau progres perbaikan dari pengurus lingkungan.',
    badge: 'Real-Time Update',
  },
];

export default function Features() {
  return (
    <section id="fitur" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Fitur Utama Aplikasi
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kemudahan Bertetangga yang Modern, Rapi, & Transparan
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Wargaku IPL dirancang dari kebutuhan nyata warga dan pengurus lingkungan. Semua urusan iuran dan administrasi terselesaikan tanpa repot.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURE_LIST.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={feat.id}
                className="bg-white rounded-3xl p-7 shadow-soft border border-slate-200/80 hover:shadow-elevated hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm group-hover:scale-110 transition-transform ${feat.iconBg}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                  <span>Sistem Terintegrasi</span>
                  <CheckCircle className="w-4 h-4 ml-1.5 text-emerald-600" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Highlight Banner */}
        <div className="mt-16 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-limeAccent/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-limeAccent bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-700/60 inline-block">
                Penagihan Ramah Warga
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Tanpa Intimidasi, Penuh Penghormatan Antar Warga
              </h3>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
                Sistem pengingat tagihan kami dirancang ramah dengan warna peringatan sopan (amber). Tidak ada rasa malu atau intimidasi—semua komunikasi iuran tetap hangat sesuai semangat guyub rukun warga Indonesia.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <a
                href="/wargaku-ipl.apk"
                download="wargaku-ipl.apk"
                className="bg-limeAccent hover:bg-[#c2e22f] text-darkForest font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Unduh Aplikasi Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
