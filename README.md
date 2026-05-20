# Todo List Toicy

Aplikasi manajemen tugas berbasis browser yang dibangun dengan vanilla JavaScript murni. Tidak memerlukan framework atau build tool — cukup buka `index.html` di browser dan langsung berjalan.

---

## Fitur Utama

- Tambah tugas baru melalui input teks atau tombol Enter
- Tandai tugas sebagai selesai dengan checkbox
- Edit deskripsi tugas secara inline (mode edit langsung di baris tugas)
- Hapus tugas satu per satu
- Hapus semua tugas yang sudah selesai sekaligus
- Filter tampilan tugas: Semua, Aktif, atau Selesai
- Validasi input: deskripsi tidak boleh kosong, minimal 3 karakter, maksimal 50 karakter
- Persistensi data menggunakan `localStorage` — data tetap ada setelah halaman di-refresh
- Tampilan pesan kosong yang kontekstual sesuai filter aktif
- Banner error untuk notifikasi kegagalan baca/tulis storage
- Desain responsif untuk layar mobile

---

## Instalasi dan Menjalankan Proyek

### Prasyarat

- [Node.js](https://nodejs.org/) versi 18 atau lebih baru (hanya diperlukan untuk menjalankan tes)
- Browser modern (Chrome, Firefox, Edge, Safari)

### Menjalankan Aplikasi

Tidak ada proses build. Buka langsung file HTML di browser:

```
Klik dua kali pada file index.html
```

Atau gunakan ekstensi Live Server di VS Code untuk pengalaman pengembangan yang lebih baik.

### Instalasi Dependensi (untuk pengujian)

```bash
npm install
```

### Menjalankan Tes

```bash
npm test
```

Perintah ini menjalankan seluruh test suite menggunakan Vitest dalam mode single-run (tidak watch mode).

---

## Struktur Folder

```
Rancang App1/
├── index.html          # Markup utama aplikasi
├── app.js              # Logika aplikasi (Model, View, Controller)
├── style.css           # Stylesheet dengan desain Neobrutalism
├── app.test.js         # Unit test untuk fungsi inti
├── test-manual.js      # Skrip pengujian manual di browser
├── vitest.config.js    # Konfigurasi Vitest
├── package.json        # Metadata proyek dan dependensi
└── README.md           # Dokumentasi proyek
```

---

## Teknologi yang Digunakan

| Teknologi | Keterangan |
|---|---|
| HTML5 | Struktur markup dengan atribut aksesibilitas (ARIA) |
| CSS3 | Styling dengan CSS Custom Properties, desain Neobrutalism |
| JavaScript (ES Modules) | Logika aplikasi tanpa framework, arsitektur MVC sederhana |
| Web Crypto API | Pembuatan UUID unik untuk setiap tugas (`crypto.randomUUID`) |
| localStorage | Persistensi data di sisi klien |
| Vitest | Framework pengujian unit |
| jsdom | Simulasi DOM untuk lingkungan pengujian Node.js |
| fast-check | Library property-based testing |
| Google Fonts (Space Grotesk) | Tipografi utama aplikasi |
