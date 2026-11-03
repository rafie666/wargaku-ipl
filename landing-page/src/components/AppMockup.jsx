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

  return (
    <div className="relative mx-auto w-full max-w-[310px] sm:max-w-[350px] select-none">
      {/* Ambient subtle glow behind phone */}
      <div className="absolute -inset-3 bg-gradient-to-r from-brand-600/20 via-cyanAccent-500/20 to-brand-800/20 rounded-[44px] blur-2xl opacity-70 pointer-events-none -z-10" />

      {/* Phone Outer Shell */}
      <div className="bg-slate-900 p-2.5 sm:p-3 rounded-[40px] sm:rounded-[44px] shadow-2xl border-4 border-slate-700/60 ring-1 ring-slate-800">
        {/* Dynamic Notch / Screen Container */}
        <div className="relative bg-slate-950 rounded-[30px] sm:rounded-[34px] overflow-hidden border border-slate-800">
          
          {/* Top Status Bar */}
          <div className="bg-slate-950 px-5 pt-3 pb-2 flex items-center justify-between text-white text-[11px] font-medium tracking-tight">
            <span>09:12 WIB</span>
            <div className="w-16 h-3.5 bg-black rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-slate-300" />
              <Battery className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>

          {/* Screen Content Container */}
          <div className="bg-slate-50 text-slate-800 min-h-[540px] sm:min-h-[570px] flex flex-col justify-between">
            
            {/* Header Profil & Rumah */}
            <div className="bg-gradient-to-b from-brand-950 via-brand-900 to-brand-850 text-white p-3.5 sm:p-4 pb-5 rounded-b-[22px] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-cyanAccent-300 font-semibold tracking-wider uppercase">Cluster Puri Harmony • RT 03/08</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Bpk. Hendra Pratama</h3>
                  <p className="text-xs font-mono text-blue-200 mt-0.5 font-medium tracking-tight">
                    Blok B-12 / No. 04
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-700 border-2 border-brand-400/40 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow">
                  HP
                </div>
              </div>

              {/* Virtual Resident Card */}
              <div className="mt-3.5 bg-gradient-to-br from-brand-900 via-brand-950 to-slate-950 p-3 sm:p-3.5 rounded-2xl border border-brand-700/50 shadow-elevated relative overflow-hidden text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-4.5 rounded bg-gradient-to-r from-amber-400 to-amber-200 shadow-inner flex items-center justify-center">
                      <div className="w-4 h-2.5 border border-amber-600/50 rounded-sm" />
                    </div>
                    <span className="text-[9px] tracking-widest text-cyanAccent-300 uppercase font-bold">KARTU DIGITAL GLOSINDO</span>
                  </div>
                  <span className="bg-brand-500/25 text-cyanAccent-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-brand-400/30">
                    WARGA TETAP
                  </span>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-blue-200/80">ID Penghuni:</div>
                    <div className="text-xs font-mono font-bold tracking-wider text-white">
                      WRG-2026-0803-042
                    </div>
                  </div>
                  <div className="bg-white p-1 rounded-md shadow-sm">
                    <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900" />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: Quick Actions & Status */}
            <div className="p-3 sm:p-4 flex-1 space-y-3 -mt-2">
              
              {/* Quick Action Grid */}
              <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-sm border border-slate-200/80 grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 shadow-xs">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-brand-700" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700">Bayar IPL</span>
                </div>

                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700 shadow-xs">
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-700" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700">Buku Kas</span>
                </div>

                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 shadow-xs">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700">Surat RT</span>
                </div>

                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 shadow-xs">
                    <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-rose-700" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700">Darurat</span>
                </div>
              </div>

              {/* Status Tagihan Bulan Ini */}
              <div className="bg-white rounded-2xl p-3 sm:p-3.5 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Tagihan Bulan Ini</span>
                  <span className="bg-brand-50 text-brand-800 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border border-brand-200/60">
                    <CheckCircle2 className="w-3 h-3 text-brand-600" />
                    LUNAS
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">IPL Lingkungan & Keamanan</h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500">Periode: November 2026</p>
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-brand-700 font-mono">
                    Rp&nbsp;150.000
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Auto-Check Moota
                  </span>
                  <span className="text-brand-600 font-semibold cursor-pointer flex items-center gap-0.5 hover:underline">
                    E-Kuitansi <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Transparansi Kas RT Terkini */}
              <div className="bg-brand-900 text-white rounded-2xl p-3 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-cyanAccent-400" />
                    <span className="text-[10px] font-semibold text-blue-200">KAS RT 03 TERBUKA</span>
                  </div>
                  <span className="text-[9px] text-cyanAccent-300 font-mono font-medium">Live Sync</span>
                </div>
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="text-xs text-slate-300">Saldo Kas Lingkungan</span>
                  <span className="text-sm sm:text-base font-extrabold text-white font-mono tracking-tight">
                    Rp&nbsp;14.850.000
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Floating App Navigation */}
            <div className="bg-white border-t border-slate-200/80 px-3 py-2 flex items-center justify-around text-slate-400 relative">
              <button 
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center gap-0.5 ${activeTab === 'home' ? 'text-brand-700 font-bold' : ''}`}
              >
                <Home className="w-4 h-4" />
                <span className="text-[9px]">Beranda</span>
              </button>

              <button 
                onClick={() => setActiveTab('tagihan')}
                className={`flex flex-col items-center gap-0.5 ${activeTab === 'tagihan' ? 'text-brand-700 font-bold' : ''}`}
              >
                <Receipt className="w-4 h-4" />
                <span className="text-[9px]">Tagihan</span>
              </button>

              {/* Center Floating Profile Tab */}
              <div className="-mt-5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-700 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-brand-600/30">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-cyanAccent-300" />
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('layanan')}
                className={`flex flex-col items-center gap-0.5 ${activeTab === 'layanan' ? 'text-brand-700 font-bold' : ''}`}
              >
                <Grid className="w-4 h-4" />
                <span className="text-[9px]">Layanan</span>
              </button>

              <button 
                onClick={() => setActiveTab('menu')}
                className={`flex flex-col items-center gap-0.5 ${activeTab === 'menu' ? 'text-brand-700 font-bold' : ''}`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-[9px]">Aksi</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Badge Label */}
      <div className="mt-3 text-center">
        <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          Preview Aplikasi Mobile Glosindo Wargaku IPL
        </span>
      </div>
    </div>
  );
}
