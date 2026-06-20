// components/social/LinkedInPreview.tsx
"use client";

import { useState } from "react";
import { ThumbsUp, MessageSquare, Repeat2, Send, Copy, Check, Globe } from "lucide-react";

interface LinkedInPreviewProps {
  content: string;
  userEmail?: string;
}

export default function LinkedInPreview({ content, userEmail }: LinkedInPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const initial = userEmail?.[0]?.toUpperCase() ?? "U";
  const name = userEmail?.split("@")[0] ?? "Tu Nombre";
  const PREVIEW_LENGTH = 200;
  const isLong = content.length > PREVIEW_LENGTH;
  const displayText = expanded || !isLong
    ? content
    : content.slice(0, PREVIEW_LENGTH) + "...";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      {/* Línea superior LinkedIn */}
      <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #0A66C2, #0A66C200)" }} />

      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ring-2"
            >
              {initial}
            </div>
            {/* Info */}
            <div>
              <p className="text-sm font-semibold capitalize" style={{ color: "#F0F0FF" }}>
                {name}
              </p>
              <p className="text-xs bg-[#7C3AED] text-white ring-4 ring-[#7C3AED]/25 px-2 py-0.5 rounded-full inline-block">
  Infoproductor · Creador de contenido
</p>

              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs" style={{ color: "#6B7280" }}>Ahora</span>
                <span style={{ color: "#6B7280" }}>·</span>
                <Globe size={10} style={{ color: "#6B7280" }} />
              </div>
            </div>
          </div>

          {/* Copiar */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium shrink-0 cursor-pointer transition-all"
            style={{
              background: copied ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
              color: copied ? "#22c55e" : "#6B7280",
              border: copied ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>

      {/* Contenido del post */}
      <div className="px-4 pb-3">
        <p
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: "#D1D5DB" }}
        >
          {displayText}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium mt-1 cursor-pointer"
            style={{ color: "#0A66C2" }}
          >
            {expanded ? "Ver menos" : "...ver más"}
          </button>
        )}
      </div>

      {/* Separador */}
      <div className="mx-4" style={{ borderTop: "1px solid #ffffff08" }} />

      {/* Reacciones */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            {["👍", "❤️", "💡"].map((emoji, i) => (
              <span
                key={i}
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                style={{ background: "#1E1E2E", zIndex: 3 - i }}
              >
                {emoji}
              </span>
            ))}
          </div>
          <span className="text-xs ml-1" style={{ color: "#6B7280" }}>
            {Math.floor(Math.random() * 200 + 50)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: "#6B7280" }}>
            {Math.floor(Math.random() * 40 + 10)} comentarios
          </span>
          <span className="text-xs" style={{ color: "#6B7280" }}>
            {Math.floor(Math.random() * 20 + 5)} reposts
          </span>
        </div>
      </div>

      {/* Separador */}
      <div className="mx-4" style={{ borderTop: "1px solid #ffffff08" }} />

      {/* Acciones */}
      <div className="px-2 py-1 flex items-center justify-around">
        {[
          { icon: ThumbsUp, label: "Me gusta" },
          { icon: MessageSquare, label: "Comentar" },
          { icon: Repeat2, label: "Compartir" },
          { icon: Send, label: "Enviar" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs cursor-pointer transition-all"
            style={{ color: "#6B7280" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "#D1D5DB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#6B7280";
            }}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}