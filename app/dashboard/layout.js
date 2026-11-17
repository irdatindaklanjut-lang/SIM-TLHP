"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const Ic = ({ d, c = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const GRID = "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z";
const BLD = "M5 21V4h10v17M15 9h4v12M9 8h2M9 12h2M9 16h2";
const OUT = "M9 4H5v16h4M16 8l4 4-4 4M20 12H9";

function Shell({ children }) {
  const { loading, user, profile, role } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const logout = () => supabase.auth.signOut().then(() => router.replace("/"));

  useEffect(() => { if (!loading && !user) router.replace("/"); }, [loading, user, router]);

  if (loading || !user) return <div className="grid min-h-screen place-items-center font-medium text-ink/60">Memuat…</div>;
  if (!role || profile?.aktif === false)
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md rounded-[32px] bg-paper p-8 text-center shadow-xl">
          <h1 className="text-2xl font-extrabold">Akun belum memiliki akses</h1>
          <p className="mt-3 text-ink/60">Akun Anda belum diberi peran atau sedang dinonaktifkan. Hubungi admin SIM-TLHP.</p>
          <button onClick={logout} className="mt-6 rounded-full bg-ink px-6 py-3 font-bold text-white">Keluar</button>
        </div>
      </div>
    );

  const irbans = role === "admin" ? [1, 2, 3, 4] : profile?.irban_no ? [profile.irban_no] : [];
  const isAdmin = role === "admin";
  const nama = profile?.nama || profile?.username || "Pengguna";
  const initials = nama.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const m = path.match(/irban\/(\d)/);
  const title = m ? `Irban ${m[1]}` : "Dashboard";
  const link = (href, label, icon) => {
    const on = path === href;
    return (
      <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-3 py-3 font-medium transition ${on ? "bg-white font-semibold text-ink" : "text-white/80 hover:bg-white/5"}`}>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${on ? "bg-ink text-white" : "bg-white/10"}`}><Ic d={icon} c="h-[18px] w-[18px]" /></span>
        {label}
        <span className={`ml-auto h-2 w-2 rounded-full ${on ? "bg-lime" : "bg-emerald-400"}`} />
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen gap-3 p-2 lg:p-3">
      <aside className="no-print sticky top-3 hidden h-[calc(100vh-1.5rem)] w-[290px] shrink-0 flex-col rounded-[34px] bg-ink p-5 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white p-1.5"><img src="/logo.png" alt="Logo Kabupaten Kupang" className="h-full w-full object-contain" /></span>
          <div className="min-w-0 leading-tight"><p className="truncate text-[15px] font-bold">Pemerintah Kabupaten Kupang</p><p className="text-[11px] tracking-wide text-white/50">INSPEKTORAT DAERAH</p></div>
        </div>
        <p className="mt-8 text-[11px] font-semibold tracking-[.15em] text-white/40">MENU UTAMA</p>
        <div className="mt-3">{link("/dashboard", "Dashboard", GRID)}</div>
        <p className="mt-6 text-[11px] font-semibold tracking-[.15em] text-white/40">MODUL TLHP — IRBAN</p>
        <nav className="mt-3 space-y-1 overflow-y-auto">{irbans.map((n) => link(`/dashboard/irban/${n}`, `Irban ${n}`, BLD))}</nav>
        <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white/5 p-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-lime font-bold text-ink">{initials}</span>
          <div className="min-w-0 flex-1 leading-tight"><p className="truncate font-semibold">{profile?.username}</p><p className="text-[11px] uppercase tracking-wide text-white/50">{isAdmin ? "Administrator" : `Irban ${profile?.irban_no}`}</p></div>
          <button onClick={logout} aria-label="Keluar" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"><Ic d={OUT} /></button>
        </div>
      </aside>

      <main className="stripes min-w-0 flex-1 rounded-[34px] bg-white/30 p-4 sm:p-8">
        <header className="no-print flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="text-3xl font-extrabold">{title}</h1><p className="text-sm text-ink/55">{title === "Dashboard" ? "Ringkasan" : "Modul TLHP"}</p></div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase text-white">{isAdmin ? "Administrator" : "Irban"}</span>
            <span className="hidden items-center gap-2 rounded-full bg-paper py-1.5 pl-1.5 pr-4 text-sm font-semibold shadow-sm sm:flex"><span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[11px] text-lime">{initials}</span>{nama}</span>
            <button onClick={logout} className="rounded-full bg-paper px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">Keluar</button>
          </div>
        </header>
        <nav className="no-print -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden">
          {[["/dashboard", "Dashboard"], ...irbans.map((n) => [`/dashboard/irban/${n}`, `Irban ${n}`])].map(([h, t]) => (
            <Link key={h} href={h} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${path === h ? "bg-ink text-white" : "bg-paper"}`}>{t}</Link>
          ))}
        </nav>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return <AuthProvider><Shell>{children}</Shell></AuthProvider>;
}
