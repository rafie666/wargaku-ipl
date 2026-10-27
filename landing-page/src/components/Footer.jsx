import React from 'react';
import { Download, ShieldCheck, Heart, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer({ onOpenQr }) {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center p-1 border border-emerald-400/30">
                <img
                  src="/app-icon.png"
                  alt="Wargaku IPL Logo"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="text-white font-bold text-lg">W</span>';
                  }}
                />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  Wargaku<span className="text-emerald-500">IPL</span>
                </span>
                <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900 text-limeAccent border border-emerald-700">
                  v2.0.0
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Ekosistem digital resmi untuk tata kelola iuran lingkungan, transparansi buku kas, kartu digital warga, dan pelayanan administrasi rukun tetangga.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-limeAccent" />
              <span>Aman, Bebas Iklan, & Terverifikasi Pengurus</span>
            </div>
          </div>

          {/* Col 3: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#fitur" className="hover:text-emerald-400 transition-colors">
                  Fitur Utama Warga
                </a>
              </li>
              <li>
                <a href="#peran" className="hover:text-emerald-400 transition-colors">
                  Keunggulan & Peran
                </a>
              </li>
              <li>
                <a href="#panduan" className="hover:text-emerald-400 transition-colors">
                  Panduan Pasang APK
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  Pertanyaan Umum (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Unduhan & Teknis */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Aplikasi Android
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/wargaku-ipl-v2.0.0.apk"
                  download="wargaku-ipl-v2.0.0.apk"
                  className="text-emerald-300 hover:text-limeAccent font-semibold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download APK (v2.0.0)</span>
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenQr}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Scan QR via HP
                </button>
              </li>
              <li className="text-slate-500 font-mono">
                Ukuran File: ~28.4 MB
              </li>
              <li className="text-slate-500 font-mono">
                Min. Android: 7.0 (Nougat)
              </li>
            </ul>
          </div>

          {/* Col 5: Kontak Lingkungan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Sekretariat Warga
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Pos Keamanan & Balai Warga RT 01 - 05 / RW 08</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hotline Pengurus Lingkungan</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>sekretariat@wargaku-ipl.local</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Wargaku IPL — Dikelola Bersama untuk Lingkungan Rukun & Harmonis.
          </div>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>untuk kenyamanan warga Indonesia.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
