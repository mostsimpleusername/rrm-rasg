# Entity Relationship Diagram (ERD) & Data Dictionary

Dokumen ini memaparkan struktur tabel dan relasinya dalam basis data PostgreSQL.

## 1. Entity Relationship Diagram (ERD)

Sistem menggunakan skema autentikasi internal (`auth.users`) yang terikat kuat (tightly coupled) dengan skema aplikasi (`public.profiles` dan `public.events`).

```mermaid
erDiagram
    %% Tabel Auth Users (Supabase Core)
    AUTH_USERS {
        uuid id PK
        string email
        string encrypted_password
        timestamp created_at
    }

    %% Tabel Profiles (Aplikasi)
    PROFILES {
        uuid id PK, FK
        string email
        string name
        string role "ENUM: super_admin, division_admin, member"
        string division "ENUM: Umum, HR, Ristek, Kesehatan, dll"
        string status "ENUM: Menunggu, Aktif, Nonaktif"
        timestamp join_date
    }

    %% Tabel Events (Aplikasi)
    EVENTS {
        uuid id PK
        string title
        text description
        date event_date
        time event_time
        string location
        string division
        string status "ENUM: Akan Datang, Berlangsung, Selesai, Dibatalkan"
        int max_participants
        uuid created_by FK
        uuid[] attendees "Array of Profile IDs"
    }

    %% Definisi Relasi
    AUTH_USERS ||--|| PROFILES : "1 to 1 (Via Database Trigger)"
    PROFILES ||--o{ EVENTS : "1 to N (Creator)"
    EVENTS }o--o{ PROFILES : "M to N (Attendees via Array Column)"
```

## 2. Kamus Data (Data Dictionary)

### Tabel `profiles`
Merupakan tabel utama pengguna aplikasi. Baris data dibuat secara otomatis saat pengguna mendaftar melalui sistem Auth.
- **`id`** (`uuid`, Primary Key): Foreign key 1-to-1 ke `auth.users.id`.
- **`email`** (`text`): Email pengguna (diambil dari Auth).
- **`name`** (`text`): Nama pengguna.
- **`role`** (`text`): Peran pengguna. Digunakan untuk menentukan batasan akses di frontend dan database RLS. (Default: `member`).
- **`division`** (`text`): Divisi tempat anggota bergabung. Digunakan untuk memfilter UI dan keamanan data. (Default: `Umum`).
- **`status`** (`text`): Menentukan apakah pengguna diizinkan masuk ke dalam aplikasi. (Default: `Menunggu`).

### Tabel `events`
Menyimpan jadwal dan informasi kegiatan.
- **`id`** (`uuid`, Primary Key): Identifier unik kegiatan.
- **`title`**, **`description`**, **`location`**: Informasi dasar. Deskripsi bisa di-generate otomatis via AI.
- **`event_date`**, **`event_time`**: Waktu mulainya kegiatan.
- **`division`** (`text`): Penanda wilayah kegiatan. Hanya `division_admin` di divisi ini (atau `super_admin`) yang bisa memodifikasi baris ini.
- **`status`** (`text`): Status kegiatan. Hanya untuk flag "Dibatalkan". Status lain dikalkulasi *on-the-fly* di sisi *client*.
- **`created_by`** (`uuid`): Referensi profil si pembuat acara.
- **`attendees`** (`uuid[]`): Menggunakan tipe data Array native PostgreSQL untuk menyimpan daftar peserta, menghindari kerumitan pembuatan tabel persimpangan (junction table).
