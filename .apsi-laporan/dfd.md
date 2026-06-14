# Data Flow Diagram (DFD)

Dokumen ini memetakan aliran data dari entitas eksternal ke dalam sistem menggunakan pendekatan Data Flow Diagram yang divisualisasikan dengan flowchart.

## Level 0 (Context Diagram)

Menggambarkan sistem secara utuh dan interaksinya dengan entitas eksternal (pengguna dan layanan pihak ketiga).

```mermaid
flowchart TD
    %% Entitas Eksternal
    User["Anggota / Admin"]
    AI["Google Gemini API"]

    %% Proses Utama
    System(("0. Sistem RRM-RASG"))

    %% Aliran Data
    User -->|Data Profil, Form Kegiatan, Aksi Klik| System
    System -->|Tampilan UI, Data Tabel, Notifikasi| User
    
    System -->|Prompt Judul & Konteks Divisi| AI
    AI -->|Generated Teks Deskripsi| System
```

## Level 1 (Proses Utama)

Membelah sistem menjadi proses-proses logis yang lebih terperinci dan memperlihatkan interaksi dengan penyimpanan data (Data Store).

```mermaid
flowchart TD
    %% Entitas
    User["Anggota / Admin"]
    AI["Google Gemini API"]

    %% Data Stores
    DB_Profiles[(1. Data Profiles)]
    DB_Events[(2. Data Events)]

    %% Proses
    P1(("1. Manajemen Autentikasi"))
    P2(("2. Manajemen Anggota"))
    P3(("3. Manajemen Kegiatan"))
    P4(("4. Kalkulasi Status & Dashboard"))

    %% Interaksi User ke Proses
    User -->|Kredensial Email/Pass| P1
    User -->|Aksi Setujui/Tolak| P2
    User -->|Form Tambah/Edit Kegiatan| P3

    %% Interaksi Proses ke Data Store
    P1 -->|Insert Token & Profil| DB_Profiles
    DB_Profiles -->|Verifikasi JWT| P1

    P2 -->|Update Status / Role / Divisi| DB_Profiles
    DB_Profiles -->|List Anggota 'Menunggu'| P2

    P3 -->|Insert / Update / Delete| DB_Events
    P3 -->|Ambil Deskripsi| AI
    DB_Events -->|List Kegiatan| P3

    %% Proses ke Proses
    DB_Profiles -->|Data Total Anggota| P4
    DB_Events -->|Data Waktu Mulai & Selesai| P4

    %% Interaksi Proses ke User
    P1 -->|Akses Diterima/Ditolak| User
    P2 -->|Update Tabel Anggota| User
    P3 -->|Tampilan Detail Kegiatan| User
    P4 -->|Statistik Chart & Status Otomatis| User
```
