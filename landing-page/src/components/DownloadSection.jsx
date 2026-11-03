import React, { useState } from 'react';
import { Download, Smartphone, QrCode, ShieldCheck, Check, Copy, ExternalLink } from 'lucide-react';
import glosindoLogo from '../assets/logo-glosindo.png';

export default function DownloadSection({ onOpenQr }) {
  const [copiedSha, setCopiedSha] = useState(false);
  const sampleSha = '4b0e46396a148fa16c5cda714fcf810f2b65d6769c29a8f3fe737eea5b099590';

  const copyChecksum = () => {
    navigator.clipboard.writeText(sampleSha);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2500);
  };

  return (
    <section id="unduh" className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative ambient subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-gradient-to-r from-brand-600/15 via-cyanAccent-500/15 to-brand-900/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-slate-950 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14 border border-brand-700/50 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-900/90 border border-brand-700/60 text-cyanAccent-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-cyanAccent-400" />
                <span>Rilis Resmi Android • Glosindo Ecosystem</span>
              </div>

              <div className="flex items-center gap-3.5 sm:gap-4 justify-center lg:justify-start">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-1.5 shadow-lg border border-brand-600/40 flex items-center justify-center shrink-0">
                  <img 
                    src={glosindoLogo} 
                    alt="Logo Glosindo IPL" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                    GLOSINDO IPL
                  </h2>
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyanAccent-300 to-white text-base sm:text-xl font-bold">
                    Aplikasi Resmi PT Global Media Pratama Solusindo
                  </div>
                </div>
              </div>

              <p className="text-slate-200/90 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Bergabunglah dengan pengurus dan warga dari berbagai komplek di seluruh Indonesia yang telah beralih ke pengelolaan lingkungan mandiri yang praktis, aman, dan 100% transparan bersama Global Media Pratama Solusindo.
              </p>

              {/* Big Download Button - Responsive Stack on Mobile */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="/wargaku-ipl.apk"
                  download="wargaku-ipl.apk"
                  className="bg-brand-600 hover:bg-brand-700 active:bg-brand-800 active:scale-[0.98] text-white font-black px-7 py-3.5 rounded-2xl shadow-elevated transition-all flex items-center justify-center gap-3 text-base group"
                >
                  <Download className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  <span>Download APK (47.4 MB)</span>
                </a>

                <a
                  href="/app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-900/80 hover:bg-brand-800 text-white font-bold px-5 py-3.5 rounded-2xl border border-brand-700/50 transition-all flex items-center justify-center gap-2 text-sm shadow-sm active:scale-[0.98]"
                >
                  <ExternalLink className="w-4 h-4 text-cyanAccent-300" />
                  <span>Akses Demo Web</span>
                </a>

                <button
                  onClick={onOpenQr}
                  className="bg-slate-900/80 hover:bg-slate-800 text-white font-semibold px-4 py-3.5 rounded-2xl border border-slate-700/50 transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
                >
                  <QrCode className="w-4 h-4 text-cyanAccent-400" />
                  <span>Scan QR</span>
                </button>
              </div>

              {/* Specs Grid */}
              <div className="pt-6 border-t border-brand-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div>
                  <div className="text-[11px] text-cyanAccent-300">Status</div>
                  <div className="text-xs sm:text-sm font-bold text-white">Rilis Stabil</div>
                </div>
                <div>
                  <div className="text-[11px] text-cyanAccent-300">Ukuran APK</div>
                  <div className="text-xs sm:text-sm font-bold font-mono text-white">47.4 MB</div>
                </div>
                <div>
                  <div className="text-[11px] text-cyanAccent-300">Target Sistem</div>
                  <div className="text-xs sm:text-sm font-bold text-white">Android 7.0+</div>
                </div>
                <div>
                  <div className="text-[11px] text-cyanAccent-300">Pengembang</div>
                  <div className="text-xs sm:text-sm font-bold text-white">Glosindo</div>
                </div>
              </div>

              {/* Checksum info */}
              <div className="bg-brand-950/70 p-3 rounded-xl border border-brand-800/80 flex items-center justify-between text-xs font-mono text-blue-200">
                <div className="truncate mr-2">
                  <span className="text-cyanAccent-300 font-semibold">SHA-256: </span>
                  <span className="text-slate-300">{sampleSha.substring(0, 24)}...</span>
                </div>
                <button
                  onClick={copyChecksum}
                  className="shrink-0 flex items-center gap-1 bg-brand-900/90 hover:bg-brand-800 px-2.5 py-1 rounded-lg text-blue-200 hover:text-white border border-brand-700/60 transition-colors"
                >
                  {copiedSha ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-cyanAccent-300" />
                      <span className="text-[10px]">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Salin</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Right: Quick QR Card for Scanning */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-brand-300/80 text-center max-w-sm w-full">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-800 text-xs font-bold mb-3 border border-brand-200/80">
                  <Smartphone className="w-3.5 h-3.5 text-brand-700" />
                  <span>Scan Kamera HP</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Buka di Smartphone Anda
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Arahkan kamera ponsel Anda ke kode QR di bawah untuk mengunduh file APK secara langsung ke ponsel.
                </p>

                {/* QR Code Frame */}
                <div 
                  onClick={onOpenQr}
                  className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-brand-300/80 inline-block cursor-pointer hover:bg-brand-50/50 transition-colors group relative"
                  title="Klik untuk memperbesar QR"
                >
                  {/* Clean SVG Vector QR representation with Glosindo Navy & Blue */}
                  <svg
                    viewBox="0 0 160 160"
                    className="w-40 h-40 sm:w-44 sm:h-44 mx-auto group-hover:scale-105 transition-transform"
                    fill="currentColor"
                  >
                    {/* Corner Squares */}
                    <rect x="10" y="10" width="40" height="40" fill="#081028" rx="6" />
                    <rect x="16" y="16" width="28" height="28" fill="#ffffff" rx="4" />
                    <rect x="22" y="22" width="16" height="16" fill="#081028" rx="2" />

                    <rect x="110" y="10" width="40" height="40" fill="#081028" rx="6" />
                    <rect x="116" y="16" width="28" height="28" fill="#ffffff" rx="4" />
                    <rect x="122" y="22" width="16" height="16" fill="#081028" rx="2" />

                    <rect x="10" y="110" width="40" height="40" fill="#081028" rx="6" />
                    <rect x="16" y="116" width="28" height="28" fill="#ffffff" rx="4" />
                    <rect x="22" y="122" width="16" height="16" fill="#081028" rx="2" />

                    {/* QR Data Grid simulation dots */}
                    <circle cx="60" cy="20" r="4" fill="#2563eb" />
                    <circle cx="75" cy="20" r="4" fill="#081028" />
                    <circle cx="90" cy="20" r="4" fill="#2563eb" />

                    <circle cx="60" cy="35" r="4" fill="#081028" />
                    <circle cx="80" cy="35" r="4" fill="#2563eb" />
                    <circle cx="95" cy="35" r="4" fill="#081028" />

                    <circle cx="60" cy="50" r="4" fill="#2563eb" />
                    <circle cx="70" cy="50" r="4" fill="#081028" />
                    <circle cx="90" cy="50" r="4" fill="#2563eb" />

                    {/* Middle elements */}
                    <rect x="20" y="65" width="8" height="8" fill="#081028" rx="2" />
                    <rect x="35" y="65" width="8" height="8" fill="#2563eb" rx="2" />
                    <rect x="50" y="65" width="8" height="8" fill="#081028" rx="2" />
                    <rect x="65" y="65" width="16" height="16" fill="#081028" rx="4" />
                    <rect x="90" y="65" width="8" height="8" fill="#2563eb" rx="2" />
                    <rect x="110" y="65" width="8" height="8" fill="#081028" rx="2" />
                    <rect x="130" y="65" width="8" height="8" fill="#2563eb" rx="2" />

                    {/* Center QR Elements */}
                    <rect x="72" y="72" width="16" height="16" fill="#081028" rx="3" />

                    {/* Lower dots */}
                    <circle cx="60" cy="95" r="4" fill="#081028" />
                    <circle cx="75" cy="95" r="4" fill="#2563eb" />
                    <circle cx="100" cy="95" r="4" fill="#081028" />
                    <circle cx="120" cy="95" r="4" fill="#2563eb" />
                    <circle cx="135" cy="95" r="4" fill="#081028" />

                    <circle cx="60" cy="115" r="4" fill="#2563eb" />
                    <circle cx="80" cy="115" r="4" fill="#081028" />
                    <circle cx="100" cy="115" r="4" fill="#2563eb" />
                    <circle cx="120" cy="115" r="4" fill="#081028" />

                    <circle cx="65" cy="135" r="4" fill="#081028" />
                    <circle cx="85" cy="135" r="4" fill="#2563eb" />
                    <circle cx="105" cy="135" r="4" fill="#081028" />
                    <circle cx="125" cy="135" r="4" fill="#2563eb" />
                    <circle cx="140" cy="135" r="4" fill="#081028" />
                  </svg>
                  <div className="text-[10px] text-brand-800 font-semibold mt-1">
                    Klik untuk mode layar penuh
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span>Direct link langsung ke file server</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
