import React, { useState } from 'react';
import { Download, Smartphone, QrCode, ShieldCheck, Check, Copy, ExternalLink, HardDrive, Info } from 'lucide-react';

export default function DownloadSection({ onOpenQr }) {
  const [copiedSha, setCopiedSha] = useState(false);
  const sampleSha = '4b0e46396a148fa16c5cda714fcf810f2b65d6769c29a8f3fe737eea5b099590';

  const copyChecksum = () => {
    navigator.clipboard.writeText(sampleSha);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2500);
  };

  return (
    <section id="unduh" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-emerald-600/20 via-limeAccent/15 to-emerald-900/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 rounded-3xl p-8 sm:p-12 lg:p-16 border border-emerald-600/40 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-limeAccent" />
                <span>Rilis Resmi Android • Multi-Komplek Ready</span>
              </div>

              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <img 
                  src="/logo.png" 
                  alt="IPL WARGA Icon" 
                  className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-emerald-500/40"
                />
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                    Unduh IPL WARGA
                  </h2>
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-limeAccent to-white text-lg sm:text-xl font-bold">
                    Aplikasi Resmi Manajemen Multi-Komplek
                  </div>
                </div>
              </div>

              <p className="text-emerald-100/90 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Bergabunglah dengan pengurus dan warga dari berbagai komplek di seluruh Indonesia yang telah beralih ke pengelolaan lingkungan mandiri yang praktis, aman, dan 100% transparan.
              </p>

              {/* Big Download Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="/wargaku-ipl.apk"
                  download="wargaku-ipl.apk"
                  className="w-full sm:w-auto bg-limeAccent hover:bg-[#c5e729] active:scale-95 text-darkForest font-black px-7 py-3.5 rounded-2xl shadow-elevated transition-all flex items-center justify-center gap-3 text-base group"
                >
                  <Download className="w-5 h-5 text-darkForest group-hover:scale-110 transition-transform" />
                  <span>Download APK (47.4 MB)</span>
                </a>

                <a
                  href="https://warga.glosindo.net.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold px-5 py-3.5 rounded-2xl border border-emerald-500/40 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <ExternalLink className="w-4 h-4 text-limeAccent" />
                  <span>Akses Demo Web</span>
                </a>

                <button
                  onClick={onOpenQr}
                  className="w-full sm:w-auto bg-emerald-950/80 hover:bg-emerald-900 text-white font-semibold px-4 py-3.5 rounded-2xl border border-emerald-700/40 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>Scan QR</span>
                </button>
              </div>

              {/* Specs Grid */}
              <div className="pt-6 border-t border-emerald-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div>
                  <div className="text-[11px] text-emerald-300">Status</div>
                  <div className="text-sm font-bold text-white">Rilis Stabil v2.0</div>
                </div>
                <div>
                  <div className="text-[11px] text-emerald-300">Ukuran APK</div>
                  <div className="text-sm font-bold font-mono text-white">47.4 MB</div>
                </div>
                <div>
                  <div className="text-[11px] text-emerald-300">Target Sistem</div>
                  <div className="text-sm font-bold text-white">Android 7.0+</div>
                </div>
                <div>
                  <div className="text-[11px] text-emerald-300">Lisensi</div>
                  <div className="text-sm font-bold text-white">Multi-Komplek</div>
                </div>
              </div>

              {/* Checksum info */}
              <div className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-800/80 flex items-center justify-between text-xs font-mono text-emerald-200">
                <div className="truncate mr-2">
                  <span className="text-emerald-400 font-semibold">SHA-256: </span>
                  <span className="text-slate-300">{sampleSha.substring(0, 24)}...</span>
                </div>
                <button
                  onClick={copyChecksum}
                  className="shrink-0 flex items-center gap-1 bg-emerald-900/90 hover:bg-emerald-800 px-2.5 py-1 rounded-lg text-emerald-200 hover:text-white border border-emerald-700/60 transition-colors"
                >
                  {copiedSha ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-limeAccent" />
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
              <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-emerald-500/40 text-center max-w-sm w-full">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Scan Kamera HP</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  Buka di Smartphone Anda
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Arahkan kamera ponsel Anda ke kode QR di bawah untuk mengunduh file APK secara langsung ke ponsel.
                </p>

                {/* QR Code Frame */}
                <div 
                  onClick={onOpenQr}
                  className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-emerald-300/80 inline-block cursor-pointer hover:bg-emerald-50/50 transition-colors group relative"
                  title="Klik untuk memperbesar QR"
                >
                  {/* Clean SVG Vector QR representation */}
                  <svg
                    viewBox="0 0 160 160"
                    className="w-44 h-44 mx-auto group-hover:scale-105 transition-transform"
                    fill="currentColor"
                  >
                    {/* Corner Squares */}
                    <rect x="10" y="10" width="40" height="40" fill="#022c22" rx="6" />
                    <rect x="16" y="16" width="28" height="28" fill="#ffffff" rx="4" />
                    <rect x="22" y="22" width="16" height="16" fill="#022c22" rx="2" />

                    <rect x="110" y="10" width="40" height="40" fill="#022c22" rx="6" />
                    <rect x="116" y="16" width="28" height="28" fill="#ffffff" rx="4" />
                    <rect x="122" y="22" width="16" height="16" fill="#022c22" rx="2" />

                    <rect x="10" y="110" width="40" height="40" fill="#022c22" rx="6" />
                    <rect x="16" y="116" width="28" height="28" fill="#ffffff" rx="4" />
                    <rect x="22" y="122" width="16" height="16" fill="#022c22" rx="2" />

                    {/* QR Data Grid simulation dots */}
                    <circle cx="60" cy="20" r="4" fill="#059669" />
                    <circle cx="75" cy="20" r="4" fill="#022c22" />
                    <circle cx="90" cy="20" r="4" fill="#059669" />

                    <circle cx="60" cy="35" r="4" fill="#022c22" />
                    <circle cx="80" cy="35" r="4" fill="#059669" />
                    <circle cx="95" cy="35" r="4" fill="#022c22" />

                    <circle cx="60" cy="50" r="4" fill="#059669" />
                    <circle cx="70" cy="50" r="4" fill="#022c22" />
                    <circle cx="90" cy="50" r="4" fill="#059669" />

                    {/* Middle elements */}
                    <rect x="20" y="65" width="8" height="8" fill="#022c22" rx="2" />
                    <rect x="35" y="65" width="8" height="8" fill="#059669" rx="2" />
                    <rect x="50" y="65" width="8" height="8" fill="#022c22" rx="2" />
                    <rect x="65" y="65" width="16" height="16" fill="#022c22" rx="4" />
                    <rect x="90" y="65" width="8" height="8" fill="#059669" rx="2" />
                    <rect x="110" y="65" width="8" height="8" fill="#022c22" rx="2" />
                    <rect x="130" y="65" width="8" height="8" fill="#059669" rx="2" />

                    {/* Center QR Elements */}
                    <rect x="72" y="72" width="16" height="16" fill="#022c22" rx="3" />

                    {/* Lower dots */}
                    <circle cx="60" cy="95" r="4" fill="#022c22" />
                    <circle cx="75" cy="95" r="4" fill="#059669" />
                    <circle cx="100" cy="95" r="4" fill="#022c22" />
                    <circle cx="120" cy="95" r="4" fill="#059669" />
                    <circle cx="135" cy="95" r="4" fill="#022c22" />

                    <circle cx="60" cy="115" r="4" fill="#059669" />
                    <circle cx="80" cy="115" r="4" fill="#022c22" />
                    <circle cx="100" cy="115" r="4" fill="#059669" />
                    <circle cx="120" cy="115" r="4" fill="#022c22" />

                    <circle cx="65" cy="135" r="4" fill="#022c22" />
                    <circle cx="85" cy="135" r="4" fill="#059669" />
                    <circle cx="105" cy="135" r="4" fill="#022c22" />
                    <circle cx="125" cy="135" r="4" fill="#059669" />
                    <circle cx="140" cy="135" r="4" fill="#022c22" />
                  </svg>
                  <div className="text-[10px] text-emerald-800 font-semibold mt-1">
                    Klik untuk mode layar penuh
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
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
