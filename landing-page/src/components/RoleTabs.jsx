import React, { useState } from 'react';
import { Users, UserCheck, Shield, Wallet, Check, Building2, Sliders } from 'lucide-react';

const ROLES_DATA = [
  {
    id: 'warga',
    title: 'Warga & Penghuni',
    icon: Users,
    tagline: 'Praktis, Mandiri, & Selalu Terinformasi',
    summary: 'Warga komplek tidak perlu lagi menunggu didatangi penagih atau bingung mencari kuitansi fisik yang hilang.',
    points: [
      'Cek tagihan IPL bulanan kapan saja langsung dari ponsel.',
      'Bayar instan via QRIS dan Transfer Bank dengan auto-verifikasi mutasi Moota.',
      'Unduh e-kuitansi sah resmi bernomor seri unik sebagai bukti pembayaran permanen.',
      'Kartu Identitas Digital Penghuni lengkap dengan nama perumahan, blok, & nomor unit.',
      'Akses tombol darurat terhubung langsung ke pos keamanan komplek 24 jam.',
    ],
    highlight: 'Warga dapat melihat ringkasan kas lingkungan secara transparan demi akuntabilitas bersama.'
  },
  {
    id: 'rt-rw',
    title: 'Ketua RT & RW',
    icon: UserCheck,
    tagline: 'Administrasi Rapi, Pantauan Wilayah Satu Dasbor',
    summary: 'Pengurus komplek, klaster, dan RT/RW memiliki dasbor khusus untuk memantau status iuran per blok dan validasi warga.',
    points: [
      'Peta Warga interaktif untuk pantau status iuran (Lunas vs Tunggakan) per blok rumah.',
      'Sistem Approval pendaftaran warga baru & penyewa sebelum masuk ke database.',
      'Verifikasi dan terbitkan surat pengantar atau izin lingkungan secara digital.',
      'Kirim broadcast pengumuman resmi (kerja bakti, jadwal sampah, rapat) instan ke ponsel warga.',
      'Dual Mode: Pengurus yang juga penghuni dapat berganti peran hanya dengan 1 sentuhan.',
    ],
    highlight: 'Data warga komplek aman, tersinkronisasi offline-first, dan siap diakses kapan saja.'
  },
  {
    id: 'bendahara',
    title: 'Bendahara Komplek',
    icon: Wallet,
    tagline: 'Audit Finansial Akurat, Rekonsiliasi Otomatis',
    summary: 'Beban pencatatan pembukuan ratusan rumah berkurang drastis berkat rekonsiliasi mutasi otomatis.',
    points: [
      'Auto-matching mutasi bank via Moota tanpa perlu cek rekening koran manual.',
      'Buku kas otomatis bertambah saat pembayaran iuran terverifikasi.',
      'Kategorisasi pos pemasukan dan pos pengeluaran lingkungan teratur.',
      'Rekapitulasi laporan kas bulanan dengan format angka tabular rapi dan siap cetak.',
      'Audit log aktivitas keuangan lengkap untuk mencegah selisih pembukuan.',
    ],
    highlight: 'Tidak ada lagi stres pembukuan akhir bulan atau selisih nominal kas lingkungan.'
  },
  {
    id: 'admin-komplek',
    title: 'Admin Komplek & Multi-Tenant',
    icon: Building2,
    tagline: 'Tata Kelola Komplek Otonom & Fleksibel',
    summary: 'Setiap perumahan atau cluster memiliki kendali penuh atas konfigurasi dan struktur wilayahnya.',
    points: [
      'Setup master komplek, struktur RT/RW, dan daftar unit hunian mandiri.',
      'Atur pos iuran custom (keamanan, kebersihan, sosial, dana cadangan perbaikan fasum).',
      'Kelola rekening bank resmi komplek dan integrasi payment gateway.',
      'Fitur reset data komplek terisolasi tanpa mempengaruhi komplek/perumahan lain.',
      'Manajemen peran pengurus dan hak akses struktural secara terpusat.',
    ],
    highlight: 'Sistem multi-tenant menjamin privasi dan kemandirian penuh setiap kawasan perumahan.'
  },
  {
    id: 'satpam',
    title: 'Keamanan & Satpam',
    icon: Shield,
    tagline: 'Keamanan Lingkungan Siap Siaga',
    summary: 'Mendukung operasional pos jaga keamanan komplek dengan transparansi jadwal dan respon darurat cepat.',
    points: [
      'Jadwal shift piket ronda dan satpam terpampang transparan di aplikasi.',
      'Notifikasi alarm darurat real-time saat warga menekan tombol bantuan darurat.',
      'Verifikasi identitas tamu atau pekerja renovasi berdasarkan nomor blok & rumah.',
      'Daftar kontak darurat terpusat (pos satpam, kepolisian, damkar, ambulans).',
    ],
    highlight: 'Penghuni komplek tenang karena tim keamanan selalu tersambung secara digital 24 jam.'
  }
];

export default function RoleTabs() {
  const [activeRole, setActiveRole] = useState('warga');
  const currentRole = ROLES_DATA.find((r) => r.id === activeRole) || ROLES_DATA[0];
  const CurrentIcon = currentRole.icon;

  return (
    <section id="peran" className="py-16 sm:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-800 text-xs font-bold uppercase tracking-wider">
            Ekosistem Terintegrasi
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Satu Aplikasi, Seluruh Kebutuhan Lingkungan Terhubung
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            GLOSINDO IPL menyatukan seluruh elemen warga, pengurus klaster, ketua RT/RW, bendahara, admin komplek, dan pos keamanan dalam satu ekosistem multi-komplek yang harmonis.
          </p>
        </div>

        {/* Tab Buttons - Mobile horizontally scrollable with touch momentum */}
        <div className="mt-10 sm:mt-12 flex overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl max-w-4xl mx-auto border border-slate-200 scrollbar-none">
          {ROLES_DATA.map((role) => {
            const Icon = role.icon;
            const isSelected = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-brand-800 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-cyanAccent-300' : 'text-slate-500'}`} />
                <span>{role.title}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Box */}
        <div className="mt-8 sm:mt-10 max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-soft">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0">
                <CurrentIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {currentRole.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-700 font-semibold mt-0.5">
                  {currentRole.tagline}
                </p>
              </div>
            </div>
            <div className="text-xs bg-brand-50 text-brand-800 px-3 py-1 rounded-full font-bold border border-brand-200 self-start sm:self-auto">
              Peran Terverifikasi
            </div>
          </div>

          <p className="mt-6 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            {currentRole.summary}
          </p>

          {/* Points list */}
          <div className="mt-6 grid grid-cols-1 gap-3">
            {currentRole.points.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200">
                  <Check className="w-3.5 h-3.5 text-brand-700 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                  {pt}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Highlight */}
          <div className="mt-8 p-4 rounded-2xl bg-brand-950 text-white flex items-center gap-3 border border-brand-800/80">
            <div className="w-2 h-2 rounded-full bg-cyanAccent-400 shrink-0" />
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {currentRole.highlight}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
