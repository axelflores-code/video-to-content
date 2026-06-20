// components/profile/HistorySection.tsx
"use client";

import { History, Sparkles } from "lucide-react";

export default function HistorySection() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#F0F0FF" }}>
          <History size={18} style={{ color: "#A78BFA" }} />
          Historial
        </h2>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Todo el contenido que has generado, en un solo lugar
        </p>
      </div>

      <div
        className="rounded-2xl p-10 flex flex-col items-center text-center gap-3"
        style={{ background: "#16161f", border: "1px dashed #2A2A35" }}
      >
        <div
          className="p-3 rounded-full"
          style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}
        >
          <Sparkles size={20} style={{ color: "#A78BFA" }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "#D1D5DB" }}>
          Próximamente
        </p>
        <p className="text-xs max-w-sm" style={{ color: "#6B7280" }}>
          Aquí podrás ver y reutilizar todo el contenido que generaste anteriormente, organizado por video y fecha.
        </p>
      </div>
    </div>
  );
}