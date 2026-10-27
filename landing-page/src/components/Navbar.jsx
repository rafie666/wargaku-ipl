import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Menu, X, ShieldCheck, ChevronRight } from 'lucide-react';

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
          : 'bg-emerald-950/80 backdrop-blur-sm border-b border-emerald-800/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <a href="#" className="flex flex-col group">
            <span className={`text-xl font-extrabold tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              Wargaku<span className="text-emerald-500">IPL</span>
            </span>
            <span className={`text-xs ${scrolled ? 'text-slate-500' : 'text-emerald-200/80'}`}>
              Sistem Resmi Warga & RT/RW
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#fitur"
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-slate-600 hover:text-emerald-600' : 'text-emerald-100/90 hover:text-white'
              }`}
            >
              Fitur Warga
            </a>
            <a
              href="#peran"
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-slate-600 hover:text-emerald-600' : 'text-emerald-100/90 hover:text-white'
              }`}
            >
              Keunggulan
            </a>
            <a
              href="#panduan"
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-slate-600 hover:text-emerald-600' : 'text-emerald-100/90 hover:text-white'
              }`}
            >
              Cara Pasang APK
            </a>
            <a
              href="#faq"
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-slate-600 hover:text-emerald-600' : 'text-emerald-100/90 hover:text-white'
              }`}
            >
              Tanya Jawab
            </a>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenQr}
              className={`text-xs font-semibold px-3.5 py-2 rounded-lg border transition-all flex items-center gap-1.5 ${
                scrolled
                  ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  : 'border-emerald-700 text-emerald-100 hover:bg-emerald-900/60'
              }`}
              title="Tampilkan QR code untuk scan di HP"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              Scan QR
            </button>

            <a
              href="/wargaku-ipl.apk"
              download="wargaku-ipl.apk"
              className="bg-limeAccent hover:bg-[#c2e22f] text-darkForest text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-darkForest" />
              Download APK
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href="/wargaku-ipl.apk"
              download="wargaku-ipl.apk"
              className="bg-limeAccent text-darkForest text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              APK
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${
                scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-emerald-900'
              }`}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-3">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 font-medium py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between"
            >
              <span>Fitur Warga</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#peran"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 font-medium py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between"
            >
              <span>Keunggulan & Peran</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#panduan"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 font-medium py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between"
            >
              <span>Panduan Pasang APK</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 font-medium py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between"
            >
              <span>Tanya Jawab (FAQ)</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="/wargaku-ipl.apk"
                download="wargaku-ipl.apk"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                Unduh APK Android
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQr();
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl text-center flex items-center justify-center gap-2 text-sm"
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                Buka Scan QR Ponsel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
