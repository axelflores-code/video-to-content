"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ContentCardProps {
  title: string;
  description: string;
  content: string;
  icon: React.ReactNode;
  badge?: string;
  index?: number;
  accentColor?: string;
}

export default function ContentCard({
  title,
  description,
  content,
  icon,
  badge,
  index = 0,
  accentColor = "#7C3AED",
}: ContentCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-3px]"
      style={{
        background: "linear-gradient(145deg, #16161f 0%, #1a1a28 100%)",
        border: "1px solid #2a2a3d",
        animation: `slideUp 0.4s ease-out ${index * 0.12}s both`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}60`;
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}30`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#2a2a3d";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)";
      }}
    >
      {/* Línea de color superior */}
      <div
        className="h-[2px] w-full"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}00)`,
        }}
      />

      {/* Header */}
      <div
        className="flex items-start justify-between gap-3 px-5 py-4"
        style={{ borderBottom: "1px solid #ffffff08" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Ícono */}
          <div
            className="p-2 rounded-lg shrink-0"
            style={{
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}30`,
              color: accentColor,
            }}
          >
            {icon}
          </div>

          {/* Textos */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className="font-semibold text-sm truncate"
                style={{ color: "#F0F0FF" }}
              >
                {title}
              </h3>
              {badge && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                  style={{
                    background: `${accentColor}20`,
                    color: accentColor,
                    border: `1px solid ${accentColor}35`,
                  }}
                >
                  {badge}
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5 truncate" style={{ color: "#6B7280" }}>
              {description}
            </p>
          </div>
        </div>

        {/* Botón copiar */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all duration-200 cursor-pointer"
          style={{
            background: copied ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)",
            color: copied ? "#22c55e" : "#6B7280",
            border: copied
              ? "1px solid rgba(34,197,94,0.3)"
              : "1px solid rgba(255,255,255,0.08)",
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)";
              (e.currentTarget as HTMLElement).style.color = "#F0F0FF";
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLElement).style.color = "#6B7280";
            }
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? "Copiado" : "Copiar"}</span>
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 px-5 py-4">
        <p
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: "#D1D5DB" }}
        >
          {content}
        </p>
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderTop: "1px solid #ffffff06" }}
      >
        <div className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#22c55e" }}
          />
          <span className="text-xs" style={{ color: "#4B5563" }}>
            Listo para publicar
          </span>
        </div>
        <span
          className="text-xs"
          style={{ color: "#374151", fontFamily: "var(--font-jetbrains)" }}
        >
          {content.length} chars
        </span>
      </div>
    </article>
  );
}