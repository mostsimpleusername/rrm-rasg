# **Product Requirement Document \- PRD**

**Mata Kuliah:** Analisis Perancangan Sistem Informasi

**Nama Proyek:** RRM-RASG (Sistem Manajemen Relawan & Kegiatan Rumah Amal Salman Garut)

**Versi:** 1.0-release

**Tanggal:** 14 Juni 2026

## **Identitas Tim**

| No | Nama Lengkap | NIM | Peran (Role) | Tanggung Jawab Utama |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Akmal Maulana | 2407040 | Project Manager & System Analyst | Merancang PRD, Arsitektur Basis Data, Validasi Alur Bisnis (RBAC), Koordinasi Dokumentasi (UML & DFD). |
| 2 | Vicky Andika Irwanto | 2407044 | UI/UX & Front End Developer | Mengembangkan antarmuka interaktif dengan React/Vite, TailwindCSS, State Management, & Visualisasi Data (Recharts). |
| 3 | Ripandi Gunawan | 2407038 | Database & Backend Integrator | Konfigurasi Supabase, Perancangan Skema PostgreSQL, Implementasi Row Level Security (RLS), & Integrasi Google Gemini AI. |

## **1\. Pendahuluan**

### **1.1 Latar Belakang**

Organisasi kerelawanan berskala besar seperti Rumah Amal Salman Garut (RASG) sering menghadapi masalah dalam memantau anggota yang tersebar di berbagai divisi. Pengelolaan data yang tersentralisasi namun tetap mengisolasi wewenang masing-masing admin divisi menjadi sebuah tantangan. Selain itu, kegiatan organisasi seringkali kekurangan dokumentasi deskriptif yang baik. Oleh karena itu, Sistem RRM-RASG dikembangkan sebagai platform *Serverless* modern yang memadukan manajemen basis data aman (Row Level Security) dengan kecerdasan buatan (Gemini AI) untuk mengotomatisasi deskripsi acara.

### **1.2 Tujuan Proyek**

Membangun ekosistem perangkat lunak yang mampu mengelola siklus hidup keanggotaan dan acara secara dinamis, memastikan integritas data lintas divisi melalui *Role-Based Access Control* (RBAC) pada tingkat basis data, serta mengotomatisasi pembuatan *copywriting* kegiatan menggunakan modul *Generative AI*.

### **1.3 Ruang Lingkup (Scope)**

* **In-Scope:** Registrasi dan *approval* akun anggota, pemisahan hak akses berbasis Divisi (Umum, HR, Ristek, dll), penjadwalan acara dengan kalkulasi status waktu *real-time*, perlindungan RLS (Row Level Security), dan modul AI *Text Generation* terisolasi untuk deskripsi acara.  
* **Out-of-Scope:** Sistem ini tidak memproses transaksi finansial (donasi/zakat), pembukuan kas organisasi, absensi menggunakan biometrik/QR Code, atau manajemen aset/inventaris fisik.

## **2\. Target Pengguna (User Persona)**

* **Aktor 1: Super Admin:** Memiliki otorisasi absolut melintasi batas divisi. Bertanggung jawab mengelola seluruh anggota (termasuk memindahkan divisi anggota), membatalkan kegiatan dari divisi manapun, dan memiliki divisi khusus (`Umum`) yang tidak mengotori statistik dashboard utama.
* **Aktor 2: Manajer Divisi (Division Admin):** Memiliki hak akses eksklusif yang dikunci hanya pada divisinya. Dapat menyetujui (approve) atau menolak anggota baru di divisinya, serta merancang dan mengelola kegiatan spesifik untuk divisinya saja.
* **Aktor 3: Anggota (Member):** Akses standar (*consumer*). Dapat melihat metrik partisipasinya di Dashboard, menelusuri katalog kegiatan yang sedang/akan berlangsung, dan mendaftarkan diri ke sebuah kegiatan.

## **3\. Kebutuhan Sistem (System Requirements)**

### **3.1 Kebutuhan Fungsional (Functional Requirements)**

| ID | Fitur | Deskripsi | Prioritas |
| :---- | :---- | :---- | :---- |
| **FR-01** | Autentikasi & Approval | Registrasi akun via Supabase Auth. Akun baru masuk ke status `Menunggu` dan tidak dapat login hingga disetujui Admin. | High |
| **FR-02** | Manajemen Anggota Lintas Divisi | Super Admin dapat mengatur seluruh anggota. Admin Divisi hanya dapat melihat/memodifikasi anggota divisinya. | High |
| **FR-03** | Manajemen Kegiatan & Status Real-Time | Admin dapat membuat kegiatan. Status kegiatan (`Akan Datang`, `Berlangsung`, `Selesai`) dihitung otomatis berdasarkan waktu saat ini. | High |
| **FR-04** | Konfirmasi Tindakan Keamanan | Pembatalan/penghapusan kegiatan secara permanen memerlukan *input text* manual dari nama kegiatan untuk mencegah *human error*. | Medium |
| **FR-05** | Integrasi Gemini AI | Sistem menyediakan tombol Generate AI untuk menyusun deskripsi kegiatan secara otomatis berdasarkan Judul & Divisi. | High |

### **3.2 Kebutuhan Non-Fungsional (Non-Functional Requirements)**

| ID | Kategori | Deskripsi / Parameter Kebutuhan | Metrik Target |
| :---- | :---- | :---- | :---- |
| **NFR-01** | *Security (Data Isolation)* | Sistem diwajibkan menggunakan PostgreSQL Row Level Security (RLS) untuk memblokir kueri API asing yang mencoba melintasi batas Divisi. | 100% Data Terisolasi |
| **NFR-02** | *Performance & UI/UX* | Aplikasi di-render menggunakan arsitektur Single Page Application (SPA) agar transisi halaman terjadi tanpa *reload*. | \< 500 ms / Navigasi |
| **NFR-03** | *Availability* | Menggunakan *Backend-as-a-Service* (BaaS) Supabase dan Vercel agar tidak perlu memelihara server fisik. | 99.9% Uptime |
| **NFR-04** | *Data Integrity* | Menghindari penggunaan tabel *junction* berlebih; menggunakan PostgreSQL `Array` untuk menyimpan referensi peserta kegiatan. | Efisiensi Kueri |

## **4\. Pemodelan Sistem (System Modeling)**

*Catatan: Seluruh diagram (UML, DFD, ERD, dan Activity Diagram) telah di-generate menggunakan format Mermaid Markdown dan dilampirkan secara terpisah di dalam folder repositori proyek `/.apsi-laporan`.*

1. **UML Use Case Diagram:** Memetakan hierarki aktor (*Inheritance* antara Super Admin -> Div Admin -> Member).  
2. **Activity Diagram:** Memetakan algoritma kalkulasi status acara *real-time* dan logika validasi konfirmasi hapus data.  
3. **Data Flow Diagram (DFD):** Memetakan Context Diagram (Level 0) dan Proses Utama (Level 1) termasuk aliran data ke API Gemini.
4. **Entity Relationship Diagram (ERD):** Relasi tabel `auth.users`, `profiles`, dan `events`.

## **5\. Arsitektur Informasi & User Flow**

Diagram aliran pengguna (User Flow) untuk alur pendaftaran, penahanan status `Menunggu`, proses approval oleh Admin, hingga berhasil login dapat dilihat pada dokumen lampiran Sequence Diagram di `/.apsi-laporan/userflow.md`.

## **6\. Teknologi yang Digunakan (Tech Stack)**

* **Frontend:** React 18, Vite (sebagai *Bundler*), TypeScript.
* **Styling & UI:** TailwindCSS, Lucide React (Ikon), Recharts (Visualisasi Data Dashboard).
* **Backend & Database:** Supabase (Backend-as-a-Service), PostgreSQL.
* **Keamanan Database:** PostgreSQL Row Level Security (RLS) & Database Triggers.
* **AI Integration:** Google GenAI SDK (`@google/genai`) terhubung ke model Gemini 1.5.
* **Tools:** Git, GitHub, Vercel (Frontend Hosting).

## **7\. Jadwal Implementasi (Roadmap)**

* **Tahap 1:** Analisis Kebutuhan (PRD), perancangan UI/UX, inisialisasi repositori Git dan Vite React.  
* **Tahap 2:** Setup Supabase Auth, perancangan skema database PostgreSQL, dan injeksi *trigger* untuk tabel profil.  
* **Tahap 3:** Pembuatan antarmuka Dashboard, Manajemen Anggota, dan Manajemen Kegiatan beserta manajemen *state* React.
* **Tahap 4:** Implementasi kebijakan keamanan RLS, penulisan fungsi otomatisasi status waktu, dan integrasi Google Gemini AI.
* **Tahap 5:** Penambahan *Safety Modals* (Dialog Konfirmasi), pengujian isolasi data antar divisi, *deployment* ke Vercel, dan penyelesaian pelaporan APSI.