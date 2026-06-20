// components/social/HooksPreview.tsx
"use client";

import { useState } from "react";
import { Copy, Check, Zap } from "lucide-react";

interface HooksPreviewProps {
  content: string;
}

export default function HooksPreview({ content }: HooksPreviewProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const hooks = content
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => line.replace(/^\d+\.\s*/, "").trim());

  const handleCopyHook = async (hook: string, index: number) => {
    await navigator.clipboard.writeText(hook);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(content);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)",
        border: "1px solid #2A2A3D",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Línea superior */}
      <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #7C3AED, #7C3AED00)" }} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid #ffffff08" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg"
            style={{ background: "rgba(124,58,237,0.15)", color: "#A78BFA" }}
          >
            <Zap size={14} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#F0F0FF" }}>
              Ganchos Alternativos
            </p>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              Primeras líneas que paran el scroll
            </p>
          </div>
        </div>
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
          style={{
            background: copiedAll ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
            color: copiedAll ? "#22c55e" : "#6B7280",
            border: copiedAll ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {copiedAll ? <Check size={12} /> : <Copy size={12} />}
          {copiedAll ? "Copiado" : "Copiar todos"}
        </button>
      </div>

      {/* Lista de hooks */}
      <div className="p-4 space-y-2">
        {hooks.map((hook, i) => (
          <div
            key={i}
            className="group flex items-start justify-between gap-3 p-3 rounded-xl transition-all cursor-pointer"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #2A2A3D" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(124,58,237,0.06)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              e.currentTarget.style.borderColor = "#2A2A3D";
            }}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <span
                className="text-xs font-bold shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                style={{ background: "rgba(124,58,237,0.2)", color: "#A78BFA" }}
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed" style={{ color: "#D1D5DB" }}>
                {hook}
              </p>
            </div>
            <button
              onClick={() => handleCopyHook(hook, i)}
              className="shrink-0 p-1.5 rounded-lg cursor-pointer transition-all opacity-0 group-hover:opacity-100"
              style={{
                background: copiedIndex === i ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
                color: copiedIndex === i ? "#22c55e" : "#6B7280",
              }}
            >
              {copiedIndex === i ? <Check size={12} /> : <Copy size={12} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}