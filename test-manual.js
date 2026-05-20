// ============================================================
// Test addTask — console.assert
// Jalankan di browser console setelah index.html terbuka
// ============================================================

import { addTask, getTasks, setState } from "./app.js";

// Helper: reset state sebelum tiap grup test
function reset() { setState([]); }

// ── NORMAL INPUT ─────────────────────────────────────────────

reset();
const r1 = addTask("Belajar JavaScript");
console.assert(r1.ok === true,                        "✗ [1] Harus berhasil untuk input valid");
console.assert(r1.value.description === "Belajar JavaScript", "✗ [2] Deskripsi harus tersimpan");
console.assert(typeof r1.value.id === "string",       "✗ [3] ID harus berupa string");
console.assert(r1.value.completed === false,          "✗ [4] Task baru harus belum selesai");
console.assert(typeof r1.value.createdAt === "number","✗ [5] createdAt harus berupa number");
console.assert(getTasks().length === 1,               "✗ [6] State harus bertambah 1");

// Trim whitespace di awal/akhir
reset();
const r2 = addTask("  Beli susu  ");
console.assert(r2.ok === true,                        "✗ [7] Input dengan spasi tepi harus diterima");
console.assert(r2.value.description === "Beli susu",  "✗ [8] Deskripsi harus di-trim");

// Tepat di batas minimum (3 karakter)
reset();
const r3 = addTask("abc");
console.assert(r3.ok === true,                        "✗ [9] Tepat 3 karakter harus diterima");

// Tepat di batas maksimum (50 karakter)
reset();
const r4 = addTask("a".repeat(50));
console.assert(r4.ok === true,                        "✗ [10] Tepat 50 karakter harus diterima");

// Urutan: task terbaru muncul pertama
reset();
addTask("Task pertama");
addTask("Task kedua");
console.assert(getTasks()[0].description === "Task kedua", "✗ [11] Task terbaru harus di indeks 0");

// ── NEGATIVE INPUT ───────────────────────────────────────────

// String kosong
reset();
const n1 = addTask("");
console.assert(n1.ok === false,                       "✗ [12] String kosong harus ditolak");
console.assert(n1.error === "EMPTY_DESCRIPTION",      "✗ [13] Error harus EMPTY_DESCRIPTION");
console.assert(getTasks().length === 0,               "✗ [14] State tidak boleh berubah");

// Hanya whitespace
reset();
const n2 = addTask("   ");
console.assert(n2.ok === false,                       "✗ [15] Whitespace saja harus ditolak");
console.assert(n2.error === "EMPTY_DESCRIPTION",      "✗ [16] Error harus EMPTY_DESCRIPTION");

// Terlalu pendek (di bawah 3 karakter setelah trim)
reset();
const n3 = addTask("ab");
console.assert(n3.ok === false,                       "✗ [17] 2 karakter harus ditolak");
console.assert(n3.error === "DESCRIPTION_TOO_SHORT",  "✗ [18] Error harus DESCRIPTION_TOO_SHORT");
console.assert(getTasks().length === 0,               "✗ [19] State tidak boleh berubah");

// Terlalu pendek setelah trim (spasi + 2 huruf)
reset();
const n4 = addTask("  ab  ");
console.assert(n4.ok === false,                       "✗ [20] 2 karakter (setelah trim) harus ditolak");
console.assert(n4.error === "DESCRIPTION_TOO_SHORT",  "✗ [21] Error harus DESCRIPTION_TOO_SHORT");

// Terlalu panjang (51 karakter)
reset();
const n5 = addTask("a".repeat(51));
console.assert(n5.ok === false,                       "✗ [22] 51 karakter harus ditolak");
console.assert(n5.error === "DESCRIPTION_TOO_LONG",   "✗ [23] Error harus DESCRIPTION_TOO_LONG");
console.assert(getTasks().length === 0,               "✗ [24] State tidak boleh berubah");

// Tipe bukan string
reset();
const n6 = addTask(null);
console.assert(n6.ok === false,                       "✗ [25] null harus ditolak");
console.assert(n6.error === "EMPTY_DESCRIPTION",      "✗ [26] Error harus EMPTY_DESCRIPTION");

console.log("✓ Semua assertion selesai — cek output di atas untuk kegagalan.");
