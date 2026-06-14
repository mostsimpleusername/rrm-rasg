# Activity Diagrams

Dokumen ini memodelkan algoritma percabangan kondisi (conditional branching) menggunakan UML Activity Diagram.

## Kalkulasi Status Kegiatan (Event Status Calculation)

Aplikasi tidak mengizinkan Admin untuk memilih status kegiatan dari dropdown (misal: Selesai, Berlangsung). Semua dikalkulasi otomatis oleh sistem *Frontend* berdasarkan waktu aktual.

```mermaid
flowchart TD
    Start((Mulai Render UI)) --> AmbilData[Ambil Data Waktu Kegiatan dari DB]
    AmbilData --> CekBatal{"Status == Dibatalkan?"}
    
    CekBatal -- Ya --> SetBatal[Status Akhir = Dibatalkan]
    CekBatal -- Tidak --> ParseTime[Ubah String Waktu ke Objek Date/Time]
    
    ParseTime --> HitungDurasi[Hitung Waktu Selesai: Mulai + 3 Jam]
    HitungDurasi --> AmbilSekarang[Dapatkan Waktu Server/Klien Sekarang]
    
    AmbilSekarang --> CekBelumMulai{"Sekarang Lebih Awal dari Mulai?"}
    CekBelumMulai -- Ya --> SetAkanDatang[Status = Akan Datang]
    
    CekBelumMulai -- Tidak --> CekBerlangsung{"Sekarang Belum Lewati Selesai?"}
    CekBerlangsung -- Ya --> SetBerlangsung[Status = Berlangsung]
    
    CekBerlangsung -- Tidak --> SetSelesai[Status = Selesai]
    
    SetBatal --> RenderUI
    SetAkanDatang --> RenderUI
    SetBerlangsung --> RenderUI
    SetSelesai --> RenderUI
    
    RenderUI[Render Badge Status di Layar] --> End((Selesai))
```

### Logika Konfirmasi Pembatalan (Cancellation Confirmation)

Ketika Admin mencoba membatalkan kegiatan, sistem meminta tingkat pengamanan ekstra untuk mencegah salah klik (*accidental click*).

```mermaid
flowchart TD
    Start((Klik Batalkan)) --> TampilModal[Tampilkan Modal Konfirmasi]
    TampilModal --> KunciTombol[Kunci Tombol Hapus - Disabled]
    KunciTombol --> TungguInput[Tunggu Input Ketikan dari Admin]
    
    TungguInput --> CekInput{"Input Sesuai Nama Kegiatan?"}
    CekInput -- Belum Sesuai --> KunciTombol
    CekInput -- Sesuai --> BukaTombol[Buka Kunci Tombol Hapus - Enabled]
    
    BukaTombol --> TungguKlik{"Admin Klik Hapus?"}
    TungguKlik -- Batal --> TutupModal[Tutup Modal]
    TungguKlik -- Ya --> UpdateDB[Kirim Request: UPDATE status='Dibatalkan']
    
    UpdateDB --> TutupModal
    TutupModal --> End((Selesai))
```
