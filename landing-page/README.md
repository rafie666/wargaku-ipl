# Wargaku IPL — Landing Page & APK Download Portal

Portal website pengenalan aplikasi **Wargaku IPL** dan pusat unduhan APK resmi untuk warga dan pengurus lingkungan.

## 🌟 Fitur Halaman
1. **Hero & Download APK:**
   - Tombol unduh langsung file APK Android (`wargaku-ipl-v2.0.0.apk`).
   - Modal QR Code untuk pemindaian instan via kamera smartphone.
   - Interactive Phone Mockup menampilkan antarmuka asli Wargaku IPL (Kartu Digital Warga, Tagihan, Buku Kas).
2. **Pengenalan Fitur Utama:**
   - Pembayaran IPL via QRIS / Transfer Bank & E-Kuitansi resmi.
   - Kartu Identitas Digital Warga (Virtual Card dengan format unit `Blok B-12 / No. 04`).
   - Transparansi Buku Kas RT/RW secara riil.
   - Tombol Darurat & Jadwal Jaga Pos Satpam.
   - Layanan Surat Pengantar RT/RW Digital & Pengaduan Fasum.
   - Prinsip penagihan ramah warga (status amber sopan, tanpa intimidasi).
3. **Ekosistem Peran Terintegrasi:**
   - Tab interaktif untuk Warga, Ketua RT & RW, Bendahara, dan Satpam/Keamanan.
4. **Panduan Pasang APK (Android):**
   - 4 langkah praktis memasang file APK beserta penjelasan keamanan izin Android.
5. **Tanya Jawab (FAQ) Interaktif:**
   - Jawaban lengkap untuk pertanyaan umum warga seputar keamanan, akun login, dan metode bayar.

---

## 🚀 Cara Menjalankan

Masuk ke folder `landing-page/`:

```bash
cd landing-page

# 1. Jalankan development server:
npm run dev

# 2. Build untuk production:
npm run build

# 3. Preview hasil build:
npm run preview
```

Server development akan berjalan di `http://localhost:5174` (atau port yang tersedia).

---

## 📦 Menempatkan File APK Baru
Untuk mengganti file APK dengan build terbaru dari EAS/Expo:
- Letakkan file APK Anda di dalam folder `landing-page/public/` dengan nama `wargaku-ipl-v2.0.0.apk` (atau sesuaikan tautan di komponen `DownloadSection.jsx` dan `Navbar.jsx`).
