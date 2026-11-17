import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const fail = (m, s = 401) => NextResponse.json({ error: m }, { status: s });

export async function POST(req) {
  const { username, password } = await req.json().catch(() => ({}));
  const id = String(username || "").trim().toLowerCase();
  if (!id || !password) return fail("Username dan password wajib diisi.", 400);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let email = id;
  if (!id.includes("@")) {
    if (!svc) return fail("Server belum dikonfigurasi: isi SUPABASE_SERVICE_ROLE_KEY di .env.local.", 500);
    const admin = createClient(url, svc, { auth: { persistSession: false } });
    const { data: p } = await admin.from("profiles").select("id,aktif").eq("username", id).maybeSingle();
    if (!p || !p.aktif) return fail("Username atau password salah.");
    const { data: u } = await admin.auth.admin.getUserById(p.id);
    email = u?.user?.email || "";
    if (!email) return fail("Username atau password salah.");
  }
  const client = createClient(url, anon, { auth: { persistSession: false } });
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session) return fail("Username atau password salah.");
  return NextResponse.json({ session: { access_token: data.session.access_token, refresh_token: data.session.refresh_token } });
}
