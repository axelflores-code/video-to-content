// components/profile/AccountSection.tsx
"use client";

import { useState } from "react";
import { User as UserIcon, Crown, LogOut, Sparkles, Check } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { signOut } from "@/lib/auth";

interface AccountSectionProps {
  user: User & { is_premium?: boolean };
}

export default function AccountSection({ user }: AccountSectionProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    window.location.href = "/";
  };

  const handleUpgrade = async () => {
    setIsRedirecting(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      console.error("[checkout]", err);
      alert("Error al abrir el checkout. Intenta de nuevo.");
      setIsRedirecting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2
          className="text-lg font-semibold flex items-center gap-2"
          style={{ color: "#F0F0FF" }}
        >
          <UserIcon size={18} style={{ color: "#A78BFA" }} />
          Cuenta
        </h2>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Tu plan y configuración general
        </p>
      </div>

      {/* Info de cuenta */}
      <div
        className="rounded-2xl p-5 flex items-center gap-3"
        style={{ background: "#16161f", border: "1px solid #2A2A35" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: "#7C3AED", color: "#fff" }}
        >
          {user.email?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "#F0F0FF" }}>
            {user.email}
          </p>
          <p className="text-xs" style={{ color: "#6B7280" }}>
            Miembro desde{" "}
            {new Date(user.created_at).toLocaleDateString("es", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Plan actual */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{ background: "#16161f", border: "1px solid #2A2A35" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-lg"
              style={{
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(139,92,246,0.3)",
              }}
            >
              <Crown size={16} style={{ color: "#A78BFA" }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "#F0F0FF" }}>
                Plan Gratis
              </p>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                3 generaciones por día
              </p>
            </div>
          </div>
        </div>

        {/* Comparativa de planes */}
        <div className="grid grid-cols-2 gap-3">
          {/* Free */}
          <div
            className="rounded-xl p-4 space-y-2"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #2A2A35" }}
          >
            <p className="text-xs font-semibold" style={{ color: "#9CA3AF" }}>
              Gratis
            </p>
            {[
              "3 generaciones / día",
              "3 alternativas de copy",
              "Previews de redes sociales",
            ].map((f) => (
              <div key={f} className="flex items-start gap-1.5">
                <Check size={11} className="mt-0.5 shrink-0" style={{ color: "#6B7280" }} />
                <span className="text-xs" style={{ color: "#6B7280" }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Pro */}
          <div
            className="rounded-xl p-4 space-y-2 relative overflow-hidden"
            style={{
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(139,92,246,0.4)",
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold" style={{ color: "#A78BFA" }}>
                Pro
              </p>
              <span className="text-xs font-bold" style={{ color: "#A78BFA" }}>
                $19/mes
              </span>
            </div>
            {[
              "Generaciones ilimitadas",
              "Todo lo de Gratis",
              "Mi Estilo de Voz con IA",
              "Historial de contenido",
            ].map((f) => (
              <div key={f} className="flex items-start gap-1.5">
                <Check size={11} className="mt-0.5 shrink-0" style={{ color: "#A78BFA" }} />
                <span className="text-xs" style={{ color: "#D1D5DB" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Botón upgrade */}
        <button
          onClick={handleUpgrade}
          disabled={isRedirecting}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          style={{
            background: "#7C3AED",
            color: "#fff",
            boxShadow: "0 0 20px rgba(124,58,237,0.3)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#6D28D9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#7C3AED")}
        >
          {isRedirecting ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Redirigiendo al checkout...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Mejorar a Pro — $19/mes
            </>
          )}
        </button>
      </div>

      {/* Cerrar sesión */}
      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl cursor-pointer transition-all disabled:opacity-50"
        style={{
          background: "rgba(248,113,113,0.08)",
          border: "1px solid rgba(248,113,113,0.25)",
          color: "#F87171",
        }}
      >
        <LogOut size={14} />
        {isSigningOut ? "Cerrando sesión..." : "Cerrar sesión"}
      </button>
    </div>
  );
}