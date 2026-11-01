import React from 'react';
import { Download, ShieldCheck, Heart, QrCode, Sparkles, CheckCircle2, Code2, Terminal } from 'lucide-react';

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

        {/* Main Content: Brand & Developer Attribution */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800/80 items-center">
          
          {/* Brand Info & Mission (Col 1-7) */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Logo IPL WARGA" 
                className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30 shadow-sm"
              />
              <div>
                <span className="text-2xl font-black text-white tracking-tight leading-none">
                  IPL<span className="text-emerald-500">WARGA</span>
                </span>
                <p className="text-xs text-emerald-400 font-medium mt-0.5">
                  Platform Multi-Komplek & Manajemen Iuran Lingkungan
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Platform mandiri untuk tata kelola iuran lingkungan (IPL), kas terbuka, kartu identitas virtual warga, dan administrasi perumahan, klaster, serta RT/RW se-Indonesia tanpa birokrasi berbelit.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bebas Iklan & Open Multi-Tenant</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-limeAccent" />
                <span>Transparansi Kas 100% Real-Time</span>
              </div>
            </div>
          </div>

          {/* Developer Attribution Card (Col 8-12) */}
          <div className="md:col-span-5 flex justify-start md:justify-end">
            <div className="w-full sm:w-auto p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-emerald-950/40 border border-slate-800 hover:border-emerald-500/30 transition-all shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Terminal className="w-5 h-5 text-limeAccent" />
                </div>
                <div>
                  <div className="text-[10px] tracking-widest uppercase font-bold text-slate-400 flex items-center gap-1.5">
                    <Code2 className="w-3 h-3 text-emerald-400" />
                    <span>Lead Developer</span>
                  </div>
                  <div className="text-lg font-black text-white tracking-wide">
                    adly
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed max-w-xs">
                Dirancang dan dibangun independen untuk mendemokratisasi digitalisasi tata kelola perumahan dan RT/RW di seluruh Indonesia.
              </p>
            </div>
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
            <span>Dikembangkan dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>oleh <strong className="text-white font-semibold">adly</strong> untuk kerukunan warga.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
