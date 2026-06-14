# UML Use Case Diagram

Diagram Use Case ini memetakan interaksi yang dapat dilakukan oleh tiga peran aktor (Member, Division Admin, Super Admin) ke dalam sistem.

```mermaid
flowchart LR
    %% Aktor
    Member(["🧑 Member"])
    DivAdmin(["🧑‍💼 Division Admin"])
    SuperAdmin(["🦸 Super Admin"])

    %% Sistem
    subgraph System ["RRM-RASG System"]
        direction TB
        UC1(["Daftar Akun"])
        UC2(["Lihat Dashboard"])
        UC3(["Gabung Kegiatan Terbuka"])
        UC4(["Buat/Edit Kegiatan Divisi"])
        UC5(["Kelola Approval Anggota Divisi"])
        UC6(["Generate Deskripsi via AI"])
        UC7(["Kelola Anggota Lintas Divisi"])
        UC8(["Kelola Kegiatan Lintas Divisi"])
    end

    %% Interaksi
    Member --> UC1
    Member --> UC2
    Member --> UC3

    DivAdmin --> UC2
    DivAdmin --> UC4
    DivAdmin --> UC5
    DivAdmin --> UC6

    SuperAdmin --> UC2
    SuperAdmin --> UC6
    SuperAdmin --> UC7
    SuperAdmin --> UC8
```

### Penjelasan Aktor
1. **Member**: Aktor pengguna dasar yang hanya mengkonsumsi layanan (bergabung ke kegiatan yang sudah dibuat oleh admin).
2. **Division Admin**: Aktor administratif menengah. Mereka mengelola ruang lingkup kecil (hanya wilayah divisi mereka sendiri).
3. **Super Admin**: Aktor dengan tingkat *privilege* tertinggi yang tidak dibatasi oleh aturan isolasi divisi. Memiliki hak penuh untuk Read, Update, Delete di semua sumber daya aplikasi.
