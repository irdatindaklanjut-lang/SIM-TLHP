import { supabase } from "./supabase";

// RLS di Supabase otomatis membatasi data sesuai Irban pengguna.
export async function loadAll() {
  const [t, o, l, r] = await Promise.all([
    supabase.from("tahun_anggaran").select("id,tahun").order("tahun", { ascending: false }),
    supabase.from("obrik").select("id,irban_no,tahun_id,jenis,nama").order("created_at"),
    supabase.from("lhps").select("id,obrik_id,judul,nomor,tanggal").order("tanggal"),
    supabase.from("rekomendasi").select("*").order("nomor_urut"),
  ]);
  const err = t.error || o.error || l.error || r.error;
  if (err) throw err;
  return { tahun: t.data, obrik: o.data, lhps: l.data, rek: r.data };
}

export function summarize({ obrik, lhps, rek }, tahunId = "all") {
  const ob = obrik.filter((x) => tahunId === "all" || x.tahun_id === tahunId);
  const obIds = new Set(ob.map((x) => x.id));
  const lh = lhps.filter((x) => obIds.has(x.obrik_id));
  const lhIds = new Set(lh.map((x) => x.id));
  const rk = rek.filter((x) => lhIds.has(x.lhp_id));
  const materilLhp = new Set(lh.filter((l) => ob.find((o) => o.id === l.obrik_id)?.jenis === "materil").map((l) => l.id));
  const fin = rk.filter((x) => materilLhp.has(x.lhp_id));
  const sum = (k) => fin.reduce((a, x) => a + Number(x[k] || 0), 0);
  const nilai = sum("kn_nilai") + sum("kd_nilai");
  const setoran = sum("kn_setoran") + sum("kd_setoran");
  return {
    ob, lh, rk,
    sudah: rk.filter((x) => x.status === "sudah").length,
    belum: rk.filter((x) => x.status === "belum").length,
    nilai, setoran, sisa: nilai - setoran, pct: nilai ? (setoran / nilai) * 100 : 0,
  };
}
