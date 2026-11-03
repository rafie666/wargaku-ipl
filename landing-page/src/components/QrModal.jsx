import React, { useState } from 'react';
import { X, Copy, Check, Download, ExternalLink } from 'lucide-react';

export default function QrModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/wargaku-ipl.apk`
    : 'https://warga.glosindo.net.id/wargaku-ipl.apk';

  const copyUrl = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <img 
          src="/logo.png" 
          alt="Logo Glosindo IPL" 
          className="w-14 h-14 rounded-2xl object-contain mx-auto mb-3 shadow-md border border-slate-200 bg-white p-1"
        />

        <h3 className="text-xl font-bold text-slate-900">
          Scan QR Unduh GLOSINDO IPL
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Arahkan kamera ponsel Android Anda ke kode di bawah untuk mengunduh aplikasi GLOSINDO IPL langsung ke HP.
        </p>

        {/* QR Code Graphic Frame */}
        <div className="bg-slate-50 p-5 rounded-2xl border-2 border-brand-200 inline-block shadow-inner mb-6">
          <svg
            viewBox="0 0 160 160"
            className="w-48 h-48 sm:w-56 sm:h-56 mx-auto"
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

            {/* Simulated Data Grid */}
            <circle cx="60" cy="20" r="4" fill="#2563eb" />
            <circle cx="75" cy="20" r="4" fill="#081028" />
            <circle cx="90" cy="20" r="4" fill="#2563eb" />

            <circle cx="60" cy="35" r="4" fill="#081028" />
            <circle cx="80" cy="35" r="4" fill="#2563eb" />
            <circle cx="95" cy="35" r="4" fill="#081028" />

            <circle cx="60" cy="50" r="4" fill="#2563eb" />
            <circle cx="70" cy="50" r="4" fill="#081028" />
            <circle cx="90" cy="50" r="4" fill="#2563eb" />

            {/* Center Area */}
            <rect x="20" y="65" width="8" height="8" fill="#081028" rx="2" />
            <rect x="35" y="65" width="8" height="8" fill="#2563eb" rx="2" />
            <rect x="50" y="65" width="8" height="8" fill="#081028" rx="2" />
            <rect x="65" y="65" width="16" height="16" fill="#081028" rx="4" />
            <rect x="90" y="65" width="8" height="8" fill="#2563eb" rx="2" />
            <rect x="110" y="65" width="8" height="8" fill="#081028" rx="2" />
            <rect x="130" y="65" width="8" height="8" fill="#2563eb" rx="2" />

            {/* Center Area Dots */}
            <rect x="72" y="72" width="16" height="16" fill="#081028" rx="3" />

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
        </div>

        {/* Copy Link input */}
        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl text-left border border-slate-200">
          <input
            type="text"
            readOnly
            value={downloadUrl}
            className="bg-transparent text-xs text-slate-600 font-mono flex-1 outline-none px-2"
          />
          <button
            onClick={copyUrl}
            className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-cyanAccent-200" />
                <span>Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>

        {/* Action button inside modal */}
        <div className="mt-6 flex flex-col gap-2.5">
          <div className="flex gap-2">
            <a
              href="/wargaku-ipl.apk"
              download="wargaku-ipl.apk"
              className="flex-1 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-sm"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download APK</span>
            </a>
            <a
              href="/app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyanAccent-400" />
              <span>Demo</span>
            </a>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
