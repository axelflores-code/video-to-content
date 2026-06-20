// components/profile/ProfileClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mic2, History, User as UserIcon, Zap } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import dynamic from "next/dynamic";

// Dynamic imports para aislar errores de cada sección
const VoiceProfileSection = dynamic(
  () => import("@/components/profile/VoiceProfileSection"),
  { loading: () => <SectionSkeleton /> }
);

const HistorySection = dynamic(
  () => import("@/components/profile/HistorySection"),
  { loading: () => <SectionSkeleton /> }
);

const AccountSection = dynamic(
  () => import("@/components/profile/AccountSection"),
  { loading: () => <SectionSkeleton /> }
);

function SectionSkeleton() {
  return (
    <div className="space-y-4 max-w-2xl">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-20 rounded-2xl animate-pulse"
          style={{ background: "#1A1A24" }}
        />
      ))}
    </div>
  );
}

type Section = "voice" | "history" | "account";

const NAV_ITEMS = [
  { id: "voice" as Section,   label: "Mi Estilo de Voz", Icon: Mic2 },
  { id: "history" as Section, label: "Historial",        Icon: History },
  { id: "account" as Section, label: "Cuenta",           Icon: UserIcon },
];

interface ProfileClientProps {
  user: User;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [active, setActive] = useState<Section>("voice");

  return (
    <main className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% -20%, #7C3AED15, transparent)" }}
        aria-hidden="true"
      />

      {/* Header */}
      <header
        className="relative z-10 sticky top-0 backdrop-blur-sm"
        style={{
          borderBottom: "1px solid #2A2A3560",
          background: "#0A0A0FCC",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center text-sm transition-colors"
            style={{ color: "#6B7280" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F0F0FF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
          >
            <ArrowLeft size={15} />
          </Link>
          <div
            className="p-1.5 rounded-lg"
            style={{
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <Zap size={15} style={{ color: "#A78BFA" }} />
          </div>
          <span
            className="text-sm font-semibold"
            style={{ color: "#F0F0FF", fontFamily: "var(--font-jetbrains)" }}
          >
            VideoToContent
          </span>
        </div>
      </header>

      {/* Layout */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: "#F0F0FF" }}>
            Mi Perfil
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            {user.email}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <nav className="md:w-56 shrink-0">
            <div className="flex md:flex-col gap-1">
              {NAV_ITEMS.map(({ id, label, Icon }) => {
                const isActive = active === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActive(id)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-200 w-full text-left"
                    style={{
                      background: isActive ? "rgba(124,58,237,0.12)" : "transparent",
                      color: isActive ? "#E9D5FF" : "#6B7280",
                      border: isActive
                        ? "1px solid rgba(139,92,246,0.3)"
                        : "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.color = "#D1D5DB";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#6B7280";
                      }
                    }}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Contenido dinámico */}
          <div className="flex-1 min-w-0">
            {active === "voice"   && <VoiceProfileSection />}
            {active === "history" && <HistorySection />}
            {active === "account" && <AccountSection user={user} />}
          </div>
        </div>
      </div>
    </main>
  );
}