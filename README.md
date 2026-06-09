# DietMudah 🥗

DietMudah adalah Progressive Web App (PWA) gratis & open source untuk tracking kalori dan makronutrisi harian. Didesain khusus untuk pengguna Indonesia yang ingin mulai diet tanpa kerumitan. 

Proyek ini menjunjung tinggi privasi: **Zero Backend**. Seluruh data disimpan secara lokal di browser (`localStorage`), dan analisis makanan didukung langsung oleh integrasi **Google Gemini AI**.

## ✨ Fitur Unggulan

- **Kalkulator Kalori Otomatis**: Menghitung kebutuhan harian (BMR & TDEE) berbasis formula Mifflin-St Jeor.
- **Scan Makanan AI**: Gunakan kamera untuk memindai makanan. AI otomatis mendeteksi nama makanan, estimasi porsi, kalori, dan makro (Protein, Karbohidrat, Lemak).
- **Log Harian Terstruktur**: Catat makanan per waktu makan (Sarapan, Siang, Malam, Snack).
- **Dashboard Progress Mingguan**: Pantau kepatuhan target kalori Anda selama 7 hari terakhir dalam grafik yang interaktif.
- **Water Tracker**: Pantau asupan cairan harian Anda.
- **100% Offline Capable**: Karena berwujud PWA, aplikasi ini bisa diinstal ke Home Screen Android/iOS dan dapat diakses dengan cepat.
- **Privasi Aman**: Tidak ada server database yang menyimpan data Anda. API Key Anda tidak pernah dikirim ke server selain endpoint resmi Google.

## 🚀 Cara Menjalankan (Development)

Pastikan Anda memiliki [Node.js](https://nodejs.org/) terinstal di sistem Anda.

1. Clone repositori ini:
   ```bash
   git clone https://github.com/itsKazor/DietMudah.git
   ```
2. Masuk ke direktori proyek:
   ```bash
   cd DietMudah
   ```
3. Install semua dependensi:
   ```bash
   npm install
   ```
4. Jalankan Vite Development Server:
   ```bash
   npm run dev
   ```
5. Buka `http://localhost:5173` di browser Anda.

## 📦 Build untuk Production

Untuk menghasilkan file statis siap rilis (termasuk manifest PWA dan Service Worker):

```bash
npm run build
```

Hasil build akan berada di direktori `dist/`. Anda dapat menghosting folder `dist/` ini di layanan statis seperti Vercel, Netlify, atau GitHub Pages.

## 🔑 Pengaturan API Key Gemini

Aplikasi ini membutuhkan **Google Gemini API Key** gratis untuk menjalankan fitur Scan Kamera. 
Anda dapat mengaturnya di dalam aplikasi saat Onboarding atau di halaman Pengaturan.
1. Kunjungi [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Buat API Key baru.
3. Salin dan tempel ke dalam aplikasi DietMudah.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **State Management**: Zustand (dengan persist middleware)
- **Routing**: React Router v7
- **Charts**: Recharts
- **Icons**: Lucide React
- **PWA**: vite-plugin-pwa

## 📄 Lisensi

[MIT License](LICENSE)
