# Requirements Document

## Introduction

Aplikasi Todo List adalah aplikasi frontend sederhana yang memungkinkan pengguna mengelola daftar tugas mereka secara efisien. Pengguna dapat menambahkan tugas baru, menandai tugas sebagai selesai, mengedit tugas yang sudah ada, menghapus tugas, serta memfilter tugas berdasarkan statusnya. Aplikasi ini berjalan sepenuhnya di sisi klien (browser) dan menyimpan data secara lokal menggunakan localStorage agar data tetap tersedia setelah halaman di-refresh.

## Glossary

- **Sistem**: Aplikasi Todo List frontend
- **Tugas**: Sebuah item pekerjaan yang perlu diselesaikan oleh pengguna, memiliki deskripsi dan status
- **Deskripsi_Tugas**: Teks yang menjelaskan isi dari sebuah tugas
- **Status_Tugas**: Kondisi tugas, bernilai "aktif" (belum selesai) atau "selesai"
- **Daftar_Tugas**: Kumpulan semua tugas yang dimiliki pengguna
- **Filter**: Kriteria yang digunakan untuk menampilkan subset dari Daftar_Tugas
- **Input_Field**: Elemen antarmuka tempat pengguna mengetikkan Deskripsi_Tugas
- **LocalStorage**: Mekanisme penyimpanan data di browser yang persisten antar sesi
- **Validator**: Komponen yang memeriksa keabsahan masukan pengguna

---

## Requirements

### Requirement 1: Menambahkan Tugas Baru

**User Story:** Sebagai pengguna, saya ingin menambahkan tugas baru ke daftar saya, sehingga saya dapat mencatat dan mengorganisir hal-hal yang perlu saya kerjakan.

#### Acceptance Criteria

1. WHEN pengguna mengetikkan Deskripsi_Tugas dan menekan tombol Enter atau mengklik tombol tambah, THE Sistem SHALL membuat tugas baru dan menambahkannya ke Daftar_Tugas
2. WHEN pengguna mencoba menambahkan tugas dengan Deskripsi_Tugas yang hanya berisi spasi atau kosong, THE Validator SHALL menolak penambahan dan mempertahankan kondisi Daftar_Tugas saat ini
3. WHEN tugas baru berhasil ditambahkan, THE Sistem SHALL mengosongkan Input_Field dan memfokuskan kursor ke Input_Field untuk entri berikutnya
4. WHEN tugas baru berhasil ditambahkan, THE Sistem SHALL menyimpan tugas tersebut ke LocalStorage secara langsung
5. THE Sistem SHALL membatasi panjang Deskripsi_Tugas maksimal 200 karakter

---

### Requirement 2: Menampilkan Daftar Tugas

**User Story:** Sebagai pengguna, saya ingin melihat semua tugas saya dalam satu tampilan, sehingga saya dapat memantau pekerjaan yang perlu dilakukan.

#### Acceptance Criteria

1. THE Sistem SHALL menampilkan semua tugas dalam Daftar_Tugas secara berurutan dari yang paling baru ditambahkan
2. WHEN Daftar_Tugas kosong, THE Sistem SHALL menampilkan pesan informasi yang memberitahu pengguna bahwa belum ada tugas
3. WHEN halaman dimuat ulang, THE Sistem SHALL memuat kembali Daftar_Tugas dari LocalStorage dan menampilkannya
4. THE Sistem SHALL menampilkan setiap tugas beserta Deskripsi_Tugas dan Status_Tugas-nya

---

### Requirement 3: Menandai Tugas Selesai

**User Story:** Sebagai pengguna, saya ingin menandai tugas sebagai selesai, sehingga saya dapat melacak kemajuan pekerjaan saya.

#### Acceptance Criteria

1. WHEN pengguna mengklik kotak centang pada sebuah tugas, THE Sistem SHALL mengubah Status_Tugas dari "aktif" menjadi "selesai"
2. WHEN pengguna mengklik kotak centang pada tugas yang sudah "selesai", THE Sistem SHALL mengubah Status_Tugas kembali menjadi "aktif"
3. WHEN Status_Tugas berubah, THE Sistem SHALL memperbarui tampilan visual tugas tersebut untuk mencerminkan status terbaru
4. WHEN Status_Tugas berubah, THE Sistem SHALL menyimpan perubahan ke LocalStorage secara langsung

---

### Requirement 4: Mengedit Tugas

**User Story:** Sebagai pengguna, saya ingin mengedit deskripsi tugas yang sudah ada, sehingga saya dapat memperbarui informasi tugas jika ada perubahan.

#### Acceptance Criteria

1. WHEN pengguna mengklik tombol edit pada sebuah tugas, THE Sistem SHALL mengaktifkan mode edit dan menampilkan Input_Field yang berisi Deskripsi_Tugas saat ini
2. WHEN pengguna menyimpan perubahan dengan menekan Enter atau mengklik tombol simpan, THE Sistem SHALL memperbarui Deskripsi_Tugas dengan nilai baru
3. WHEN pengguna mencoba menyimpan Deskripsi_Tugas yang hanya berisi spasi atau kosong, THE Validator SHALL menolak perubahan dan mempertahankan Deskripsi_Tugas sebelumnya
4. WHEN pengguna menekan tombol Escape saat dalam mode edit, THE Sistem SHALL membatalkan perubahan dan mengembalikan tampilan ke kondisi semula
5. WHEN Deskripsi_Tugas berhasil diperbarui, THE Sistem SHALL menyimpan perubahan ke LocalStorage secara langsung

---

### Requirement 5: Menghapus Tugas

**User Story:** Sebagai pengguna, saya ingin menghapus tugas yang tidak relevan lagi, sehingga daftar tugas saya tetap bersih dan terorganisir.

#### Acceptance Criteria

1. WHEN pengguna mengklik tombol hapus pada sebuah tugas, THE Sistem SHALL menghapus tugas tersebut dari Daftar_Tugas
2. WHEN tugas berhasil dihapus, THE Sistem SHALL memperbarui tampilan Daftar_Tugas secara langsung
3. WHEN tugas berhasil dihapus, THE Sistem SHALL memperbarui LocalStorage untuk mencerminkan penghapusan tersebut
4. WHEN Daftar_Tugas tidak memiliki tugas setelah penghapusan, THE Sistem SHALL menampilkan pesan informasi bahwa belum ada tugas

---

### Requirement 6: Memfilter Tugas

**User Story:** Sebagai pengguna, saya ingin memfilter tugas berdasarkan statusnya, sehingga saya dapat fokus pada tugas yang relevan.

#### Acceptance Criteria

1. THE Sistem SHALL menyediakan tiga pilihan Filter: "Semua", "Aktif", dan "Selesai"
2. WHEN pengguna memilih Filter "Semua", THE Sistem SHALL menampilkan seluruh tugas dalam Daftar_Tugas
3. WHEN pengguna memilih Filter "Aktif", THE Sistem SHALL menampilkan hanya tugas dengan Status_Tugas "aktif"
4. WHEN pengguna memilih Filter "Selesai", THE Sistem SHALL menampilkan hanya tugas dengan Status_Tugas "selesai"
5. WHEN tidak ada tugas yang cocok dengan Filter yang dipilih, THE Sistem SHALL menampilkan pesan informasi yang sesuai

---

### Requirement 7: Menghapus Semua Tugas Selesai

**User Story:** Sebagai pengguna, saya ingin menghapus semua tugas yang sudah selesai sekaligus, sehingga saya dapat membersihkan daftar dengan cepat.

#### Acceptance Criteria

1. THE Sistem SHALL menyediakan tombol "Hapus Selesai" yang hanya aktif ketika terdapat minimal satu tugas dengan Status_Tugas "selesai"
2. WHEN pengguna mengklik tombol "Hapus Selesai", THE Sistem SHALL menghapus semua tugas dengan Status_Tugas "selesai" dari Daftar_Tugas
3. WHEN semua tugas selesai berhasil dihapus, THE Sistem SHALL memperbarui LocalStorage untuk mencerminkan perubahan tersebut
4. WHILE tidak ada tugas dengan Status_Tugas "selesai", THE Sistem SHALL menonaktifkan tombol "Hapus Selesai"

---

### Requirement 8: Persistensi Data

**User Story:** Sebagai pengguna, saya ingin data tugas saya tersimpan secara otomatis, sehingga saya tidak kehilangan data ketika menutup atau me-refresh browser.

#### Acceptance Criteria

1. THE Sistem SHALL menyimpan seluruh Daftar_Tugas ke LocalStorage setiap kali terjadi perubahan (penambahan, pengeditan, penghapusan, atau perubahan status)
2. WHEN halaman dimuat, THE Sistem SHALL memuat Daftar_Tugas dari LocalStorage
3. IF LocalStorage tidak tersedia atau terjadi kesalahan saat membaca data, THEN THE Sistem SHALL menampilkan pesan kesalahan dan memulai dengan Daftar_Tugas kosong
4. IF LocalStorage tidak tersedia atau terjadi kesalahan saat menyimpan data, THEN THE Sistem SHALL menampilkan pesan kesalahan kepada pengguna
