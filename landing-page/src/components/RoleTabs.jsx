import React, { useState } from 'react';
import { Users, UserCheck, Shield, Wallet, Check, Sparkles, Building, ChevronRight } from 'lucide-react';

const ROLES_DATA = [
  {
    id: 'warga',
    title: 'Untuk Warga Lingkungan',
    icon: Users,
    tagline: 'Praktis, Mandiri, & Selalu Terinformasi',
    summary: 'Warga tidak perlu lagi menunggu didatangi petugas penagih atau bingung mencari kuitansi kertas yang hilang.',
    points: [
      'Cek tagihan IPL bulanan kapan saja dari smartphone.',
      'Bayar instan via QRIS semua bank & dompet digital (GoPay, OVO, Dana, ShopeePay).',
      'Unduh e-kuitansi sah resmi bernomor seri unik sebagai bukti pembayaran.',
      'Kartu Identitas Digital Penghuni lengkap dengan unit rumah Blok / No.',
      'Akses tombol darurat untuk meminta pertolongan darurat pos satpam.',
    ],
    highlight: 'Warga dapat melihat ringkasan kas RT secara transparan demi akuntabilitas bersama.'
  },
  {
    id: 'rt-rw',
    title: 'Untuk Ketua RT & RW',
    icon: UserCheck,
    tagline: 'Administrasi Rapi, Pantauan Wilayah Satu Dasbor',
    summary: 'Ketua RT dan RW memiliki akses khusus untuk memantau status iuran per blok rumah dan menyetujui administrasi warga.',
    points: [
      'Peta visual status iuran warga (Lunas vs Belum Lunas) per blok.',
      'Verifikasi dan terbitkan surat pengantar RT/RW secara digital.',
      'Kirim pengumuman resmi (kerja bakti, fogging, rapat) langsung ke ponsel warga.',
      'Manajemen data kependudukan dan status hunian (Tetap, Kontrak, Kosong).',
      'Dual Mode: Pengurus yang juga warga dapat beralih peran dengan 1 klik.',
    ],
    highlight: 'Data kependudukan wilayah aman, terpusat, dan mudah direkap saat dibutuhkan kelurahan.'
  },
  {
    id: 'bendahara',
    title: 'Untuk Bendahara',
    icon: Wallet,
    tagline: 'Audit Finansial Akurat, Rekonsiliasi Otomatis',
    summary: 'Beban pencatatan pembukuan manual ratusan warga berkurang drastis dengan sistem pencatatan otomatis.',
    points: [
      'Verifikasi bukti transfer bank warga dengan cepat.',
      'Buku kas otomatis terisi saat pembayaran terkonfirmasi.',
      'Kategorisasi pos pemasukan dan pos pengeluaran lingkungan teratur.',
      'Rekapitulasi laporan kas bulanan siap cetak dalam hitungan detik.',
      'Audit log aktivitas finansial untuk mencegah selisih pembukuan.',
    ],
    highlight: 'Tidak ada lagi stres pembukuan akhir bulan atau selisih nominal kas RT/RW.'
  },
  {
    id: 'satpam',
    title: 'Keamanan & Satpam',
    icon: Shield,
    tagline: 'Keamanan Lingkungan Lebih Siap Siaga',
    summary: 'Mendukung operasional pos jaga keamanan lingkungan dengan transparansi jadwal dan respon darurat cepat.',
    points: [
      'Jadwal piket ronda & shift satpam terjadwal jelas di aplikasi.',
      'Notifikasi alarm darurat saat warga menekan tombol bantuan darurat.',
      'Verifikasi identitas tamu atau pekerja renovasi melalui nomor unit rumah.',
      'Daftar kontak darurat ambulans, polsek, dan damkar terdekat.',
    ],
    highlight: 'Warga merasa tenang karena tim keamanan selalu terhubung secara digital 24 jam.'
  }
];

export default function RoleTabs() {
  const [activeRole, setActiveRole] = useState('warga');
  const currentRole = ROLES_DATA.find((r) => r.id === activeRole) || ROLES_DATA[0];

  return (
    <section id="peran" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Ekosistem Terintegrasi
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Satu Aplikasi, Seluruh Kebutuhan Lingkungan Terhubung
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Wargaku IPL menyatukan seluruh elemen warga, perangkat RT, RW, bendahara, dan petugas keamanan dalam satu sistem yang harmonis.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-2 sm:gap-4 p-1.5 bg-slate-100/90 rounded-2xl max-w-3xl mx-auto border border-slate-200">
          {ROLES_DATA.map((role) => {
            const Icon = role.icon;
            const isSelected = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-limeAccent' : 'text-slate-500'}`} />
                <span>{role.title.replace('Untuk ', '')}</span>
              </button>
            );
          })}
        </div>

        {/* Role Content Card */}
        <div className="mt-8 bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-3xl p-6 sm:p-10 border border-emerald-100/80 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{currentRole.tagline}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {currentRole.title}
              </h3>

              <p className="text-base text-slate-600 leading-relaxed">
                {currentRole.summary}
              </p>

              {/* Points */}
              <div className="space-y-3 pt-2">
                {currentRole.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Highlight Card */}
            <div className="lg:col-span-5">
              <div className="bg-emerald-900 text-white rounded-3xl p-7 shadow-elevated border border-emerald-700/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-limeAccent/15 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-800 border border-emerald-600/50 flex items-center justify-center text-limeAccent shadow-inner">
                    <currentRole.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{currentRole.title}</h4>
                    <span className="text-xs text-emerald-300">Akses Terotorisasi & Teruji</span>
                  </div>
                </div>

                <div className="bg-emerald-950/80 rounded-2xl p-4 border border-emerald-800/80 my-4 text-xs text-emerald-100 leading-relaxed">
                  <span className="font-bold text-limeAccent">Nilai Utama:</span> {currentRole.highlight}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-emerald-300">
                  <span>Keamanan Data Berbasis Peran</span>
                  <span className="font-mono text-limeAccent font-semibold">100% Terenkripsi</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
