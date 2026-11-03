import React from 'react';
import { Download, FolderDown, ShieldAlert, CheckCircle2, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    step: '1',
    title: 'Unduh File APK',
    desc: 'Tekan tombol "Download APK" di website ini. Tunggu hingga proses unduhan file wargaku-ipl.apk (~47.4 MB) selesai.',
    icon: Download,
    tip: 'Penyimpanan ponsel Anda hanya membutuhkan ruang sekitar ~60 MB.',
  },
  {
    step: '2',
    title: 'Buka File Unduhan',
    desc: 'Buka panel notifikasi HP Anda lalu ketuk file yang baru diunduh, atau temukan file di aplikasi File Saya / Pengelola File > Unduhan (Downloads).',
    icon: FolderDown,
    tip: 'Nama file paket: wargaku-ipl.apk',
  },
  {
    step: '3',
    title: 'Izinkan Sumber Ini',
    desc: 'Jika muncul dialog keamanan standar Android "Untuk keamanan ponsel Anda...", ketuk Setelan (Settings) lalu aktifkan sakelar "Izinkan dari sumber ini".',
    icon: ShieldAlert,
    tip: 'Ini adalah dialog verifikasi izin instalasi mandiri resmi di Android.',
  },
  {
    step: '4',
    title: 'Selesai & Mulai Gunakan',
    desc: 'Tekan "Instal" lalu tunggu beberapa detik hingga selesai. Buka GLOSINDO IPL dan masuk menggunakan akun atau daftarkan komplek Anda.',
    icon: CheckCircle2,
    tip: 'Dapat digunakan untuk berbagai komplek dan perumahan di Indonesia.',
  },
];

export default function InstallGuide() {
  return (
    <section id="panduan" className="py-16 sm:py-20 bg-slate-50 relative border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-800 text-xs font-bold uppercase tracking-wider">
            Panduan Warga
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cara Mudah Pasang Aplikasi di HP Android Anda
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Hanya butuh waktu kurang dari 2 menit. Ikuti 4 langkah sederhana berikut untuk memasang aplikasi GLOSINDO IPL di perangkat Anda:
          </p>
        </div>

        {/* 4 Step Cards */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-soft border border-slate-200/80 hover:shadow-elevated transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                      {s.step}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {s.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {s.desc}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-150 text-[11px] text-slate-500 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" />
                  <span>{s.tip}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Reassurance Box */}
        <div className="mt-12 bg-white border border-brand-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-soft">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-700 text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9 text-cyanAccent-300" />
          </div>
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Apakah Aplikasi Ini Aman Dipasang?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>100% Aman & Terverifikasi.</strong> GLOSINDO IPL dikembangkan dan dirilis resmi oleh PT Global Media Pratama Solusindo untuk tata kelola lingkungan terpercaya. Aplikasi ini bebas dari iklan tersembunyi, tidak mengakses data pribadi di luar izin fungsi lingkungan, dan teruji stabil di Android 7.0 hingga Android 15.
            </p>
          </div>
          <a
            href="/wargaku-ipl.apk"
            download="wargaku-ipl.apk"
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-sm transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Mulai Unduh APK</span>
          </a>
        </div>

      </div>
    </section>
  );
}
