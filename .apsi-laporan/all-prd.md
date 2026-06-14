# Product Requirements Document (PRD)
**Project Name**: Rumah Amal Salman Garut (RRM-RASG) - Volunteer & Event Management System

## 1. Problem Statement
Organisasi kerelawanan dengan anggota yang banyak dan berbagai divisi membutuhkan cara sistematis untuk:
1. Mendata anggota yang aktif dan tidak aktif.
2. Membatasi wewenang pengelolaan data berdasarkan divisi masing-masing anggota.
3. Memudahkan anggota mendaftar kegiatan.
4. Memberikan otomatisasi dalam pemantauan status kegiatan.

## 2. Objectives
Sistem ini bertujuan untuk:
- Mengotomatisasi proses pendaftaran dan rekam jejak kegiatan setiap anggota.
- Menyediakan tingkat keamanan granular (Row Level Security) agar Admin Divisi hanya bisa mengelola anggotanya sendiri.
- Menyediakan Dashboard statistik bagi pimpinan organisasi untuk melihat total anggota, status keaktifan, dan sebaran kegiatan.

## 3. User Roles & RBAC Matrix
| Aktor / Peran | Deskripsi | Hak Akses Utama |
|--------------|-----------|-----------------|
| **Member** | Relawan biasa di suatu divisi. | - Dapat melihat kegiatan yang terbuka.<br>- Dapat mendaftar ("Gabung") ke kegiatan.<br>- Dapat melihat Dashboard ringkasan kegiatannya sendiri. |
| **Division Admin** | Admin satu divisi spesifik. | - Dapat menyetujui, menolak, atau menonaktifkan anggota **di divisinya saja**.<br>- Dapat membuat kegiatan untuk **divisinya saja**.<br>- Dapat membatalkan kegiatannya sendiri. |
| **Super Admin** | Pimpinan organisasi. | - Dapat mengelola seluruh anggota dan memindahkan divisi lintas batas.<br>- Dapat mengelola seluruh kegiatan lintas divisi. |

## 4. Functional Requirements
1. **Autentikasi**: Login dan Register menggunakan Supabase Auth. Pengguna baru otomatis berstatus `Menunggu`.
2. **Manajemen Anggota**: Admin divisi menyetujui anggota. Super Admin memegang kendali penuh.
3. **Manajemen Kegiatan**: Status kegiatan dikalkulasi otomatis (`Akan Datang`, `Berlangsung`, `Selesai`) berdasarkan waktu saat ini. 
4. **AI Assistant**: Penggunaan Google Gemini untuk meng-generate deskripsi acara.
5. **Konfirmasi Keamanan**: Konfirmasi berbasis pengetikan nama acara saat membatalkan/menghapus acara secara permanen.

## 5. Non-Functional Requirements
1. **Keamanan**: Wajib menggunakan PostgreSQL Row Level Security (RLS) untuk melindungi akses modifikasi di luar lingkup divisi.
2. **Kinerja**: Sistem berbasis React Single Page Application (SPA).
3. **Infrastruktur**: Sepenuhnya di-host secara serverless menggunakan Vercel (Frontend) dan Supabase (Backend).
