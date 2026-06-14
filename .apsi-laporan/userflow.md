# User Flow & Sequence Diagrams

Dokumen ini menunjukkan bagaimana perjalanan alur (flow) seorang pengguna dari mulai pendaftaran hingga akhirnya bisa login ke dalam sistem.

## Alur Pendaftaran & Persetujuan (Registration & Approval Flow)

Karena alasan keamanan dan eksklusivitas keanggotaan, setiap pengguna yang baru mendaftar tidak bisa langsung masuk ke dalam aplikasi. Mereka akan ditahan dengan status `Menunggu` sampai seorang Admin menyetujuinya.

```mermaid
sequenceDiagram
    autonumber
    
    actor U as Pengguna Baru
    participant Frontend as React UI
    participant Auth as Supabase Auth
    participant DB as DB (profiles)
    actor A as Admin

    U->>Frontend: Mengisi form Register (Email, Password, Nama)
    Frontend->>Auth: POST /signup
    Auth-->>Frontend: Akun dibuat (auth.users)
    
    %% Otomatisasi Database
    Note over Auth, DB: Trigger "handle_new_user" berjalan otomatis di server
    Auth->>DB: INSERT INTO profiles (status = 'Menunggu')
    
    U->>Frontend: Mencoba Login
    Frontend->>Auth: POST /login
    Auth-->>Frontend: Token JWT diberikan
    Frontend->>DB: GET /profiles (cek status akun)
    DB-->>Frontend: status: 'Menunggu'
    Frontend-->>U: Error UI: "Akun Menunggu Persetujuan Admin"
    
    %% Proses Persetujuan Admin
    A->>Frontend: Membuka Menu "Manajemen Anggota"
    Frontend->>DB: Fetch list of 'Menunggu' users
    DB-->>Frontend: Mengembalikan data pengguna
    A->>Frontend: Klik "Setujui", Atur Peran & Divisi
    Frontend->>DB: UPDATE profiles SET status='Aktif'
    
    %% Kesuksesan Login
    U->>Frontend: Mencoba Login Ulang
    Frontend->>DB: GET /profiles
    DB-->>Frontend: status: 'Aktif'
    Frontend-->>U: Diarahkan ke Dashboard Utama
```

### Keterangan Langkah
1. **Langkah 1-3**: Pengguna mendaftar secara standar.
2. **Langkah 4**: Bagian terpenting dari arsitektur backend, di mana *database trigger* mengintersepsi pembuatan akun dan menyiapkan profil default.
3. **Langkah 5-8**: Lapisan pertahanan sistem. Meskipun *Authentication* berhasil, *Authorization* ditolak oleh aplikasi karena status masih `Menunggu`.
4. **Langkah 9-15**: Setelah campur tangan manusia (Admin) mengubah status di basis data, jalur login akan sepenuhnya terbuka.
