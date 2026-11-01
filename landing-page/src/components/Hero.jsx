import React from 'react';
import { Download, Smartphone, ShieldCheck, CheckCircle2, ArrowDown, Sparkles, Globe, ExternalLink } from 'lucide-react';
import AppMockup from './AppMockup';

export default function Hero({ onOpenQr }) {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a7f3d0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-limeAccent/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Download CTA */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/90 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm font-medium backdrop-blur-sm shadow-inner">
              <span className="w-2 h-2 rounded-full bg-limeAccent animate-pulse" />
              <span>Multi-Tenant • Auto-Mutasi Moota • Peta Warga Interaktif</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Satu Aplikasi IPL untuk <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-limeAccent to-emerald-200">
                Semua Komplek & Lingkungan
              </span>{' '}
              <br className="hidden sm:inline" />
              Warga di Indonesia.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Kelola iuran lingkungan (IPL) otomatis, transparansi arus kas terbuka, auto-verifikasi mutasi bank, kartu digital penghuni, dan koordinasi keamanan satpam terpadu.
            </p>

            {/* Download & Demo CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <a
                href="/wargaku-ipl.apk"
                download="wargaku-ipl.apk"
                className="w-full sm:w-auto bg-limeAccent hover:bg-[#c4e62a] active:scale-95 text-darkForest font-extrabold px-6 py-3.5 rounded-2xl shadow-elevated transition-all flex items-center justify-center gap-3 text-base group"
              >
                <div className="w-8 h-8 rounded-xl bg-darkForest/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download className="w-5 h-5 text-darkForest" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-semibold text-darkForest/80 uppercase tracking-wider">Unduh Sekarang</div>
                  <div className="text-sm sm:text-base font-black leading-none">Download APK (v2.0)</div>
                </div>
              </a>

              <a
                href="https://warga.glosindo.net.id"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold px-5 py-3.5 rounded-2xl border border-emerald-500/40 backdrop-blur-md transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                <Globe className="w-4 h-4 text-limeAccent" />
                <span>Coba Demo Web</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
              </a>

              <button
                onClick={onOpenQr}
                className="w-full sm:w-auto bg-emerald-950/70 hover:bg-emerald-900 text-emerald-100 font-semibold px-4 py-3.5 rounded-2xl border border-emerald-700/40 backdrop-blur-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Scan QR</span>
              </button>
            </div>

            {/* Spec & Security badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-emerald-200/80 pt-1">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Ukuran: ~47.4 MB
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-limeAccent" /> Multi-Tenant Multi-Komplek
              </span>
              <span className="hidden sm:inline">•</span>
              <span>Android 7.0+ & Web PWA</span>
            </div>

            {/* Quick Benefits Bullet List */}
            <div className="pt-4 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-limeAccent shrink-0" />
                <span>Auto-Mutasi Bank Moota</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-limeAccent shrink-0" />
                <span>Approval Warga Bertingkat</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-limeAccent shrink-0" />
                <span>Transparansi Kas 100% Riil</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <AppMockup />
          </div>

        </div>

        {/* Scroll down indicator */}
        <div className="mt-14 hidden md:flex justify-center">
          <a
            href="#fitur"
            className="flex items-center gap-2 text-xs font-medium text-emerald-300/80 hover:text-white transition-colors bg-emerald-900/40 hover:bg-emerald-900/80 px-4 py-2 rounded-full border border-emerald-800/60 backdrop-blur-sm"
          >
            <span>Jelajahi Fitur Lengkap Aplikasi</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>

      </div>
    </section>
  );
}
