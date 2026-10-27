import React from 'react';
import { Download, ShieldCheck, Heart, MapPin, Mail, Phone, QrCode, ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function Footer({ onOpenQr }) {
  return (
    <footer className="relative bg-slate-950 text-slate-400 text-sm border-t border-slate-800/80 overflow-hidden">
      {/* Decorative ambient subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent pointer-events-none" />
      <div className="absolute -top-24 left-1/4 w-96 h-48 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        
        {/* Top Trust Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/40 border border-emerald-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 shadow-inner">
              <Sparkles className="w-6 h-6 text-limeAccent" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Mulai Tata Kelola Lingkungan yang Guyub & Transparan
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Semua data iuran, buku kas, dan pengumuman warga tercatat rapi dalam genggaman.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/wargaku-ipl.apk"
              download="wargaku-ipl.apk"
              className="bg-limeAccent hover:bg-[#c2e22f] active:scale-95 text-darkForest text-xs font-black px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-darkForest" />
              <span>Download APK</span>
            </a>
            <button
              onClick={onOpenQr}
              className="bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Scan QR</span>
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info & Mission (Col 1-5) */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-2xl font-black text-white tracking-tight">
                Wargaku<span className="text-emerald-500">IPL</span>
              </span>
              <p className="text-xs text-emerald-400 font-medium mt-1">
                Sistem Informasi & Tata Kelola Iuran Lingkungan
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Platform digital mandiri untuk pencatatan iuran warga, transparansi kas RT/RW terbuka, kartu identitas virtual penghuni, serta layanan administrasi rukun tetangga tanpa birokrasi berbelit.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bebas Iklan & Terverifikasi</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-limeAccent" />
                <span>Transparansi Kas 100%</span>
              </div>
            </div>
          </div>

          {/* Navigation Links (Col 6-7) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#fitur" className="hover:text-emerald-400 transition-colors flex items-center justify-between group">
                  <span>Fitur Utama</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </a>
              </li>
              <li>
                <a href="#peran" className="hover:text-emerald-400 transition-colors flex items-center justify-between group">
                  <span>Peran Pengurus</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </a>
              </li>
              <li>
                <a href="#panduan" className="hover:text-emerald-400 transition-colors flex items-center justify-between group">
                  <span>Panduan Pasang</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors flex items-center justify-between group">
                  <span>Tanya Jawab (FAQ)</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </a>
              </li>
            </ul>
          </div>

          {/* App Specs (Col 8-9) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Aplikasi Android
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Paket Pemasangan</span>
                <span className="text-slate-300 font-mono">wargaku-ipl.apk</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Ukuran Berkas</span>
                <span className="text-slate-300 font-mono">~28.4 MB</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Kompatibilitas</span>
                <span className="text-slate-300">Android 7.0 (Nougat)+</span>
              </div>
            </div>
          </div>

          {/* Contact & Secretariat (Col 10-12) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Sekretariat & Bantuan
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">Pos Keamanan & Balai Warga RT 01 - 05 / RW 08</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hotline Pengurus Lingkungan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-slate-300">sekretariat@wargaku-ipl.local</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Sistem Operasional Normal</span>
            <span>•</span>
            <span>© 2026 Wargaku IPL</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Dikelola bersama dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>untuk kerukunan warga.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
