import React, { useState } from 'react';
import { X, Smartphone, Copy, Check, Download, ExternalLink } from 'lucide-react';

export default function QrModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/wargaku-ipl.apk`
    : 'https://wargaku-ipl.local/wargaku-ipl.apk';

  const copyUrl = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
          <Smartphone className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-slate-900">
          Scan QR untuk Unduh APK
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Arahkan kamera ponsel Android Anda ke kode di bawah untuk mengunduh langsung ke perangkat.
        </p>

        {/* QR Code Graphic Frame */}
        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-emerald-500/30 inline-block shadow-inner mb-6">
          <svg
            viewBox="0 0 160 160"
            className="w-56 h-56 mx-auto"
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

            {/* Simulated Data Grid */}
            <circle cx="60" cy="20" r="4" fill="#059669" />
            <circle cx="75" cy="20" r="4" fill="#022c22" />
            <circle cx="90" cy="20" r="4" fill="#059669" />

            <circle cx="60" cy="35" r="4" fill="#022c22" />
            <circle cx="80" cy="35" r="4" fill="#059669" />
            <circle cx="95" cy="35" r="4" fill="#022c22" />

            <circle cx="60" cy="50" r="4" fill="#059669" />
            <circle cx="70" cy="50" r="4" fill="#022c22" />
            <circle cx="90" cy="50" r="4" fill="#059669" />

            {/* Center Area */}
            <rect x="20" y="65" width="8" height="8" fill="#022c22" rx="2" />
            <rect x="35" y="65" width="8" height="8" fill="#059669" rx="2" />
            <rect x="50" y="65" width="8" height="8" fill="#022c22" rx="2" />
            <rect x="65" y="65" width="16" height="16" fill="#022c22" rx="4" />
            <rect x="90" y="65" width="8" height="8" fill="#059669" rx="2" />
            <rect x="110" y="65" width="8" height="8" fill="#022c22" rx="2" />
            <rect x="130" y="65" width="8" height="8" fill="#059669" rx="2" />

            {/* Center Area Dots */}
            <rect x="72" y="72" width="16" height="16" fill="#022c22" rx="3" />

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
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-limeAccent" />
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
        <div className="mt-6 flex gap-3">
          <a
            href="/wargaku-ipl.apk"
            download="wargaku-ipl.apk"
            className="flex-1 bg-limeAccent hover:bg-[#c2e22f] text-darkForest font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-sm"
          >
            <Download className="w-4 h-4 text-darkForest" />
            <span>Download ke Komputer</span>
          </a>
          <button
            onClick={onClose}
            className="px-5 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
