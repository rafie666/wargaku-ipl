import React from 'react';
import { 
  Building2, 
  RefreshCw, 
  UserCheck, 
  MapPin, 
  Eye, 
  ShieldAlert, 
  CheckCircle 
} from 'lucide-react';

const FEATURE_LIST = [
  {
    id: 'multi-komplek',
    icon: Building2,
    iconBg: 'bg-brand-50 text-brand-700 border-brand-200',
    title: 'Multi-Tenant Komplek Seluruh Indonesia',
    desc: 'Setiap perumahan, klaster, apartemen, atau RT/RW memiliki database terisolasi aman. Pengurus komplek dapat mengelola pos iuran, rekening bank, dan struktur RT/RW sendiri secara mandiri.',
    badge: 'Multi-Tenant Mandiri',
  },
  {
    id: 'moota-payment',
    icon: RefreshCw,
    iconBg: 'bg-cyanAccent-50 text-cyanAccent-600 border-cyanAccent-200',
    title: 'Auto-Verifikasi Mutasi Bank & QRIS',
    desc: 'Terintegrasi langsung dengan payment gateway & Moota. Bukti transfer bank dan QRIS dicek otomatis secara real-time—tanpa bendahara harus mengecek mutasi m-banking manual satu per satu.',
    badge: 'Auto-Check Moota',
  },
  {
    id: 'approval-warga',
    icon: UserCheck,
    iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    title: 'Registrasi Mandiri & Sistem Approval',
    desc: 'Warga baru atau penyewa kontrakan dapat mendaftar mandiri lewat ponsel. Akun otomatis masuk antrean verifikasi pengurus RT/RW sebelum memperoleh akses data komplek.',
    badge: 'Verifikasi Bertingkat',
  },
  {
    id: 'peta-warga',
    icon: MapPin,
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Peta Warga & Status Unit Interaktif',
    desc: 'Visualisasi denah blok rumah secara interaktif. Ketahui status kepemilikan (Pemilik vs Penyewa, Dihuni vs Kosong) serta filter instan siapa yang sudah lunas dan menunggak iuran.',
    badge: 'Peta Spasial Blok',
  },
  {
    id: 'transparency',
    icon: Eye,
    iconBg: 'bg-sky-50 text-sky-700 border-sky-200',
    title: 'Transparansi Kas Lingkungan 100% Riil',
    desc: 'Semua pemasukan iuran sampah, keamanan, dan perbaikan fasum tercatat di buku kas terbuka. Laporan keuangan disajikan dengan angka tabular rapi dan dapat diunduh kapan saja oleh warga.',
    badge: 'Kas Terbuka',
  },
  {
    id: 'virtual-id-darurat',
    icon: ShieldAlert,
    iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
    title: 'Kartu Digital Warga & Respon Darurat',
    desc: 'ID digital penghuni berformat standar blok/unit untuk akses tamu dan pos satpam. Dilengkapi panic button darurat terhubung langsung ke ponsel petugas jaga 24 jam.',
    badge: 'Respon Cepat 24 Jam',
  },
];

export default function Features() {
  return (
    <section id="fitur" className="py-16 sm:py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-800 text-xs font-bold uppercase tracking-wider">
            Fitur Generasi Baru Terpadu
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tata Kelola Lingkungan Modern, Otonom, & Transparan
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            GLOSINDO IPL hadir dengan arsitektur multi-tenant, verifikasi mutasi bank otomatis, dan pemetaan hunian digital untuk kebutuhan nyata perumahan dan RT/RW Indonesia.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURE_LIST.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={feat.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-soft border border-slate-200/80 hover:shadow-elevated hover:border-brand-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs group-hover:scale-105 transition-transform ${feat.iconBg}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-700 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-brand-700">
                  <CheckCircle className="w-4 h-4 text-brand-600" />
                  <span>Fitur Aktif di Aplikasi</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
