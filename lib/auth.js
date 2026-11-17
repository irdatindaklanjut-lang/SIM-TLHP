"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

const Ctx = createContext({ loading: true, user: null, profile: null, role: null });
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [s, setS] = useState({ loading: true, user: null, profile: null, role: null });
  useEffect(() => {
    let on = true;
    async function load(session) {
      if (!session) return on && setS({ loading: false, user: null, profile: null, role: null });
      const [{ data: p }, { data: r }] = await Promise.all([
        supabase.from("profiles").select("username,nama,irban_no,aktif").eq("id", session.user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", session.user.id),
      ]);
      const roles = (r || []).map((x) => x.role);
      const role = roles.includes("admin") ? "admin" : roles[0] || null;
      if (on) setS({ loading: false, user: session.user, profile: p, role });
    }
    supabase.auth.getSession().then(({ data }) => load(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setTimeout(() => load(session), 0));
    return () => { on = false; sub.subscription.unsubscribe(); };
  }, []);
  return <Ctx.Provider value={s}>{children}</Ctx.Provider>;
}
