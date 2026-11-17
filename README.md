# SIM-TLHP – Inspektorat Daerah Kabupaten Kupang
Next.js 14 + Tailwind CSS + Supabase (project `SIM_TLHP_IRDA`).

## Menjalankan
1. `npm install`
2. Isi `SUPABASE_SERVICE_ROLE_KEY` di `.env.local` (Supabase > Project Settings > API > service_role). Hanya dipakai server di `app/api/login/route.js` untuk mengubah username menjadi email. Jangan dibagikan atau di-commit.
3. `npm run dev` lalu buka http://localhost:3000

## Struktur
- `/` landing + login
- `/dashboard` ringkasan (admin: semua Irban, Irban: hanya miliknya, dibatasi RLS Supabase)
- `/dashboard/irban/[no]` kelola obrik, LHP, rekomendasi; ekspor .csv; cetak KOP

## Sebelum produksi
- Hapus kotak "Akun Demo" di `app/page.js` dan ganti password akun demo.
- Tambahkan pembatasan percobaan login (rate limit) pada `/api/login`.
