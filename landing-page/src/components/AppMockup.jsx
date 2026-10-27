import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  QrCode, 
  Wifi, 
  Battery, 
  Home, 
  Receipt, 
  User, 
  Grid, 
  Zap,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';

export default function AppMockup() {
  const [activeTab, setActiveTab] = useState('home');
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative mx-auto max-w-[340px] sm:max-w-[360px] select-none">
      {/* Glow effect behind phone */}
      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-limeAccent/20 to-emerald-700/20 rounded-[48px] blur-2xl opacity-75 animate-pulse-subtle -z-10" />

      {/* Phone Outer Shell */}
      <div className="bg-slate-900 p-3 rounded-[44px] shadow-2xl border-4 border-slate-700/60 ring-1 ring-slate-800">
        {/* Dynamic Island / Notch */}
        <div className="relative bg-slate-950 rounded-[34px] overflow-hidden border border-slate-800">
          
          {/* Top Status Bar */}
          <div className="bg-slate-950 px-6 pt-3 pb-2 flex items-center justify-between text-white text-[11px] font-medium tracking-tight">
            <span>09:12 WIB</span>
            <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500/40 animate-ping mr-1" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-slate-300" />
              <Battery className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>

          {/* Screen Content Container */}
          <div className="bg-slate-50 text-slate-800 min-h-[580px] flex flex-col justify-between">
            
            {/* Header Profil & Rumah */}
            <div className="bg-gradient-to-b from-emerald-900 to-emerald-800 text-white p-4 pb-6 rounded-b-[24px] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-emerald-300 font-semibold tracking-wider uppercase">Wilayah RT 03 / RW 08</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-limeAccent" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">Bpk. Hendra Pratama</h3>
                  <p className="text-xs font-mono text-emerald-200 mt-0.5 font-medium tracking-tight">
                    Blok B-12 / No. 04
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-700 border-2 border-emerald-400/40 flex items-center justify-center text-white font-bold text-sm shadow">
                  HP
                </div>
              </div>

              {/* Virtual Resident Card (Kanonikal Style) */}
              <div className="mt-4 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 p-3.5 rounded-2xl border border-emerald-600/40 shadow-elevated relative overflow-hidden text-white">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-limeAccent/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-5 rounded bg-gradient-to-r from-amber-400 to-amber-200 shadow-inner flex items-center justify-center">
                      <div className="w-5 h-3 border border-amber-600/50 rounded-sm" />
                    </div>
                    <span className="text-[9px] tracking-widest text-emerald-300 uppercase font-semibold">KARTU WARGA DIGITAL</span>
                  </div>
                  <span className="bg-emerald-500/20 text-limeAccent text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                    WARGA TETAP
                  </span>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-emerald-300/80">ID Penghuni:</div>
                    <div className="text-xs font-mono font-bold tracking-wider text-white">
                      WRG-2026-0803-042
                    </div>
                  </div>
                  <div className="bg-white p-1 rounded-md shadow-sm">
                    <QrCode className="w-6 h-6 text-slate-900" />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: Quick Actions & Status */}
            <div className="p-4 flex-1 space-y-3.5 -mt-3">
              
              {/* Quick Action Grid */}
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-150 grid grid-cols-4 gap-2 text-center">
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-xs">
                    <CreditCard className="w-5 h-5 text-emerald-700" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700">Bayar IPL</span>
                </div>

                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shadow-xs">
                    <Wallet className="w-5 h-5 text-blue-700" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700">Buku Kas</span>
                </div>

                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 shadow-xs">
                    <FileText className="w-5 h-5 text-purple-700" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700">Surat RT</span>
                </div>

                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 shadow-xs">
                    <ShieldAlert className="w-5 h-5 text-rose-700" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700">Darurat</span>
                </div>
              </div>

              {/* Status Tagihan Bulan Ini */}
              <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-150">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Tagihan Bulan Ini</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    LUNAS
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">IPL Lingkungan & Keamanan</h4>
                    <p className="text-[11px] text-slate-500">Periode: Oktober 2026</p>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-700 font-mono">
                    Rp&nbsp;150.000
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Dibayar 05 Okt 2026
                  </span>
                  <span className="text-emerald-700 font-semibold cursor-pointer flex items-center gap-0.5">
                    Lihat E-Kuitansi <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Transparansi Kas RT Terkini */}
              <div className="bg-emerald-900 text-white rounded-2xl p-3 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-limeAccent" />
                    <span className="text-[10px] font-semibold text-emerald-200">KAS RT 03 TERBUKA</span>
                  </div>
                  <span className="text-[9px] text-emerald-300 font-mono">Live Sync</span>
                </div>
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="text-xs text-emerald-100">Saldo Lingkungan</span>
                  <span className="text-base font-extrabold text-white font-mono tracking-tight">
                    Rp&nbsp;14.850.000
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Floating App Navigation */}
            <div className="bg-white border-t border-slate-200/80 px-4 py-2 flex items-center justify-around text-slate-400 relative">
              <button 
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center gap-0.5 ${activeTab === 'home' ? 'text-emerald-700 font-bold' : ''}`}
              >
                <Home className="w-4 h-4" />
                <span className="text-[9px]">Beranda</span>
              </button>

              <button 
                onClick={() => setActiveTab('tagihan')}
                className={`flex flex-col items-center gap-0.5 ${activeTab === 'tagihan' ? 'text-emerald-700 font-bold' : ''}`}
              >
                <Receipt className="w-4 h-4" />
                <span className="text-[9px]">Tagihan</span>
              </button>

              {/* Center Floating Profile Tab */}
              <div className="-mt-5">
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-emerald-600/30">
                  <User className="w-5 h-5 text-limeAccent" />
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('layanan')}
                className={`flex flex-col items-center gap-0.5 ${activeTab === 'layanan' ? 'text-emerald-700 font-bold' : ''}`}
              >
                <Grid className="w-4 h-4" />
                <span className="text-[9px]">Layanan</span>
              </button>

              <button 
                onClick={() => setActiveTab('menu')}
                className={`flex flex-col items-center gap-0.5 ${activeTab === 'menu' ? 'text-emerald-700 font-bold' : ''}`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-[9px]">Aksi Cepat</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Badge Label */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 whitespace-nowrap">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        Tampilan Asli Aplikasi Warga di Android
      </div>
    </div>
  );
}
