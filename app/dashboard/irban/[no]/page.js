"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { rupiah, tgl } from "@/lib/format";

const inp = "w-full rounded-xl bg-mist px-3 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-ink";

function AddForm({ label, fields, onSubmit }) {
  return (
    <details className="group no-print rounded-2xl bg-mist/70 p-1 open:bg-mist">
      <summary className="cursor-pointer list-none rounded-xl px-4 py-2.5 text-sm font-bold transition hover:bg-white">+ {label}</summary>
      <form
        className="grid gap-3 p-3 sm:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = e.currentTarget;
          const ok = await onSubmit(Object.fromEntries(new FormData(f)));
          if (ok) f.reset();
        }}
      >
        {fields.map(([name, ph, type = "text", opts]) => (
          <label key={name} className={`text-[12px] font-semibold ${type === "textarea" ? "sm:col-span-2" : ""}`}>
            {ph}
            {type === "textarea" ? <textarea name={name} rows={2} required={name === "uraian"} className={`${inp} mt-1`} />
              : type === "select" ? <select name={name} className={`${inp} mt-1`}>{opts.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select>
              : <input name={name} type={type} required={type !== "number"} min={type === "number" ? 0 : undefined} step={type === "number" ? "any" : undefined} className={`${inp} mt-1`} />}
          </label>
        ))}
        <button className="rounded-xl bg-ink py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 sm:col-span-2">Simpan</button>
      </form>
    </details>
  );
}

export default function IrbanPage() {
  const { no } = useParams();
  const n = Number(no);
  const router = useRouter();
  const { profile, role } = useAuth();
  const [tahun, setTahun] = useState([]);
  const [sel, setSel] = useState("");
  const [jenis, setJenis] = useState("administrasi");
  const [obrik, setObrik] = useState([]);
  const [lhps, setLhps] = useState([]);
  const [rek, setRek] = useState([]);
  const [err, setErr] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (role && role !== "admin" && profile?.irban_no !== n) router.replace("/dashboard");
  }, [role, profile, n, router]);

  const load = useCallback(async () => {
    const t = await supabase.from("tahun_anggaran").select("id,tahun").order("tahun", { ascending: false });
    const o = await supabase.from("obrik").select("*").eq("irban_no", n).order("created_at");
    if (t.error || o.error) return setErr((t.error || o.error).message);
    const ids = o.data.map((x) => x.id);
    const l = ids.length ? await supabase.from("lhps").select("*").in("obrik_id", ids).order("tanggal") : { data: [] };
    const lids = (l.data || []).map((x) => x.id);
    const r = lids.length ? await supabase.from("rekomendasi").select("*").in("lhp_id", lids).order("nomor_urut") : { data: [] };
    setTahun(t.data); setObrik(o.data); setLhps(l.data || []); setRek(r.data || []);
    setSel((s) => s || t.data[0]?.id || "");
    setReady(true);
  }, [n]);
  useEffect(() => { load(); }, [load]);

  const run = async (q) => {
    const { error } = await q;
    setErr(error ? error.message : "");
    if (!error) await load();
    return !error;
  };
  const num = (v) => Number(v) || 0;

  const list = useMemo(() => obrik.filter((o) => o.tahun_id === sel && o.jenis === jenis), [obrik, sel, jenis]);
  const thn = tahun.find((t) => t.id === sel)?.tahun ?? "";
  const materil = jenis === "materil";

  const exportCsv = () => {
    const rows = [["Irban", "Tahun", "Jenis", "Obrik", "Nomor LHP", "Judul LHP", "Tanggal LHP", "No", "Rekomendasi", "Keterangan", "Status", "KN Nilai", "KN Setoran", "KN Sisa", "KD Nilai", "KD Setoran", "KD Sisa"]];
    list.forEach((o) => lhps.filter((l) => l.obrik_id === o.id).forEach((l) => rek.filter((r) => r.lhp_id === l.id).forEach((r) =>
      rows.push([n, thn, o.jenis, o.nama, l.nomor, l.judul, l.tanggal, r.nomor_urut, r.uraian, r.keterangan, r.status, r.kn_nilai, r.kn_setoran, r.kn_sisa, r.kd_nilai, r.kd_setoran, r.kd_sisa]))));
    const csv = "\uFEFF" + rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `TLHP_Irban${n}_${thn}_${jenis}.csv`;
    a.click();
  };

  if (!ready) return <p className={err ? "font-medium text-red-700" : "text-ink/60"}>{err || "Memuat data…"}</p>;

  return (
    <div className="space-y-5">
      {/* KOP surat: hanya tampil saat dicetak */}
      <div className="print-only">
        <div className="flex items-center gap-4 border-b-4 border-double border-black pb-3">
          <img src="/logo.png" alt="" className="h-20 w-20 object-contain" />
          <div className="flex-1 text-center">
            <p className="text-lg font-bold">PEMERINTAH KABUPATEN KUPANG</p>
            <p className="text-2xl font-extrabold">INSPEKTORAT DAERAH</p>
            <p className="text-sm">Kabupaten Kupang, Nusa Tenggara Timur</p>
          </div>
        </div>
        <p className="mt-4 text-center font-bold">REKAP TINDAK LANJUT HASIL PEMERIKSAAN — IRBAN {n} — TAHUN {thn} ({jenis.toUpperCase()})</p>
      </div>

      <div className="no-print flex flex-wrap items-center gap-3">
        <select value={sel} onChange={(e) => setSel(e.target.value)} aria-label="Tahun anggaran" className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white outline-none">
          {tahun.map((t) => <option key={t.id} value={t.id}>{t.tahun}</option>)}
        </select>
        <div className="flex rounded-full bg-paper p-1 shadow-sm">
          {["administrasi", "materil"].map((j) => (
            <button key={j} onClick={() => setJenis(j)} className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${jenis === j ? "bg-ink text-white" : "hover:bg-mist"}`}>{j}</button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={exportCsv} className="rounded-full bg-lime px-5 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-md active:scale-95">Ekspor Excel (.csv)</button>
          <button onClick={() => window.print()} className="rounded-full bg-paper px-5 py-2.5 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-95">Cetak KOP</button>
        </div>
      </div>

      {err && <p role="alert" className="no-print rounded-2xl bg-red-100 p-4 text-sm font-medium text-red-700">{err}</p>}

      <AddForm label="Tambah Obrik" fields={[["nama", "Nama obrik"]]} onSubmit={(v) => run(supabase.from("obrik").insert({ irban_no: n, tahun_id: sel, jenis, nama: v.nama.trim() }))} />

      {list.length === 0 && <p className="rounded-[28px] bg-paper p-8 text-center text-ink/55">Belum ada obrik {jenis} untuk tahun {thn}. Tambahkan obrik pertama di atas.</p>}

      {list.map((o) => {
        const ls = lhps.filter((l) => l.obrik_id === o.id);
        return (
          <section key={o.id} className="rounded-[30px] bg-paper p-5 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div><h2 className="text-xl font-extrabold">{o.nama}</h2><p className="text-sm text-ink/55">{ls.length} LHP</p></div>
              <button onClick={() => confirm(`Hapus obrik "${o.nama}"?`) && run(supabase.from("obrik").delete().eq("id", o.id))} className="no-print rounded-full px-3 py-1.5 text-sm font-semibold text-[#c2391d] transition hover:bg-red-50">Hapus</button>
            </div>

            <div className="mt-4 space-y-4">
              {ls.map((l) => {
                const rs = rek.filter((r) => r.lhp_id === l.id);
                return (
                  <article key={l.id} className="rounded-3xl bg-mist/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="font-bold">{l.judul}</p><p className="text-sm text-ink/55">No. {l.nomor} • {tgl(l.tanggal)}</p></div>
                      <button onClick={() => confirm("Hapus LHP ini?") && run(supabase.from("lhps").delete().eq("id", l.id))} className="no-print text-sm font-semibold text-[#c2391d]">Hapus</button>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {rs.map((r) => (
                        <li key={r.id} className="rounded-2xl bg-white p-3 text-sm">
                          <div className="flex items-start gap-3">
                            <span className="font-bold">{r.nomor_urut}.</span>
                            <div className="flex-1"><p>{r.uraian}</p>{r.keterangan && <p className="mt-0.5 text-ink/50">{r.keterangan}</p>}</div>
                            <button onClick={() => run(supabase.from("rekomendasi").update({ status: r.status === "sudah" ? "belum" : "sudah" }).eq("id", r.id))}
                              className={`no-print shrink-0 rounded-full px-3 py-1 text-xs font-bold transition hover:scale-105 ${r.status === "sudah" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>{r.status === "sudah" ? "Sudah" : "Belum"}</button>
                            <span className="print-only font-bold">{r.status}</span>
                            <button onClick={() => confirm("Hapus rekomendasi ini?") && run(supabase.from("rekomendasi").delete().eq("id", r.id))} aria-label="Hapus rekomendasi" className="no-print text-ink/40 transition hover:text-[#c2391d]">✕</button>
                          </div>
                          {materil && (
                            <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
                              <p className="rounded-lg bg-mist p-2"><b>Kerugian Negara</b><br />Nilai {rupiah(r.kn_nilai)} • Setor {rupiah(r.kn_setoran)} • Sisa {rupiah(r.kn_sisa)}</p>
                              <p className="rounded-lg bg-mist p-2"><b>Kerugian Daerah</b><br />Nilai {rupiah(r.kd_nilai)} • Setor {rupiah(r.kd_setoran)} • Sisa {rupiah(r.kd_sisa)}</p>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3">
                      <AddForm label="Tambah rekomendasi"
                        fields={[["uraian", "Uraian rekomendasi", "textarea"], ["keterangan", "Keterangan (opsional)", "textarea"], ...(materil ? [["kn_nilai", "KN nilai (Rp)", "number"], ["kn_setoran", "KN setoran (Rp)", "number"], ["kd_nilai", "KD nilai (Rp)", "number"], ["kd_setoran", "KD setoran (Rp)", "number"]] : []), ["status", "Status", "select", [["belum", "Belum"], ["sudah", "Sudah"]]]]}
                        onSubmit={(v) => run(supabase.from("rekomendasi").insert({
                          lhp_id: l.id, nomor_urut: (Math.max(0, ...rs.map((x) => x.nomor_urut)) || 0) + 1,
                          uraian: v.uraian.trim(), keterangan: (v.keterangan || "").trim(), status: v.status,
                          kn_nilai: num(v.kn_nilai), kn_setoran: num(v.kn_setoran), kd_nilai: num(v.kd_nilai), kd_setoran: num(v.kd_setoran),
                        }))} />
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-4">
              <AddForm label="Tambah LHP" fields={[["nomor", "Nomor LHP"], ["tanggal", "Tanggal", "date"], ["judul", "Judul LHP"]]}
                onSubmit={(v) => run(supabase.from("lhps").insert({ obrik_id: o.id, nomor: v.nomor.trim(), tanggal: v.tanggal, judul: v.judul.trim() }))} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
