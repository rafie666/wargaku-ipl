import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import RoleTabs from './components/RoleTabs';
import InstallGuide from './components/InstallGuide';
import DownloadSection from './components/DownloadSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import QrModal from './components/QrModal';

export default function App() {
  const [qrModalOpen, setQrModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Fixed Navigation */}
      <Navbar onOpenQr={() => setQrModalOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero onOpenQr={() => setQrModalOpen(true)} />
        <Features />
        <RoleTabs />
        <InstallGuide />
        <DownloadSection onOpenQr={() => setQrModalOpen(true)} />
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer onOpenQr={() => setQrModalOpen(true)} />

      {/* Scan QR Modal */}
      <QrModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />
    </div>
  );
}
