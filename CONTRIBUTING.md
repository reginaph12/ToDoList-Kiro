# Panduan Kontribusi

Terima kasih telah meluangkan waktu untuk berkontribusi pada proyek ini. Dokumen ini menjelaskan semua yang perlu Anda ketahui sebelum mengirimkan perubahan.

---

## Daftar Isi

1. [Cara Memulai](#cara-memulai)
2. [Alur Kerja Kontribusi](#alur-kerja-kontribusi)
3. [Aturan Pull Request](#aturan-pull-request)
4. [Standar Gaya Penulisan Kode](#standar-gaya-penulisan-kode)
5. [Standar Penulisan Tes](#standar-penulisan-tes)
6. [Etika Komunikasi](#etika-komunikasi)

---

## Cara Memulai

1. Fork repositori ini ke akun Anda.
2. Clone fork Anda ke mesin lokal:
   ```bash
   git clone https://github.com/<username>/todolist-toicy.git
   cd todolist-toicy
   ```
3. Install dependensi pengujian:
   ```bash
   npm install
   ```
4. Buat branch baru dari `main` untuk pekerjaan Anda:
   ```bash
   git checkout -b feat/nama-fitur-singkat
   ```
5. Pastikan semua tes lulus sebelum mulai mengubah kode:
   ```bash
   npm test
   ```

---

## Alur Kerja Kontribusi

```
fork → branch → commit → push → Pull Request → review → merge
```

- Satu branch untuk satu tujuan. Jangan mencampur perbaikan bug dengan fitur baru dalam satu branch.
- Commit sesering mungkin dengan pesan yang bermakna.
- Selalu rebase atau merge dari `main` terbaru sebelum membuka Pull Request.

### Konvensi Penamaan Branch

| Tipe | Format | Contoh |
|---|---|---|
| Fitur baru | `feat/deskripsi-singkat` | `feat/filter-prioritas` |
| Perbaikan bug | `fix/deskripsi-singkat` | `fix/validasi-input-null` |
| Dokumentasi | `docs/deskripsi-singkat` | `docs/update-readme` |
| Refactor | `refactor/deskripsi-singkat` | `refactor/pisah-storage-module` |
| Pengujian | `test/deskripsi-singkat` | `test/tambah-edge-case-edit` |

### Format Pesan Commit

Gunakan format Conventional Commits:

```
<tipe>: <deskripsi singkat dalam bahasa Indonesia atau Inggris>
```

Contoh yang benar:
```
feat: tambah filter berdasarkan prioritas tugas
fix: perbaiki validasi input yang menerima null
docs: perbarui README dengan instruksi instalasi
test: tambah test case untuk editTask dengan id tidak valid
refactor: pisahkan logika storage ke modul terpisah
```

- Gunakan huruf kecil untuk tipe dan deskripsi.
- Deskripsi maksimal 72 karakter.
- Gunakan kalimat imperatif ("tambah", "perbaiki", bukan "menambahkan", "memperbaiki").

---

## Aturan Pull Request

### Sebelum Membuka PR

- Semua tes harus lulus: `npm test`
- Tidak ada kode yang di-comment tanpa penjelasan.
- Tidak ada `console.log` debug yang tertinggal di `app.js`.
- Setiap fungsi publik baru harus dilengkapi JSDoc.
- Perubahan pada logika validasi atau storage harus disertai tes baru.

### Mengisi Deskripsi PR

Gunakan template berikut saat membuka PR:

```
## Ringkasan
Jelaskan apa yang diubah dan mengapa.

## Jenis Perubahan
- [ ] Perbaikan bug
- [ ] Fitur baru
- [ ] Refactor (tidak mengubah perilaku)
- [ ] Dokumentasi

## Cara Menguji
Langkah-langkah untuk memverifikasi perubahan ini secara manual.

## Checklist
- [ ] npm test lulus
- [ ] Semua fungsi publik baru memiliki JSDoc
- [ ] Tidak ada console.log debug yang tertinggal
```

### Proses Review

- Setiap PR memerlukan minimal satu approval sebelum di-merge.
- Reviewer berhak meminta perubahan. Tanggapi setiap komentar review, baik dengan melakukan perubahan maupun dengan penjelasan mengapa tidak.
- Jangan melakukan force push ke branch PR setelah review dimulai, kecuali diminta secara eksplisit.
- PR yang tidak aktif selama 14 hari akan ditutup. Anda dapat membukanya kembali kapan saja.

### Merge

- Gunakan **Squash and Merge** untuk PR dengan banyak commit kecil.
- Gunakan **Merge Commit** untuk PR dengan riwayat commit yang sudah rapi dan bermakna.
- Jangan merge PR milik sendiri tanpa review dari kontributor lain.

---

## Standar Gaya Penulisan Kode

Proyek ini menggunakan vanilla JavaScript (ES Modules) tanpa transpiler. Ikuti konvensi yang sudah ada di `app.js`.

### JavaScript

**Arsitektur**

Kode diorganisasi dalam arsitektur MVC sederhana dengan pemisahan bagian yang jelas menggunakan komentar separator:

```js
// ============================================================
// MODEL — CRUD & VALIDATION
// ============================================================
```

Urutan bagian dalam file harus dipertahankan:
1. Type Definitions (JSDoc `@typedef`)
2. Constants
3. State
4. State Accessors
5. Model (CRUD & Validation)
6. Storage
7. View (DOM Rendering)
8. Controller (Event Handling)
9. Init
10. Bootstrap

**Penamaan**

- Variabel dan fungsi: `camelCase` — `addTask`, `currentFilter`, `editingTaskId`
- Konstanta modul: `SCREAMING_SNAKE_CASE` — `STORAGE_KEY`, `MAX_DESCRIPTION_LENGTH`
- Tidak ada singkatan ambigu. Gunakan `description` bukan `desc`, `element` atau `el` untuk DOM node.

**Fungsi**

- Satu fungsi, satu tanggung jawab.
- Fungsi yang berinteraksi dengan DOM harus defensif: selalu periksa keberadaan elemen sebelum menggunakannya.
  ```js
  // Benar
  const btn = document.getElementById("add-btn");
  if (!btn) return;

  // Salah
  document.getElementById("add-btn").addEventListener(...);
  ```
- Gunakan immutable update untuk memodifikasi array state:
  ```js
  // Benar
  state.tasks = state.tasks.map((task) => {
    if (task.id === id) return { ...task, completed: !task.completed };
    return task;
  });

  // Salah
  const task = state.tasks.find((t) => t.id === id);
  task.completed = !task.completed;
  ```

**Pola Result**

Semua fungsi yang dapat gagal harus mengembalikan tipe `Result<T, E>`, bukan melempar exception:

```js
// Benar
export function addTask(description) {
  const validation = validateDescription(description);
  if (!validation.ok) return validation;
  // ...
  return { ok: true, value: task };
}

// Salah
export function addTask(description) {
  if (!description) throw new Error("Description required");
  // ...
}
```

**JSDoc**

Setiap fungsi yang diekspor (`export function`) wajib memiliki JSDoc lengkap:

```js
/**
 * Deskripsi singkat apa yang dilakukan fungsi ini.
 * @param {string} id - ID tugas yang akan dihapus
 * @returns {void}
 */
export function deleteTask(id) { ... }
```

Tipe data baru harus didefinisikan sebagai `@typedef` di bagian Type Definitions, bukan inline.

**Event Handling**

Gunakan event delegation pada container, bukan listener individual per elemen:

```js
// Benar — satu listener di container
taskList.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  const id = e.target.dataset.id;
  if (!action || !id) return;
  // handle berdasarkan action
});

// Salah — listener per tombol
document.querySelectorAll(".task-delete-btn").forEach((btn) => {
  btn.addEventListener("click", ...);
});
```

**Lain-lain**

- Gunakan `const` secara default. Gunakan `let` hanya jika nilai memang perlu diubah. Jangan gunakan `var`.
- Gunakan template literal untuk string yang mengandung variabel.
- Tidak ada magic number. Semua nilai konfigurasi harus menjadi konstanta bernama.
- Indentasi: 2 spasi.
- Tidak ada trailing whitespace.

### CSS

- Semua nilai desain (warna, ukuran border, shadow, font) harus menggunakan CSS Custom Properties yang sudah didefinisikan di `:root`. Jangan hardcode nilai warna atau ukuran secara langsung.
  ```css
  /* Benar */
  border: var(--border-width) solid var(--color-border);

  /* Salah */
  border: 3px solid #111111;
  ```
- Nama kelas menggunakan `kebab-case` dengan pola BEM longgar: `block`, `block-element`, `block--modifier`.
- Setiap bagian CSS dipisahkan dengan komentar header:
  ```css
  /* ===========================
     Nama Bagian
     =========================== */
  ```
- Pertahankan urutan bagian yang sudah ada. Tambahkan bagian baru di posisi yang logis, bukan di akhir file secara sembarangan.
- Desain menggunakan gaya Neobrutalism: tidak ada `border-radius`, gunakan `box-shadow` hard shadow, border hitam tebal. Jangan memperkenalkan gaya yang bertentangan dengan sistem desain ini.

### HTML

- Setiap elemen interaktif harus memiliki atribut `aria-label` yang deskriptif.
- Gunakan elemen semantik yang tepat: `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`.
- Elemen yang berisi konten dinamis harus memiliki `aria-live` yang sesuai.
- Jangan menambahkan inline style. Semua styling melalui kelas CSS.

---

## Standar Penulisan Tes

Proyek menggunakan **Vitest** dengan environment **jsdom**.

### Struktur Test

```js
describe("Nama modul atau fitur — deskripsi singkat", () => {
  beforeEach(() => {
    setState([]); // selalu reset state sebelum tiap test
  });

  it("deskripsi perilaku yang diuji dalam kalimat lengkap", () => {
    // arrange
    // act
    // assert
  });
});
```

- Nama `describe` mengikuti pola yang sudah ada: `"NamaFitur — deskripsi"`
- Nama `it` harus mendeskripsikan perilaku, bukan nama fungsi. Gunakan kalimat lengkap.
  - Benar: `"menolak deskripsi yang hanya berisi spasi"`
  - Salah: `"test validateDescription whitespace"`
- Selalu panggil `setState([])` di `beforeEach` untuk mengisolasi setiap test.
- Uji satu perilaku per `it`. Jangan menggabungkan beberapa assertion yang tidak berkaitan.
- Setiap fitur baru atau perbaikan bug harus disertai test case yang relevan.

### Cakupan yang Diharapkan

Setiap fungsi Model yang diekspor harus memiliki test untuk:
- Input valid (happy path)
- Input kosong atau null
- Input di batas minimum dan maksimum
- Efek samping pada state (apakah state berubah atau tidak berubah sesuai ekspektasi)

---

## Etika Komunikasi

Proyek ini berkomitmen untuk menjadi ruang yang aman dan produktif bagi semua kontributor, tanpa memandang latar belakang atau tingkat pengalaman.

### Yang Diharapkan

- Berikan umpan balik yang spesifik dan konstruktif. Komentari kode, bukan orangnya.
  - Benar: "Fungsi ini bisa disederhanakan dengan menggunakan `Array.prototype.find`."
  - Salah: "Kode ini berantakan."
- Asumsikan niat baik. Jika ada yang tidak jelas, tanyakan terlebih dahulu sebelum menyimpulkan.
- Gunakan bahasa yang inklusif dan profesional dalam semua diskusi, baik di issue, PR, maupun komentar kode.
- Hargai waktu reviewer dengan memastikan PR sudah siap sebelum meminta review.
- Tanggapi komentar review dalam waktu yang wajar. Jika Anda membutuhkan waktu lebih, beri tahu.

### Yang Tidak Ditoleransi

- Komentar yang merendahkan, menyerang, atau bersifat personal.
- Bahasa yang diskriminatif dalam bentuk apapun.
- Spam atau permintaan review yang berulang tanpa perubahan substansial.
- Mengabaikan komentar review tanpa penjelasan.

### Melaporkan Masalah

Jika Anda mengalami atau menyaksikan perilaku yang tidak sesuai, hubungi pengelola proyek secara langsung melalui email atau pesan pribadi. Semua laporan akan ditangani dengan serius dan kerahasiaan.

---

Sekali lagi, terima kasih atas kontribusi Anda. Setiap perbaikan, sekecil apapun, sangat berarti bagi proyek ini.
