// components/AuthStatus.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function AuthStatus() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div
        className="ml-auto w-24 h-7 rounded-full animate-pulse"
        style={{ background: "var(--color-surface-2)" }}
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all"
        style={{
          background: "rgba(124,58,237,0.1)",
          border: "1px solid rgba(139,92,246,0.3)",
          color: "#A78BFA",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(124,58,237,0.18)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(124,58,237,0.1)")}
      >
        <User size={13} />
        Iniciar sesión
      </Link>
    );
  }

  const initial = user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="ml-auto flex items-center gap-2">
      <Link
        href="/profile"
        className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all"
        style={{
          background: "rgba(124,58,237,0.1)",
          border: "1px solid rgba(139,92,246,0.3)",
          color: "#A78BFA",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(124,58,237,0.18)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(124,58,237,0.1)")}
      >
        <span
          className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ background: "#7C3AED", color: "#fff" }}
        >
          {initial}
        </span>
        Mi Perfil
      </Link>
      <button
        onClick={handleSignOut}
        className="p-1.5 rounded-full cursor-pointer transition-all"
        style={{ color: "#6B7280" }}
        title="Cerrar sesión"
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#F87171";
          e.currentTarget.style.background = "rgba(248,113,113,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#6B7280";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <LogOut size={13} />
      </button>
    </div>
  );
}