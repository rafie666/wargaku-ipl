import React from 'react';
import { Download, FolderDown, ShieldAlert, CheckCircle2, Smartphone, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    step: '1',
    title: 'Unduh File APK',
    desc: 'Tekan tombol "Download APK" di website ini. Tunggu hingga proses unduhan file wargaku-ipl-v2.0.0.apk (~28 MB) selesai.',
    icon: Download,
    tip: 'Penyimpanan ponsel Anda hanya membutuhkan ruang sekitar ~60 MB.',
  },
  {
    step: '2',
    title: 'Buka File Unduhan',
    desc: 'Buka panel notifikasi HP Anda lalu ketuk file yang baru diunduh, atau temukan file di aplikasi File Saya / Pengelola File > Unduhan (Downloads).',
    icon: FolderDown,
    tip: 'Nama file: wargaku-ipl-v2.0.0.apk',
  },
  {
    step: '3',
    title: 'Izinkan Instalasi dari Sumber Ini',
    desc: 'Jika muncul pesan keamanan Android "Untuk keamanan ponsel Anda...", ketuk Setelan (Settings) lalu aktifkan sakelar "Izinkan dari sumber ini".',
    icon: ShieldAlert,
    tip: 'Ini adalah dialog keamanan standar Android untuk aplikasi mandiri resmi.',
  },
  {
    step: '4',
    title: 'Selesai & Mulai Gunakan',
    desc: 'Tekan "Instal" lalu tunggu beberapa detik hingga selesai. Buka Wargaku IPL dan masuk menggunakan akun yang telah disiapkan RT Anda.',
    icon: CheckCircle2,
    tip: 'Belum punya akun? Cukup hubungi pengurus RT Anda.',
  },
];

export default function InstallGuide() {
  return (
    <section id="panduan" className="py-20 bg-slate-50 relative border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Panduan Warga
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cara Mudah Pasang Aplikasi di HP Android Anda
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Hanya butuh waktu kurang dari 2 menit. Ikuti 4 langkah sederhana berikut untuk memasang aplikasi Wargaku IPL di perangkat Anda:
          </p>
        </div>

        {/* 4 Step Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 hover:shadow-elevated transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                      {s.step}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
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
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{s.tip}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Reassurance Box */}
        <div className="mt-12 bg-emerald-50 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-9 h-9 text-limeAccent" />
          </div>
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-slate-900">
              Apakah Aplikasi Ini Aman Dipasang?
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>100% Aman.</strong> Wargaku IPL dikompilasi secara resmi oleh tim pengembang lingkungan warga dan didistribusikan langsung demi kecepatan pembaruan fitur tanpa perantara. Aplikasi ini bebas dari iklan tersembunyi, tidak mengakses data pribadi di luar izin fungsi lingkungan, dan teruji di Android 7.0 hingga Android 15.
            </p>
          </div>
          <a
            href="/wargaku-ipl-v2.0.0.apk"
            download="wargaku-ipl-v2.0.0.apk"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-6 py-3 rounded-xl shadow transition-all shrink-0 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Mulai Unduh Sekarang</span>
          </a>
        </div>

      </div>
    </section>
  );
}
