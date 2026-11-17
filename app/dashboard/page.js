"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { loadAll, summarize } from "@/lib/data";
import { rupiah } from "@/lib/format";

function Stat({ label, val, note, tone, red }) {
  return (
    <div className="rounded-[28px] bg-paper p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12px] font-bold uppercase tracking-wide text-ink/70">{label}</p>
        <span className={`h-9 w-9 shrink-0 rounded-xl ${tone}`} />
      </div>
      <p className={`mt-4 text-4xl font-extrabold ${red ? "text-[#c2391d]" : ""}`}>{val}</p>
      <p className="mt-1 text-sm text-ink/55">{note}</p>
    </div>
  );
}

export default function Overview() {
  const { profile, role } = useAuth();
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  const [tahun, setTahun] = useState("all");

  useEffect(() => { loadAll().then(setD).catch((e) => setErr(e.message)); }, []);
  const s = useMemo(() => (d ? summarize(d, tahun) : null), [d, tahun]);
  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const nama = role === "admin" ? "Administrator" : profile?.nama || profile?.username;

  if (err) return <p role="alert" className="rounded-2xl bg-red-100 p-4 font-medium text-red-700">Gagal memuat data: {err}</p>;
  if (!s) return <p className="text-ink/60">Memuat data…</p>;

  const perIrban = [1, 2, 3, 4].map((n) => {
    const ob = d.obrik.filter((o) => o.irban_no === n && (tahun === "all" || o.tahun_id === tahun));
    const ids = new Set(ob.map((o) => o.id));
    const lh = d.lhps.filter((l) => ids.has(l.obrik_id));
    const lids = new Set(lh.map((l) => l.id));
    const rk = d.rek.filter((r) => lids.has(r.lhp_id));
    return { n, obrik: ob.length, lhp: lh.length, rek: rk.length, belum: rk.filter((r) => r.status === "belum").length };
  }).filter((r) => role === "admin" || r.n === profile?.irban_no);

  return (
    <div className="space-y-5">
      <section className="rounded-[30px] bg-white/45 p-6 sm:p-8">
        <span className="rounded-full bg-paper px-4 py-2 text-[12px] font-bold uppercase">{role === "admin" ? "Administrator • Akses seluruh Irban" : `Irban ${profile?.irban_no}`}</span>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-5xl">Selamat datang, {nama}</h2>
            <p className="mt-2 text-ink/60">Ringkasan Monitoring Tindak Lanjut Hasil Pemeriksaan • {today}</p>
          </div>
          <select value={tahun} onChange={(e) => setTahun(e.target.value)} aria-label="Filter tahun" className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white outline-none transition hover:-translate-y-0.5">
            <option value="all">Semua Tahun</option>
            {d.tahun.map((t) => <option key={t.id} value={t.id}>{t.tahun}</option>)}
          </select>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total Obrik" val={s.ob.length} note="Objek pemeriksaan terdaftar" tone="bg-emerald-200" />
        <Stat label="Total LHP" val={s.lh.length} note="Laporan hasil pemeriksaan" tone="bg-indigo-200" />
        <Stat label="Total Rekomendasi" val={s.rk.length} note={`${s.sudah} sudah • ${s.belum} belum`} tone="bg-ink" />
        <Stat label="Belum Ditindaklanjuti" val={s.belum} note="Perlu perhatian lebih lanjut" tone="bg-red-200" red />
      </div>

      <section className="rounded-[30px] bg-paper p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h3 className="text-xl font-bold">Posisi Keuangan Kerugian (Materil)</h3><p className="text-sm text-ink/55">Akumulasi nilai temuan, setoran, dan sisa tunggakan</p></div>
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">{s.pct.toFixed(1)}% TERSETOR</span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-mist p-4"><p className="text-xs font-bold uppercase text-ink/60">Nilai Temuan</p><p className="mt-1 text-2xl font-extrabold">{rupiah(s.nilai)}</p></div>
          <div className="rounded-2xl bg-emerald-50 p-4"><p className="text-xs font-bold uppercase text-emerald-700">Setoran</p><p className="mt-1 text-2xl font-extrabold">{rupiah(s.setoran)}</p></div>
          <div className="rounded-2xl bg-red-50 p-4"><p className="text-xs font-bold uppercase text-red-600">Sisa Tunggakan</p><p className="mt-1 text-2xl font-extrabold">{rupiah(s.sisa)}</p></div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-mist"><div className="h-full rounded-full bg-lime transition-all duration-700" style={{ width: `${Math.min(100, s.pct)}%` }} /></div>
      </section>

      <section className="overflow-x-auto rounded-[30px] bg-paper p-6">
        <h3 className="text-xl font-bold">Per Irban</h3>
        <table className="mt-4 w-full min-w-[520px] text-left text-[15px]">
          <thead className="text-xs uppercase text-ink/50"><tr><th className="pb-3">Irban</th><th>Obrik</th><th>LHP</th><th>Rekomendasi</th><th>Belum</th><th /></tr></thead>
          <tbody>
            {perIrban.map((r) => (
              <tr key={r.n} className="border-t border-ink/5">
                <td className="py-3 font-bold">Irban {r.n}</td><td>{r.obrik}</td><td>{r.lhp}</td><td>{r.rek}</td>
                <td className={r.belum ? "font-bold text-[#c2391d]" : ""}>{r.belum}</td>
                <td className="text-right"><Link href={`/dashboard/irban/${r.n}`} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5">Buka</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
