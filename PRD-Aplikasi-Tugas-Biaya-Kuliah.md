# Product Requirements Document (PRD)
## Aplikasi Manajemen Tugas & Biaya Kuliah

| | |
|---|---|
| **Versi Dokumen** | 1.0 |
| **Tanggal** | 28 Juli 2026 |
| **Status** | Draft |
| **Pemilik Produk** | Mahasiswa (Personal Project) |

---

## 1. Latar Belakang & Tujuan

### 1.1 Latar Belakang
Selama ini pencatatan tugas kuliah dan pengeluaran biaya kuliah masih dilakukan secara manual (catatan kertas, notes HP, atau tidak tercatat sama sekali). Hal ini menyebabkan:
- Tugas kuliah sering terlewat atau tidak jelas progresnya.
- Tidak ada gambaran jelas berapa total pengeluaran per semester.
- Sulit melacak status pengerjaan tugas (belum dikerjakan, sedang dikerjakan, selesai).

### 1.2 Tujuan Produk
Membangun aplikasi web pribadi yang membantu:
1. Mencatat dan mengelola tugas kuliah beserta statusnya secara terstruktur (mirip Kanban board).
2. Mencatat pengeluaran biaya kuliah dan menghitung total biaya per semester secara otomatis.
3. Memberikan pengalaman pengguna (UI/UX) yang nyaman, interaktif, dan responsif — tidak kaku seperti aplikasi CRUD pada umumnya.

### 1.3 Target Pengguna
Mahasiswa (personal use), khususnya untuk penggunaan individu — belum multi-user/kolaborasi.

---

## 2. Ruang Lingkup (Scope)

### 2.1 In-Scope (MVP)
- Manajemen tugas kuliah (CRUD + status board 3 tahap).
- Manajemen pengeluaran biaya kuliah per semester.
- Dashboard ringkasan (tugas & keuangan).
- Autentikasi dasar (login personal) menggunakan InsForge Auth.
- Berjalan di local development terlebih dahulu, deploy ke Vercel belakangan (atas instruksi eksplisit).

### 2.2 Out of Scope (untuk versi awal)
- Kolaborasi multi-user / sharing tugas antar mahasiswa.
- Notifikasi push / reminder via email atau WhatsApp.
- Aplikasi mobile native.
- Integrasi kalender eksternal (Google Calendar, dsb).
- Laporan/export PDF (bisa jadi fitur lanjutan).

---

## 3. Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React (Vite) |
| Backend (BaaS) | InsForge |
| Database | Neon (Serverless PostgreSQL) |
| Deployment | Vercel *(nanti, saat diminta — sementara jalan di local)* |
| Styling | Tailwind CSS (disarankan, untuk mendukung UI interaktif & responsif) |
| State Management | React Context / Zustand (disarankan untuk state ringan) |

---

## 4. Fitur Produk

### 4.1 Modul: Manajemen Tugas Kuliah

| ID | Fitur | Deskripsi |
|---|---|---|
| F-01 | Catat Tugas Pertama (Onboarding) | Saat pertama kali membuka aplikasi (belum ada data), tampilkan empty state yang mengarahkan user untuk membuat tugas pertama mereka. |
| F-02 | Tambah Tugas Kuliah | User dapat menambahkan tugas baru dengan input: nama tugas, mata kuliah, nama dosen, deadline, deskripsi (opsional), status awal (default: *Belum Dikerjakan*). |
| F-03 | Ubah Status Tugas | Tugas dapat dipindahkan antar 3 status: **Belum Dikerjakan → Sedang Dikerjakan → Selesai**, idealnya lewat drag-and-drop di board (Kanban style) atau dropdown/button cepat. |
| F-04 | Edit Tugas | User dapat mengubah detail tugas (nama tugas, mata kuliah, dosen, deadline, deskripsi). |
| F-05 | Hapus Tugas | User dapat menghapus tugas dengan konfirmasi (modal/dialog konfirmasi agar tidak salah hapus). |
| F-06 | Filter & Pencarian Tugas | Filter tugas berdasarkan mata kuliah, status, atau deadline terdekat. |

**Atribut Data Tugas:**
- Nama Tugas
- Mata Kuliah
- Nama Dosen
- Status (Belum Dikerjakan / Sedang Dikerjakan / Selesai)
- Deadline (tanggal)
- Deskripsi (opsional)
- Tanggal Dibuat / Diupdate

### 4.2 Modul: Manajemen Biaya Kuliah

| ID | Fitur | Deskripsi |
|---|---|---|
| F-07 | Catat Pengeluaran | User dapat mencatat pengeluaran biaya kuliah: nama pengeluaran, kategori (SPP, buku, praktikum, kos, dll — kategori bisa custom), nominal, tanggal, semester terkait. |
| F-08 | Edit/Hapus Pengeluaran | User dapat mengubah atau menghapus catatan pengeluaran yang sudah dibuat. |
| F-09 | Kalkulasi Total per Semester | Sistem otomatis menjumlahkan seluruh pengeluaran berdasarkan semester yang dipilih dan menampilkan total secara real-time. |
| F-10 | Breakdown Kategori | Menampilkan rincian pengeluaran per kategori dalam satu semester (misalnya dalam bentuk chart/grafik). |
| F-11 | Perbandingan Antar Semester | Menampilkan grafik perbandingan total pengeluaran antar semester untuk melihat tren. |

**Atribut Data Pengeluaran:**
- Nama Pengeluaran
- Kategori
- Nominal (Rupiah)
- Tanggal
- Semester (misal: "Semester 5 - 2026/2027")
- Catatan (opsional)

### 4.3 Modul: Dashboard

| ID | Fitur | Deskripsi |
|---|---|---|
| F-12 | Ringkasan Tugas | Menampilkan jumlah tugas per status, tugas dengan deadline terdekat, dan progress bar keseluruhan. |
| F-13 | Ringkasan Keuangan | Menampilkan total pengeluaran semester berjalan, perbandingan dengan semester sebelumnya. |

---

## 5. User Stories

1. **Sebagai mahasiswa**, saya ingin menambahkan tugas kuliah baru lengkap dengan mata kuliah dan dosen, agar saya tidak lupa detail tugas tersebut.
2. **Sebagai mahasiswa**, saya ingin memindahkan status tugas dari "belum dikerjakan" ke "sedang dikerjakan" saat saya mulai mengerjakannya, agar saya bisa memantau progres.
3. **Sebagai mahasiswa**, saya ingin menghapus atau mengedit tugas yang salah input atau sudah tidak relevan.
4. **Sebagai mahasiswa**, saya ingin mencatat setiap pengeluaran biaya kuliah agar semua tercatat rapi.
5. **Sebagai mahasiswa**, saya ingin melihat total biaya kuliah per semester secara otomatis tanpa menghitung manual.
6. **Sebagai mahasiswa**, saya ingin melihat dashboard yang memberi gambaran cepat soal tugas dan keuangan saya.

---

## 6. Struktur Data (Rancangan Skema Database - Neon PostgreSQL)

### Tabel `tasks`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Primary key |
| user_id | UUID (FK) | Relasi ke user |
| title | VARCHAR | Nama tugas |
| course_name | VARCHAR | Mata kuliah |
| lecturer_name | VARCHAR | Nama dosen |
| status | ENUM | `todo`, `in_progress`, `done` |
| deadline | DATE | Batas waktu tugas |
| description | TEXT | Opsional |
| created_at | TIMESTAMP | Auto |
| updated_at | TIMESTAMP | Auto |

### Tabel `expenses`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Primary key |
| user_id | UUID (FK) | Relasi ke user |
| title | VARCHAR | Nama pengeluaran |
| category | VARCHAR | Kategori (SPP, buku, dll) |
| amount | NUMERIC | Nominal |
| expense_date | DATE | Tanggal pengeluaran |
| semester | VARCHAR | Contoh: "Semester 5 - 2026/2027" |
| note | TEXT | Opsional |
| created_at | TIMESTAMP | Auto |

### Tabel `users` (dikelola InsForge Auth)
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Primary key |
| email | VARCHAR | Login |
| name | VARCHAR | Nama tampilan |
| created_at | TIMESTAMP | Auto |

---

## 7. Kebutuhan UI/UX

### 7.1 Prinsip Desain
- **Tidak kaku**: gunakan rounded corners, whitespace yang cukup, micro-interaction (hover, transisi halus).
- **Interaktif**: drag-and-drop untuk board status tugas, animasi transisi antar status/kartu.
- **Responsif**: layout menyesuaikan dari mobile hingga desktop (grid/flex adaptif).
- **Visual data**: gunakan chart (bar/pie/line) untuk breakdown biaya dan tren semester agar tidak sekadar angka mentah.
- **Feedback jelas**: toast/notification saat berhasil tambah/edit/hapus data, loading state saat fetch data.

### 7.2 Halaman Utama (Sketsa Struktur)
1. **Dashboard** — ringkasan tugas & keuangan.
2. **Papan Tugas (Task Board)** — tampilan Kanban 3 kolom (Belum Dikerjakan / Sedang Dikerjakan / Selesai).
3. **Manajemen Biaya** — daftar pengeluaran + form tambah + grafik kalkulasi per semester.
4. **Detail/Edit Tugas** — modal atau halaman terpisah untuk edit tugas.

### 7.3 Komponen UI Kunci
- Kanban Board dengan drag-and-drop (misalnya `@dnd-kit` atau `react-beautiful-dnd`).
- Card tugas dengan indikator warna sesuai status dan badge deadline (mis. merah jika mendekati deadline).
- Form modal untuk tambah/edit tugas dan pengeluaran.
- Selector semester (dropdown) untuk memfilter kalkulasi biaya.
- Chart interaktif (misalnya dengan `recharts`) untuk breakdown biaya.

---

## 8. Alur Pengguna (User Flow) Singkat

**Alur Tambah Tugas:**
Buka aplikasi → Klik "Tambah Tugas" → Isi form (nama tugas, mata kuliah, dosen, deadline) → Simpan → Tugas muncul di kolom "Belum Dikerjakan".

**Alur Update Status Tugas:**
Buka Papan Tugas → Drag kartu tugas dari kolom "Belum Dikerjakan" ke "Sedang Dikerjakan" (atau klik tombol ubah status) → Status tersimpan otomatis.

**Alur Catat Pengeluaran:**
Buka halaman Biaya Kuliah → Klik "Tambah Pengeluaran" → Isi nominal, kategori, tanggal, semester → Simpan → Total semester otomatis terupdate.

---

## 9. Kebutuhan Non-Fungsional

| Aspek | Kebutuhan |
|---|---|
| Performa | Loading data awal < 2 detik pada koneksi normal. |
| Keamanan | Autentikasi user via InsForge, setiap request tervalidasi dengan token, data antar user terisolasi (row-level ownership by `user_id`). |
| Skalabilitas | Struktur database mendukung penambahan fitur lanjutan (reminder, kolaborasi) di masa depan. |
| Kompatibilitas | Berjalan baik di browser modern (Chrome, Edge, Firefox) dan responsif di perangkat mobile. |
| Maintainability | Kode terstruktur modular (komponen React terpisah per fitur: task, expense, dashboard). |

---

## 10. Milestone Pengembangan (Disarankan)

| Fase | Deliverable |
|---|---|
| Fase 1 | Setup project (Vite + React), koneksi ke InsForge & Neon, autentikasi dasar. |
| Fase 2 | Modul Tugas Kuliah (CRUD + board status 3 tahap). |
| Fase 3 | Modul Biaya Kuliah (CRUD + kalkulasi per semester). |
| Fase 4 | Dashboard ringkasan & polish UI/UX (animasi, responsif). |
| Fase 5 | Testing menyeluruh di local. |
| Fase 6 | Deployment ke Vercel *(dilakukan hanya saat diminta secara eksplisit)*. |

---

## 11. Metrik Keberhasilan (Success Metrics)

Karena ini proyek personal, metrik difokuskan pada kegunaan pribadi:
- Semua tugas kuliah tercatat dan terupdate statusnya secara konsisten (tidak ada tugas "hilang" dari sistem).
- Total biaya per semester dapat dilihat dalam < 3 klik dari dashboard.
- Waktu yang dibutuhkan untuk mencatat 1 tugas atau 1 pengeluaran baru < 30 detik.

---

## 12. Catatan Tambahan

- Deployment ke Vercel **tidak dilakukan otomatis** — aplikasi akan dijalankan di local environment terlebih dahulu sampai ada instruksi eksplisit untuk deploy.
- Kategori pengeluaran sebaiknya dibuat fleksibel (bukan enum kaku) agar user bisa menambahkan kategori baru sesuai kebutuhan (misal: kos, transportasi, alat praktikum, dll).
- Pertimbangkan penambahan fitur "reminder deadline tugas" di versi selanjutnya (di luar scope MVP saat ini).
