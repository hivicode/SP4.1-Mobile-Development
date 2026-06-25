# P12 Notes Supabase

Aplikasi Expo sederhana untuk tugas CRUD catatan dengan Supabase Auth dan RLS.

## Setup Supabase

1. Buat project baru di Supabase.
2. Buka SQL Editor, jalankan isi file `supabase/schema.sql`.
3. Buka Project Settings > API, salin Project URL dan anon/publishable key.
4. Salin `.env.example` menjadi `.env.local`, lalu isi:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

Jika materi kelas memakai nama `EXPO_PUBLIC_SUPABASE_KEY`, nama itu juga didukung.

## Jalankan

```bash
npm install
npm start
```

Fitur:

- Register dan login dengan Supabase Auth.
- Tambah catatan.
- Lihat daftar catatan milik user login.
- Ubah catatan.
- Hapus catatan.
- RLS memastikan user hanya bisa mengakses catatannya sendiri.
