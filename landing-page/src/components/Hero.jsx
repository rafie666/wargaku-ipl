import React from 'react';
import { Download, Smartphone, ShieldCheck, CheckCircle2, ArrowDown, Globe, ExternalLink } from 'lucide-react';
import AppMockup from './AppMockup';
import glosindoLogo from '../assets/logo-glosindo.png';

export default function Hero({ onOpenQr }) {
  return (
    <section className="relative pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-brand-950 via-brand-900 to-slate-900 text-white">
      {/* Background subtle mesh texture */}
      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyanAccent-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Download CTA */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6">
            
            {/* Glosindo Official Brand Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0">
                <img src={glosindoLogo} alt="Logo Glosindo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-wide">PT GLOBAL MEDIA PRATAMA SOLUSINDO</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.18]">
              Satu Aplikasi IPL untuk <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyanAccent-400 to-white">
                Semua Komplek & Lingkungan
              </span>{' '}
              <br className="hidden sm:inline" />
              Warga di Indonesia.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-200/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Kelola iuran lingkungan (IPL) otomatis, transparansi arus kas terbuka, auto-verifikasi mutasi bank, kartu digital penghuni, dan koordinasi keamanan satpam terpadu resmi dari <strong className="text-white font-semibold">GLOSINDO</strong>.
            </p>

            {/* Download & Demo CTA Group - Fully Touch & Mobile Ready */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
              <a
                href="/wargaku-ipl.apk"
                download="wargaku-ipl.apk"
                className="bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-elevated transition-all flex items-center justify-center gap-3 text-base group active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider">Unduh Sekarang</div>
                  <div className="text-sm sm:text-base font-black leading-none">Download APK (47.4 MB)</div>
                </div>
              </a>

              <a
                href="/app/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-900/90 hover:bg-brand-800 text-white font-bold px-5 py-3.5 rounded-2xl border border-brand-700/60 backdrop-blur-md transition-all flex items-center justify-center gap-2 text-sm shadow-sm active:scale-[0.98]"
              >
                <Globe className="w-4 h-4 text-cyanAccent-400" />
                <span>Coba Demo Web</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
              </a>

              <button
                onClick={onOpenQr}
                className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold px-4 py-3.5 rounded-2xl border border-slate-700/60 backdrop-blur-md transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
              >
                <Smartphone className="w-4 h-4 text-cyanAccent-400" />
                <span>Scan QR</span>
              </button>
            </div>

            {/* Spec & Security badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs text-brand-200/90 pt-1">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyanAccent-400" /> Ukuran: ~47.4 MB
              </span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyanAccent-400" /> Multi-Tenant Multi-Komplek
              </span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="text-slate-300">Android 7.0+ & Web PWA</span>
            </div>

            {/* Quick Benefits Bullet List */}
            <div className="pt-4 border-t border-brand-800/60 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs text-slate-200">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <CheckCircle2 className="w-4 h-4 text-cyanAccent-400 shrink-0" />
                <span>Auto-Mutasi Bank Moota</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <CheckCircle2 className="w-4 h-4 text-cyanAccent-400 shrink-0" />
                <span>Approval Warga Bertingkat</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <CheckCircle2 className="w-4 h-4 text-cyanAccent-400 shrink-0" />
                <span>Transparansi Kas 100% Riil</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center items-center mt-4 lg:mt-0">
            <AppMockup />
          </div>

        </div>

        {/* Scroll down indicator */}
        <div className="mt-12 hidden md:flex justify-center">
          <a
            href="#fitur"
            className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors bg-brand-900/60 hover:bg-brand-900 px-4 py-2 rounded-full border border-brand-700/60 backdrop-blur-sm"
          >
            <span>Jelajahi Fitur Lengkap Aplikasi</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
