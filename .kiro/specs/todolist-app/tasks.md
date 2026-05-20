# Implementation Plan: Todolist App

## Overview

Implementasi aplikasi Todo List berbasis browser menggunakan vanilla JavaScript, HTML, dan CSS dengan arsitektur MVC sederhana. Semua logika, state, dan persistensi data dikelola di sisi klien menggunakan `localStorage`. Tidak ada build tool — aplikasi dijalankan langsung dari `index.html`.

## Tasks

- [x] 1. Siapkan struktur proyek dan tipe data inti
  - Buat file `index.html` dengan markup dasar (App Container, Header, Input Section, Filter Bar, Task List, Footer)
  - Buat file `style.css` dengan styling dasar untuk semua komponen UI
  - Buat file `app.js` dengan definisi tipe data `Task`, `FilterType`, `AppState`, dan `Result`
  - Inisialisasi state awal aplikasi (`tasks: []`, `currentFilter: "all"`, `editingTaskId: null`)
  - Siapkan konfigurasi Vitest dan fast-check untuk pengujian (`package.json`, `vitest.config.js`)
  - _Requirements: 2.1, 2.4, 8.1_

- [x] 2. Implementasi Model — operasi CRUD dan validasi
  - [x] 2.1 Implementasi fungsi `createTask` dan `addTask`
    - Buat fungsi `createTask(description)` yang menghasilkan objek `Task` dengan UUID v4, `completed: false`, dan `createdAt: Date.now()`
    - Buat fungsi `addTask(description)` yang memvalidasi deskripsi (non-kosong, non-whitespace, ≤200 karakter) dan menambahkan task ke state
    - Kembalikan `Result<Task, ValidationError>` sesuai desain
    - _Requirements: 1.1, 1.2, 1.5_

  - [ ]* 2.2 Tulis property test untuk `addTask` — Property 1
    - **Property 1: Penambahan task memperbesar daftar**
    - **Validates: Requirements 1.1**
    - Tag komentar: `// Feature: todolist-app, Property 1: Penambahan task memperbesar daftar`

  - [ ]* 2.3 Tulis property test untuk validasi whitespace — Property 2
    - **Property 2: Validasi deskripsi whitespace berlaku universal**
    - **Validates: Requirements 1.2, 4.3**
    - Tag komentar: `// Feature: todolist-app, Property 2: Deskripsi whitespace ditolak`

  - [x] 2.4 Implementasi fungsi `toggleTask`
    - Buat fungsi `toggleTask(id)` yang membalik nilai `completed` pada task dengan ID yang diberikan
    - Gunakan immutable update (hasilkan array baru)
    - _Requirements: 3.1, 3.2_

  - [ ]* 2.5 Tulis property test untuk `toggleTask` — Property 5
    - **Property 5: Toggle status adalah involusi**
    - **Validates: Requirements 3.1, 3.2**
    - Tag komentar: `// Feature: todolist-app, Property 5: Toggle dua kali mengembalikan status semula`

  - [x] 2.6 Implementasi fungsi `editTask`
    - Buat fungsi `editTask(id, newDescription)` yang memvalidasi deskripsi baru dan memperbarui deskripsi task
    - Pertahankan `id` dan `createdAt` yang sama; kembalikan `Result<Task, ValidationError>`
    - _Requirements: 4.2, 4.3_

  - [ ]* 2.7 Tulis property test untuk `editTask` — Property 8
    - **Property 8: Edit task memperbarui deskripsi tanpa mengubah identitas task**
    - **Validates: Requirements 4.2**
    - Tag komentar: `// Feature: todolist-app, Property 8: Edit task memperbarui deskripsi tanpa mengubah identitas`

  - [x] 2.8 Implementasi fungsi `deleteTask` dan `clearCompleted`
    - Buat fungsi `deleteTask(id)` yang menghapus task dari state berdasarkan ID
    - Buat fungsi `clearCompleted()` yang menghapus semua task dengan `completed: true`
    - _Requirements: 5.1, 7.2_

  - [ ]* 2.9 Tulis property test untuk `clearCompleted` — Property 7
    - **Property 7: Hapus selesai menghilangkan semua task completed**
    - **Validates: Requirements 7.2**
    - Tag komentar: `// Feature: todolist-app, Property 7: Hapus selesai menghilangkan semua task completed`

  - [x] 2.10 Implementasi fungsi `getFilteredTasks`
    - Buat fungsi `getFilteredTasks(filter)` yang mengembalikan subset task sesuai `FilterType` ("all", "active", "completed")
    - _Requirements: 6.2, 6.3, 6.4_

  - [ ]* 2.11 Tulis property test untuk `getFilteredTasks` — Property 6
    - **Property 6: Filter mengembalikan subset yang tepat dan lengkap**
    - **Validates: Requirements 6.2, 6.3, 6.4**
    - Tag komentar: `// Feature: todolist-app, Property 6: Filter mengembalikan subset yang tepat dan lengkap`

- [ ] 3. Checkpoint — Pastikan semua unit dan property test Model lulus
  - Pastikan semua tests lulus, tanyakan kepada pengguna jika ada pertanyaan.

- [ ] 4. Implementasi Storage — persistensi localStorage
  - [ ] 4.1 Implementasi fungsi `saveTasks` dan `loadTasks`
    - Buat fungsi `saveTasks(tasks)` yang menyimpan array task ke `localStorage` dengan key `"todolist-app-tasks"` sebagai JSON string, dibungkus `try/catch`
    - Buat fungsi `loadTasks()` yang memuat dan mem-parse data dari `localStorage`, dibungkus `try/catch`
    - Kembalikan `Result<void, StorageError>` dan `Result<Task[], StorageError>` sesuai desain
    - Tampilkan error banner jika operasi gagal
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 4.2 Tulis property test untuk round-trip persistensi — Property 4
    - **Property 4: Round-trip persistensi — semua operasi perubahan tersimpan**
    - **Validates: Requirements 1.4, 2.3, 3.4, 4.5, 5.3, 8.1, 8.2**
    - Tag komentar: `// Feature: todolist-app, Property 4: Round-trip persistensi`

  - [ ]* 4.3 Tulis unit test untuk error handling localStorage
    - Test skenario `STORAGE_UNAVAILABLE`, `PARSE_ERROR`, dan `WRITE_ERROR`
    - Verifikasi error banner ditampilkan dan aplikasi tetap berjalan dengan state yang ada
    - _Requirements: 8.3, 8.4_

- [ ] 5. Implementasi View — rendering DOM
  - [ ] 5.1 Implementasi fungsi `renderTaskItem`
    - Buat fungsi `renderTaskItem(task)` yang menghasilkan elemen DOM untuk satu task item
    - Elemen harus mengandung: checkbox status, teks deskripsi, tombol edit, tombol hapus
    - Elemen harus mengandung elemen mode edit: input field, tombol simpan, tombol batal (tersembunyi secara default)
    - Terapkan class CSS yang mencerminkan status `completed` (misalnya class `completed` pada item)
    - _Requirements: 2.4, 3.3_

  - [ ]* 5.2 Tulis property test untuk `renderTaskItem` — Property 10
    - **Property 10: Render task menampilkan deskripsi dan status**
    - **Validates: Requirements 2.4, 3.3**
    - Tag komentar: `// Feature: todolist-app, Property 10: Render task menampilkan deskripsi dan status`

  - [ ] 5.3 Implementasi fungsi `renderTaskList` dan `renderEmptyState`
    - Buat fungsi `renderTaskList(tasks)` yang me-render ulang seluruh daftar task ke DOM
    - Buat fungsi `renderEmptyState(message)` yang menampilkan pesan ketika daftar kosong
    - Tampilkan empty state yang sesuai ketika tidak ada task atau tidak ada task yang cocok dengan filter
    - _Requirements: 2.1, 2.2, 5.4, 6.5_

  - [ ] 5.4 Implementasi fungsi `updateClearButton`
    - Buat fungsi `updateClearButton(tasks)` yang mengaktifkan/menonaktifkan tombol "Hapus Selesai" berdasarkan keberadaan task dengan `completed: true`
    - _Requirements: 7.1, 7.4_

  - [ ]* 5.5 Tulis property test untuk `updateClearButton` — Property 9
    - **Property 9: Tombol "Hapus Selesai" aktif jika dan hanya jika ada task selesai**
    - **Validates: Requirements 7.1, 7.4**
    - Tag komentar: `// Feature: todolist-app, Property 9: Tombol Hapus Selesai aktif iff ada task selesai`

- [ ] 6. Implementasi Controller — event handling dan integrasi
  - [ ] 6.1 Implementasi event handler untuk penambahan task
    - Pasang event listener pada tombol tambah (klik) dan input field (keydown Enter)
    - Panggil `addTask`, perbarui state, simpan ke storage, render ulang UI
    - Kosongkan input field dan kembalikan fokus ke input field setelah penambahan berhasil
    - Tampilkan pesan error inline jika validasi gagal
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 6.2 Tulis property test untuk input field dikosongkan — Property 3
    - **Property 3: Input field dikosongkan setelah penambahan berhasil**
    - **Validates: Requirements 1.3**
    - Tag komentar: `// Feature: todolist-app, Property 3: Input field dikosongkan setelah penambahan berhasil`

  - [ ] 6.3 Implementasi event handler untuk toggle, edit, dan hapus task
    - Pasang event listener (event delegation) pada task list untuk menangani klik checkbox (toggle), klik tombol edit, klik tombol hapus
    - Untuk toggle: panggil `toggleTask`, simpan ke storage, render ulang
    - Untuk hapus: panggil `deleteTask`, simpan ke storage, render ulang
    - Untuk edit: aktifkan mode edit pada task item yang sesuai (tampilkan input field edit, sembunyikan teks)
    - _Requirements: 3.1, 3.2, 3.4, 4.1, 5.1, 5.2, 5.3_

  - [ ] 6.4 Implementasi event handler untuk simpan dan batal edit
    - Pasang event listener untuk tombol simpan (klik) dan input edit (keydown Enter untuk simpan, Escape untuk batal)
    - Untuk simpan: panggil `editTask`, simpan ke storage, render ulang; tampilkan error jika validasi gagal
    - Untuk batal: kembalikan tampilan task ke mode normal tanpa mengubah state
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

  - [ ] 6.5 Implementasi event handler untuk filter dan hapus semua selesai
    - Pasang event listener pada tombol filter ("Semua", "Aktif", "Selesai") untuk memperbarui `currentFilter` dan render ulang
    - Pasang event listener pada tombol "Hapus Selesai" untuk memanggil `clearCompleted`, simpan ke storage, render ulang
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.2, 7.3_

- [ ] 7. Inisialisasi aplikasi dan load data awal
  - [ ] 7.1 Implementasi fungsi inisialisasi aplikasi
    - Buat fungsi `init()` yang dipanggil saat halaman dimuat (`DOMContentLoaded`)
    - Muat data dari `localStorage` menggunakan `loadTasks`, tangani error dengan menampilkan error banner
    - Set state awal dan render seluruh UI
    - _Requirements: 2.3, 8.2, 8.3_

  - [ ]* 7.2 Tulis unit test untuk inisialisasi dan load data
    - Test skenario: localStorage kosong (mulai dengan daftar kosong), localStorage berisi data valid (data dimuat dan ditampilkan), localStorage berisi data korup (error banner ditampilkan, mulai dengan daftar kosong)
    - _Requirements: 2.3, 8.2, 8.3_

- [ ] 8. Checkpoint akhir — Pastikan semua tests lulus
  - Pastikan semua unit test dan property test lulus, tanyakan kepada pengguna jika ada pertanyaan.

## Notes

- Task yang ditandai `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirement spesifik untuk keterlacakan
- Checkpoint memastikan validasi inkremental di setiap tahap
- Property tests memvalidasi properti kebenaran universal menggunakan fast-check (minimum 100 iterasi per property)
- Unit tests memvalidasi contoh spesifik dan edge case
- Aplikasi tidak memerlukan build tool — jalankan langsung dari `index.html`
- Untuk menjalankan tests: `npx vitest --run`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1"] },
    { "id": 1, "tasks": ["2.2", "2.3", "2.4", "2.6", "2.8", "2.10"] },
    { "id": 2, "tasks": ["2.5", "2.7", "2.9", "2.11", "4.1"] },
    { "id": 3, "tasks": ["4.2", "4.3", "5.1"] },
    { "id": 4, "tasks": ["5.2", "5.3", "5.4"] },
    { "id": 5, "tasks": ["5.5", "6.1", "6.3"] },
    { "id": 6, "tasks": ["6.2", "6.4", "6.5"] },
    { "id": 7, "tasks": ["7.1"] },
    { "id": 8, "tasks": ["7.2"] }
  ]
}
```
