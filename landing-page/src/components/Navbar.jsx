import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Menu, X, ChevronRight, Globe, ExternalLink } from 'lucide-react';

export default function Navbar({ onOpenQr }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-brand-950/90 backdrop-blur-md border-b border-brand-800/40 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
            <img 
              src="/logo.png" 
              alt="Logo Glosindo IPL" 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain shadow-sm border border-slate-200/30 group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col">
              <span className={`text-lg sm:text-xl font-extrabold tracking-tight leading-none ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                GLOSINDO <span className="text-cyanAccent-500">IPL</span>
              </span>
              <span className={`text-[10px] tracking-wide font-medium mt-0.5 ${scrolled ? 'text-slate-500' : 'text-brand-200/90'}`}>
                Global Media Pratama Solusindo
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7 lg:gap-8">
            <a
              href="#fitur"
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-slate-600 hover:text-brand-600' : 'text-slate-200 hover:text-white'
              }`}
            >
              Fitur Warga
            </a>
            <a
              href="#peran"
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-slate-600 hover:text-brand-600' : 'text-slate-200 hover:text-white'
              }`}
            >
              Keunggulan
            </a>
            <a
              href="#panduan"
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-slate-600 hover:text-brand-600' : 'text-slate-200 hover:text-white'
              }`}
            >
              Cara Pasang APK
            </a>
            <a
              href="#faq"
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-slate-600 hover:text-brand-600' : 'text-slate-200 hover:text-white'
              }`}
            >
              Tanya Jawab
            </a>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href="/app/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                scrolled
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  : 'bg-brand-900/80 hover:bg-brand-800 text-white border border-brand-700/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-cyanAccent-400" />
              <span>Demo Web</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              onClick={onOpenQr}
              className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                scrolled
                  ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  : 'border-brand-700 text-brand-100 hover:bg-brand-900/60'
              }`}
              title="Tampilkan QR code untuk scan di HP"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyanAccent-400" />
              Scan QR
            </button>

            <a
              href="/wargaku-ipl.apk"
              download="wargaku-ipl.apk"
              className="bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              Download APK
            </a>
          </div>

          {/* Mobile Actions & Menu Toggle */}
          <div className="md:hidden flex items-center gap-1.5 sm:gap-2">
            <a
              href="/app/"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-brand-700 text-white bg-brand-900/80 hover:bg-brand-800 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
            >
              <Globe className="w-3 h-3 text-cyanAccent-400" />
              <span>Demo</span>
            </a>

            <a
              href="/wargaku-ipl.apk"
              download="wargaku-ipl.apk"
              className="bg-brand-600 active:bg-brand-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              APK
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-brand-900'
              }`}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-1.5">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 font-medium py-2.5 px-3 rounded-xl hover:bg-brand-50 hover:text-brand-700 flex items-center justify-between"
            >
              <span>Fitur Warga</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#peran"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 font-medium py-2.5 px-3 rounded-xl hover:bg-brand-50 hover:text-brand-700 flex items-center justify-between"
            >
              <span>Keunggulan & Peran</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#panduan"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 font-medium py-2.5 px-3 rounded-xl hover:bg-brand-50 hover:text-brand-700 flex items-center justify-between"
            >
              <span>Panduan Pasang APK</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 font-medium py-2.5 px-3 rounded-xl hover:bg-brand-50 hover:text-brand-700 flex items-center justify-between"
            >
              <span>Tanya Jawab (FAQ)</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>

            <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="/app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-center flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                <Globe className="w-4 h-4 text-cyanAccent-400" />
                <span>Coba Demo Web</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="/wargaku-ipl.apk"
                download="wargaku-ipl.apk"
                className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold py-3.5 rounded-xl text-center flex items-center justify-center gap-2 shadow-sm text-sm"
              >
                <Download className="w-4 h-4 text-white" />
                Unduh APK Android
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQr();
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl text-center flex items-center justify-center gap-2 text-sm"
              >
                <Smartphone className="w-4 h-4 text-brand-600" />
                Buka Scan QR Ponsel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
