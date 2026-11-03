import React from 'react';
import { Download, ShieldCheck, Heart, QrCode, Sparkles, CheckCircle2, Globe, ExternalLink, Building } from 'lucide-react';
import glosindoLogo from '../assets/logo-glosindo.png';

export default function Footer({ onOpenQr }) {
  return (
    <footer className="relative bg-slate-950 text-slate-400 text-sm border-t border-slate-800/80 overflow-hidden">
      {/* Decorative ambient subtle line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-12 relative z-10">
        
        {/* Top Trust Banner */}
        <div className="mb-12 sm:mb-14 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-brand-950/80 via-slate-900 to-brand-950/50 border border-brand-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-brand-900/60 border border-brand-700/50 flex items-center justify-center shrink-0 text-cyanAccent-400 shadow-inner">
              <Sparkles className="w-6 h-6 text-cyanAccent-400" />
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

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="/app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-900/90 hover:bg-brand-800 text-white text-xs font-bold px-4 py-3 rounded-xl border border-brand-700/50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Globe className="w-4 h-4 text-cyanAccent-400" />
              <span>Demo Web</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="/wargaku-ipl.apk"
              download="wargaku-ipl.apk"
              className="bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-black px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download APK</span>
            </a>
            <button
              onClick={onOpenQr}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <QrCode className="w-4 h-4 text-cyanAccent-400" />
              <span>Scan QR</span>
            </button>
          </div>
        </div>

        {/* Main Content: Brand & Organization Attribution */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800/80 items-center">
          
          {/* Brand Info & Mission (Col 1-7) */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-sm border border-slate-700 flex items-center justify-center shrink-0">
                <img 
                  src={glosindoLogo} 
                  alt="Logo Glosindo IPL" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight leading-none">
                  GLOSINDO <span className="text-cyanAccent-400">IPL</span>
                </span>
                <p className="text-xs text-blue-300 font-medium mt-0.5">
                  PT Global Media Pratama Solusindo
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Platform mandiri untuk tata kelola iuran lingkungan (IPL), kas terbuka, kartu identitas virtual warga, dan administrasi perumahan, klaster, serta RT/RW se-Indonesia tanpa birokrasi berbelit.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-cyanAccent-400" />
                <span>Bebas Iklan & Multi-Tenant Terisolasi</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyanAccent-400" />
                <span>Transparansi Kas 100% Real-Time</span>
              </div>
            </div>
          </div>

          {/* Publisher / Company Attribution Card (Col 8-12) */}
          <div className="md:col-span-5 flex justify-start md:justify-end">
            <div className="w-full sm:w-auto p-5 rounded-2xl bg-gradient-to-br from-slate-900/95 to-brand-950/50 border border-slate-800 hover:border-brand-700/50 transition-all shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-cyanAccent-400 shrink-0">
                  <Building className="w-5 h-5 text-cyanAccent-400" />
                </div>
                <div>
                  <div className="text-[10px] tracking-widest uppercase font-bold text-slate-400 flex items-center gap-1.5">
                    <span>Pengembang & Penyedia</span>
                  </div>
                  <div className="text-base font-black text-white tracking-wide">
                    PT Global Media Pratama Solusindo
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed max-w-xs">
                Mendemokratisasi digitalisasi tata kelola perumahan dan RT/RW di seluruh Indonesia secara aman, andal, dan berkelanjutan.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyanAccent-400" />
            <span className="text-slate-400">Sistem Operasional Normal</span>
            <span>•</span>
            <span>© 2026 PT Global Media Pratama Solusindo (GLOSINDO)</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Dikembangkan untuk kemakmuran & kerukunan warga Indonesia.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
