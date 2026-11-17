"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const I = {
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0",
  lock: "M7 11V8a5 5 0 0110 0v3M5 11h14v9H5z",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z",
  check: "M5 12l5 5 9-10",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  print: "M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z",
  sheet: "M4 4h16v16H4zM4 10h16M10 4v16",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  bld: "M5 21V4h10v17M15 9h4v12M9 8h2M9 12h2M9 16h2",
  wallet: "M4 7h14a2 2 0 012 2v9a2 2 0 01-2 2H4zM4 7l12-3v3M16 14h2",
  alert: "M12 4l9 16H3zM12 10v4M12 17v.5",
  mail: "M3 6h18v12H3zM3 7l9 7 9-7",
  pin: "M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
};
const Ic = ({ n, c = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={I[n]} />
  </svg>
);

const demo = [
  ["admin / adminTLHP25", "Akses penuh Irban 1–4"],
  ["irban1 / irban1at25", "Irban 1 saja"],
  ["irban2 / irban2at25", "Irban 2 saja"],
  ["irban3 / irban3at25", "Irban 3 saja"],
];

function Brand({ dark = true }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white p-1.5 shadow-lg">
        <img src="/logo.png" alt="Logo Kabupaten Kupang" className="h-full w-full object-contain" />
      </div>
      <div className={`leading-tight ${dark ? "text-white" : "text-ink"}`}>
        <p className="text-xl font-extrabold tracking-tight">SIM-TLHP</p>
        <p className="text-[13px] opacity-80">Inspektorat Daerah<br />Kabupaten Kupang</p>
      </div>
    </div>
  );
}

function Nav() {
  const links = [["Fitur", "#fitur"], ["Dashboard", "#dashboard"], ["Alur Kerja", "#alur"], ["Modul Irban", "#irban"], ["Kontak", "#kontak"]];
  return (
    <header className="sticky top-3 z-40 mx-auto mt-3 flex max-w-[1240px] items-center justify-between rounded-full bg-paper/85 px-3 py-2 shadow-sm backdrop-blur-md sm:px-4">
      <a href="#" className="flex items-center gap-2.5 font-extrabold tracking-tight">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white p-1 shadow"><img src="/logo.png" alt="" className="h-full w-full object-contain" /></span>
        SIM-TLHP
      </a>
      <nav className="hidden gap-1 md:flex">
        {links.map(([t, h]) => (
          <a key={t} href={h} className="rounded-full px-4 py-2 text-sm font-medium text-ink/70 transition hover:bg-ink hover:text-white">{t}</a>
        ))}
      </nav>
      <a href="#masuk" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black active:scale-95">Masuk</a>
    </header>
  );
}

function Login() {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [u, setU] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setMsg("");
    try {
      const res = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: u, password: pw }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Gagal masuk.");
      const { error } = await supabase.auth.setSession(j.session);
      if (error) throw error;
      router.push("/dashboard");
    } catch (err) { setMsg(err.message); setBusy(false); }
  }
  return (
    <section id="masuk" className="animate-rise rounded-card bg-paper p-7 shadow-[0_30px_60px_-30px_rgba(40,60,10,.35)] sm:p-11" style={{ animationDelay: ".15s" }}>
      <h2 className="text-[34px] font-extrabold leading-none sm:text-4xl">Masuk ke Dashboard</h2>
      <p className="mt-3 text-[15px] text-ink/55">Gunakan username Irban atau Admin yang terdaftar.</p>
      <form className="mt-9 space-y-5" onSubmit={submit}>
        <label className="block">
          <span className="text-[13px] font-semibold uppercase tracking-wide">Username</span>
          <span className="mt-2 flex items-center gap-3 rounded-2xl bg-mist px-4 py-4 text-ink/45 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-ink">
            <Ic n="user" />
            <input required value={u} onChange={(e) => setU(e.target.value)} autoComplete="username" placeholder="mis. admin, irban1" className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink/40" />
          </span>
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold uppercase tracking-wide">Password</span>
          <span className="mt-2 flex items-center gap-3 rounded-2xl bg-mist px-4 py-4 text-ink/45 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-ink">
            <Ic n="lock" />
            <input required value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" type={show ? "text" : "password"} placeholder="••••••••" className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink/40" />
            <button type="button" onClick={() => setShow(!show)} aria-label="Tampilkan password" className="transition hover:text-ink"><Ic n="eye" /></button>
          </span>
        </label>
        <button disabled={busy} className="w-full rounded-2xl bg-ink py-4 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:shadow-xl active:scale-[.98] disabled:opacity-60">{busy ? "Memeriksa…" : "Masuk Sekarang"}</button>
        {msg && <p role="alert" className="text-center text-sm font-semibold text-[#c2391d]">{msg}</p>}
      </form>
      <div className="mt-8 rounded-3xl border border-ink/5 bg-mist/60 p-4">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-wide">Akun Demo</p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {demo.map(([a, b]) => (
            <div key={a} className="rounded-xl border border-ink/5 bg-white px-3.5 py-3 transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-[13px] font-bold">{a}</p>
              <p className="text-[13px] text-ink/50">{b}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-6 text-center text-[13px] leading-relaxed text-ink/45">Dikelola oleh Inspektorat Daerah Kabupaten Kupang • Aman dengan Supabase</p>
    </section>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-[1240px] gap-5 px-3 pt-5 lg:grid-cols-[1.22fr_1fr] lg:gap-6">
      <div className="animate-rise relative flex min-h-[640px] flex-col overflow-hidden rounded-card bg-ink p-7 text-white sm:p-11 lg:min-h-[780px]">
        <img src="/kantor.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/45 to-ink/95" />
        <div className="relative flex flex-1 flex-col">
          <Brand />
          <h1 className="mt-14 max-w-[560px] text-[44px] font-extrabold leading-[0.98] sm:text-[58px] lg:mt-20">
            Tindak Lanjut <span className="text-lime">Hasil Pemeriksaan</span> Terintegrasi
          </h1>
          <p className="mt-7 max-w-[520px] text-[17px] font-medium leading-relaxed text-white/85">
            Sistem Informasi Manajemen TLHP Inspektorat Daerah Kabupaten Kupang untuk pemantauan Administrasi dan Materil secara real-time, lengkap dengan cetak KOP surat dan ekspor Excel.
          </p>
          <div className="mt-auto grid gap-4 pt-12 sm:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition hover:-translate-y-1">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-white/60">Irban Aktif</p>
              <p className="mt-2 text-[28px] font-extrabold tracking-tight">4 Wilayah</p>
              <div className="mt-4 flex gap-2">
                {["bg-lime", "bg-lilac", "bg-white/25", "bg-white/25"].map((c, i) => (
                  <span key={i} className={`h-1.5 flex-1 origin-left animate-fill rounded-full ${c}`} style={{ animationDelay: `${0.5 + i * 0.12}s` }} />
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-lime p-5 text-ink transition hover:-translate-y-1">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-ink/60">Fitur Unggulan</p>
              <ul className="mt-3 space-y-2.5">
                {["Pemantauan TLHP", "Cetak KOP Surat", "Ekspor Excel"].map((t) => (
                  <li key={t} className="flex items-center gap-3 font-semibold">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-lime"><Ic n="check" c="h-3.5 w-3.5" /></span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-10 text-center text-[13px] text-white/70">© 2026 Inspektorat Daerah Kabupaten Kupang • NTT</p>
        </div>
      </div>
      <Login />
    </section>
  );
}

const features = [
  ["doc", "Pemantauan Administrasi & Materil", "Catat temuan, rekomendasi, dan status tindak lanjut tiap LHP dalam satu tempat, tanpa rekap manual."],
  ["print", "Cetak KOP Surat", "Surat tindak lanjut tercetak otomatis dengan KOP resmi Inspektorat Daerah Kabupaten Kupang."],
  ["sheet", "Ekspor Excel", "Unduh data per Irban, per tahun, atau per status untuk bahan rapat dan pelaporan."],
  ["shield", "Hak Akses per Irban", "Setiap Irban hanya melihat datanya sendiri. Admin memantau seluruh wilayah."],
];

function Features() {
  return (
    <section id="fitur" className="mx-auto max-w-[1240px] scroll-mt-24 px-3 pt-24">
      <div className="max-w-2xl">
        <h2 className="text-4xl font-extrabold leading-[1.02] sm:text-5xl">Semua yang dibutuhkan untuk menuntaskan rekomendasi.</h2>
        <p className="mt-5 text-lg text-ink/60">Dari pencatatan LHP sampai laporan akhir, satu sistem untuk seluruh Irban.</p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {features.map(([ic, t, d], i) => (
          <article key={t} className={`group rounded-[32px] p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${i === 1 ? "bg-lime" : i === 2 ? "bg-ink text-white" : "bg-paper"}`}>
            <span className={`grid h-12 w-12 place-items-center rounded-2xl transition group-hover:rotate-6 ${i === 2 ? "bg-white/10 text-lime" : i === 1 ? "bg-ink text-lime" : "bg-ink text-white"}`}><Ic n={ic} /></span>
            <h3 className="mt-16 text-xl font-bold leading-tight">{t}</h3>
            <p className={`mt-3 text-[15px] leading-relaxed ${i === 2 ? "text-white/65" : "text-ink/60"}`}>{d}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Stat({ icon, label, val, note, tone, red }) {
  return (
    <div className="rounded-[28px] bg-paper p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-bold uppercase tracking-wide text-ink/70">{label}</p>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Ic n={icon} c="h-5 w-5" /></span>
      </div>
      <p className={`mt-4 text-4xl font-extrabold ${red ? "text-[#c2391d]" : ""}`}>{val}</p>
      <p className="mt-1 text-sm text-ink/55">{note}</p>
    </div>
  );
}

function Dashboard() {
  const menu = ["Irban 1", "Irban 2", "Irban 3", "Irban 4"];
  return (
    <section id="dashboard" className="mx-auto max-w-[1240px] scroll-mt-24 px-3 pt-24">
      <div className="max-w-2xl">
        <h2 className="text-4xl font-extrabold leading-[1.02] sm:text-5xl">Ringkasan temuan dan setoran, langsung di halaman depan.</h2>
        <p className="mt-5 text-lg text-ink/60">Pimpinan melihat posisi terbaru tanpa menunggu rekap bulanan.</p>
      </div>
      <div className="mt-12 grid overflow-hidden rounded-card bg-ink p-2 shadow-2xl lg:grid-cols-[250px_1fr]">
        <aside className="hidden flex-col p-5 text-white lg:flex">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white p-1"><img src="/logo.png" alt="" className="h-full w-full object-contain" /></span>
            <div className="leading-tight"><p className="text-sm font-bold">Pemerintah Kab. Kupang</p><p className="text-[11px] tracking-wide text-white/50">INSPEKTORAT DAERAH</p></div>
          </div>
          <p className="mt-8 text-[11px] font-semibold tracking-[.15em] text-white/40">MENU UTAMA</p>
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white px-3 py-3 font-semibold text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-white"><Ic n="grid" c="h-4 w-4" /></span>Dashboard<span className="ml-auto h-2 w-2 rounded-full bg-lime" />
          </div>
          <p className="mt-7 text-[11px] font-semibold tracking-[.15em] text-white/40">MODUL TLHP — IRBAN</p>
          <ul className="mt-3 space-y-1.5">
            {menu.map((m) => (
              <li key={m} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-white/80 transition hover:bg-white/5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10"><Ic n="bld" c="h-4 w-4" /></span>{m}<span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white/5 p-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-lime font-bold text-ink">A</span>
            <div className="leading-tight"><p className="font-semibold">admin</p><p className="text-[11px] text-white/50">ADMINISTRATOR</p></div>
          </div>
        </aside>
        <div className="stripes rounded-[34px] bg-gradient-to-br from-[#eef2e3] to-[#cfdcae] p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-3xl font-extrabold">Dashboard</p><p className="text-sm text-ink/55">Dashboard</p></div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase text-white">Administrator</span>
              <span className="hidden items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-sm font-semibold sm:flex"><span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[11px] text-lime">AI</span>Admin Inspektorat</span>
            </div>
          </div>
          <div className="mt-6 rounded-[30px] bg-white/40 p-6 sm:p-8">
            <span className="rounded-full bg-paper px-4 py-2 text-[12px] font-bold uppercase">Administrator • Akses seluruh Irban</span>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-3xl font-extrabold sm:text-5xl">Selamat datang, Administrator</p><p className="mt-2 text-ink/60">Ringkasan Monitoring Tindak Lanjut Hasil Pemeriksaan • Senin, 16 November 2026</p></div>
              <span className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white">Semua Tahun</span>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat icon="bld" label="Total Obrik" val="9" note="Objek pemeriksaan terdaftar" tone="bg-emerald-100 text-emerald-700" />
            <Stat icon="doc" label="Total LHP" val="11" note="Laporan hasil pemeriksaan" tone="bg-indigo-100 text-indigo-600" />
            <Stat icon="check" label="Total Rekomendasi" val="17" note="7 sudah • 10 belum" tone="bg-ink text-white" />
            <Stat icon="alert" label="Belum Ditindaklanjuti" val="10" note="Perlu perhatian lebih lanjut" tone="bg-red-100 text-red-600" red />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[28px] bg-paper p-5">
            <div className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-violet-600"><Ic n="wallet" /></span>
              <div><p className="font-bold">Posisi Keuangan Kerugian (Materil)</p><p className="text-sm text-ink/55">Akumulasi nilai temuan, setoran, dan sisa tunggakan</p></div></div>
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">35.3% TERSETOR</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  ["Input LHP", "Irban mencatat laporan, obrik, temuan, dan rekomendasi."],
  ["Tindak lanjut", "Obrik menyampaikan bukti tindak lanjut dan setoran kerugian."],
  ["Verifikasi", "Irban memeriksa dan memperbarui status tiap rekomendasi."],
  ["Laporan", "Admin mencetak surat ber-KOP dan mengekspor rekap ke Excel."],
];

function Flow() {
  return (
    <section id="alur" className="mx-auto max-w-[1240px] scroll-mt-24 px-3 pt-24">
      <div className="rounded-card bg-paper p-8 sm:p-14">
        <h2 className="max-w-xl text-4xl font-extrabold leading-[1.02] sm:text-5xl">Empat langkah dari temuan sampai tuntas.</h2>
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {steps.map(([t, d], i) => (
            <li key={t} className="group rounded-3xl bg-mist p-6 transition duration-300 hover:-translate-y-1 hover:bg-lime">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-ink font-bold text-white">{i + 1}</span>
              <h3 className="mt-8 text-lg font-bold">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/60 group-hover:text-ink/75">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Irban() {
  return (
    <section id="irban" className="mx-auto max-w-[1240px] scroll-mt-24 px-3 pt-24">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-card bg-ink p-8 text-white sm:p-12">
          <h2 className="text-4xl font-extrabold leading-[1.02] sm:text-5xl">Empat Irban, satu sumber data.</h2>
          <p className="mt-5 text-white/65">Akses dipisah per wilayah pengawasan. Admin melihat semuanya, tiap Irban fokus pada obriknya.</p>
          <a href="#masuk" className="mt-9 inline-block rounded-full bg-lime px-7 py-3.5 font-bold text-ink transition hover:-translate-y-0.5 hover:shadow-xl active:scale-95">Masuk ke Dashboard</a>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {["Irban 1", "Irban 2", "Irban 3", "Irban 4"].map((n, i) => (
            <div key={n} className="flex min-h-[170px] flex-col justify-between rounded-[32px] bg-paper p-7 transition hover:-translate-y-1.5 hover:shadow-2xl">
              <span className={`h-2 w-16 rounded-full ${["bg-lime", "bg-lilac", "bg-ink/25", "bg-ink/25"][i]}`} />
              <div><p className="text-2xl font-extrabold">{n}</p><p className="text-sm text-ink/55">Modul TLHP wilayah pengawasan {i + 1}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const rows = [["pin", "Inspektorat Daerah Kabupaten Kupang, Nusa Tenggara Timur"], ["clock", "Senin – Jumat, jam kerja pemerintahan"], ["mail", "Hubungi admin SIM-TLHP untuk pendaftaran akun Irban"]];
  return (
    <section id="kontak" className="mx-auto max-w-[1240px] scroll-mt-24 px-3 pt-24">
      <div className="grid gap-8 rounded-card bg-lime p-8 sm:p-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <h2 className="text-4xl font-extrabold leading-[1.02] sm:text-5xl">Butuh akun atau pendampingan penggunaan?</h2>
          <p className="mt-5 max-w-lg text-lg text-ink/70">Tim kami membantu pendaftaran akun Irban, pelatihan singkat, dan penyesuaian format laporan.</p>
          <a href="#masuk" className="mt-8 inline-block rounded-full bg-ink px-8 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-xl active:scale-95">Masuk Sekarang</a>
        </div>
        <ul className="space-y-3">
          {rows.map(([ic, t]) => (
            <li key={t} className="flex items-center gap-4 rounded-3xl bg-white/60 p-4 font-medium backdrop-blur transition hover:bg-white">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-lime"><Ic n={ic} /></span>{t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto mt-16 max-w-[1240px] px-3 pb-8">
      <div className="flex flex-col items-center justify-between gap-4 rounded-[32px] bg-ink px-8 py-7 text-white md:flex-row">
        <Brand />
        <p className="text-center text-[13px] text-white/60">© 2026 Inspektorat Daerah Kabupaten Kupang • NTT<br className="sm:hidden" /> Dikelola dengan aman menggunakan Supabase</p>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <main>
      <Nav />
      <Hero />
      <Features />
      <Dashboard />
      <Flow />
      <Irban />
      <Contact />
      <Footer />
    </main>
  );
}
