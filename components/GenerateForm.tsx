"use client";

import { useState } from "react";
import { Sparkles, Link, AlertCircle } from "lucide-react";
import { getVoiceProfile } from "@/lib/voiceProfile";
import { canGenerate, logGeneration } from "@/lib/usage";
import { getProfile } from "@/lib/profile";



const LOADING_MESSAGES = [
  "Conectando con YouTube...",
  "Extrayendo transcripción...",
  "Analizando el contenido...",
  "Escribiendo copy...",
  "Puliendo los resultados...",
];

export type SocialNetwork = "linkedin" | "instagram" | "twitter";
export type ToneOfVoice = "professional" | "persuasive" | "casual";

export interface GeneratedContent {
  linkedinPost?: string;
  instagramPost?: string;
  twitterPost?: string;
  carouselStructure: string;
  hooks: string;
}

interface GenerateFormProps {
  onResults: (data: GeneratedContent, networks: SocialNetwork[], tone: ToneOfVoice) => void;
  onLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const NETWORKS: { id: SocialNetwork; label: string; icon: string; color: string }[] = [
  { id: "linkedin",  label: "LinkedIn",    icon: "in", color: "#0A66C2" },
  { id: "instagram", label: "Instagram",   icon: "IG", color: "#E1306C" },
  { id: "twitter",   label: "X / Twitter", icon: "𝕏",  color: "#8B8BFF" },
];

const TONES: { id: ToneOfVoice; label: string; emoji: string }[] = [
  { id: "professional", label: "Profesional", emoji: "🎯" },
  { id: "persuasive",   label: "Persuasivo",  emoji: "⚡" },
  { id: "casual",       label: "Cercano",     emoji: "🙌" },
];

function isValidYouTubeUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/,
  ];
  return patterns.some((p) => p.test(url.trim()));
}

export default function GenerateForm({ onResults, onLoading, isLoading }: GenerateFormProps) {
  const [url, setUrl]           = useState("");
  const [networks, setNetworks] = useState<SocialNetwork[]>([]);
  const [tone, setTone]         = useState<ToneOfVoice | null>(null);
  const [error, setError]       = useState("");
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  const toggleNetwork = (id: SocialNetwork) => {
    setNetworks((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
    if (error) setError("");
  };

  const startLoadingMessages = () => {
    let index = 0;
    return setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[index]);
    }, 3000);
  };

  const handleSubmit = async () => {
    setError("");
    if (!url.trim())             { setError("Pega una URL de YouTube para continuar."); return; }
    if (!isValidYouTubeUrl(url)) { setError("La URL no parece ser de YouTube."); return; }
    if (networks.length === 0)   { setError("Selecciona al menos una red social."); return; }
    if (!tone)                   { setError("Selecciona un tono de voz."); return; }

    onLoading(true);
    setLoadingMessage(LOADING_MESSAGES[0]);
    const interval = startLoadingMessages();

    try {
      
const profile = await getProfile();
const { allowed } = await canGenerate(profile?.is_premium ?? false);

if (!allowed) {
  setError("Alcanzaste tu límite diario de 3 generaciones gratis. Mejora a Premium para generar sin límites.");
  onLoading(false);
  return;
}

const response = await fetch("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: url.trim(),
    networks,
    tone,
    voiceProfile: profile?.voice_profile_description ?? null,
  }),
});

// después de un response.ok exitoso, antes de onResults:
await logGeneration();

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Algo salió mal.");
      onResults(data, networks, tone!);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      clearInterval(interval);
      onLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">

      {/* ── URL Input ── */}
      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "#6B7280" }}>
          URL del video
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }}>
            <Link size={15} />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); if (error) setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter" && !isLoading) handleSubmit(); }}
            placeholder="https://youtube.com/watch?v=..."
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "#13131A",
              border: "1px solid #2A2A35",
              color: "#F0F0FF",
              fontFamily: "var(--font-jetbrains)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#7C3AED";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#2A2A35";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* ── Red Social — Multi-select Pills ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "#6B7280" }}>
            Red social <span style={{ color: "#7C3AED" }}>*</span>
          </label>
          {/* Contador de seleccionadas */}
          {networks.length > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(139,92,246,0.4)",
                color: "#A78BFA",
                fontFamily: "var(--font-jetbrains)",
              }}
            >
              {networks.length} seleccionada{networks.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
    <div className="flex flex-wrap gap-2 justify-center">
  {NETWORKS.map((net) => {
            const isSelected = networks.includes(net.id);
            return (
              <button
                key={net.id}
                type="button"
                onClick={() => toggleNetwork(net.id)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 hover:scale-[1.03] active:scale-[0.97]"
                style={{
  background: isSelected ? `${net.color}20` : "rgba(10,10,15,0.5)",
  border: isSelected ? `1px solid ${net.color}90` : "1px solid #252530",
  color: isSelected ? "#F0F0FF" : "#6B7280",
  boxShadow: isSelected ? `0 0 10px ${net.color}30` : "none",
}}
>
  <span
    className="text-xs font-bold"
    style={{
      fontFamily: "var(--font-jetbrains)",
      color: isSelected ? net.color : net.color,
    }}
  >
    {net.icon}
  </span>
  <span>{net.label}</span>
              </button>
            );
          })}
        </div>
        {/* Hint multi-select */}
        <p className="text-xs" style={{ color: "#374151" }}>
          Puedes seleccionar una o varias redes a la vez
        </p>
      </div>

      {/* ── Tono de Voz — Pills ── */}
      <div className="space-y-3">
        <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "#6B7280" }}>
          Tono de voz <span style={{ color: "#7C3AED" }}>*</span>
        </label>
       <div className="flex flex-wrap gap-2 justify-center">
  {TONES.map((t) => {
            const isSelected = tone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => { setTone(t.id); if (error) setError(""); }}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  background: isSelected ? "rgba(124,58,237,0.15)" : "rgba(10,10,15,0.5)",
                  border: isSelected ? "1px solid rgba(139,92,246,0.7)" : "1px solid #252530",
                  color: isSelected ? "#E9D5FF" : "#6B7280",
                  boxShadow: isSelected
                    ? "0 0 12px rgba(139,92,246,0.25), 0 0 24px rgba(139,92,246,0.1)"
                    : "none",
                }}
              >
                <span className="text-sm">{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-start gap-2 text-sm px-1 animate-fade-in" style={{ color: "#F87171" }}>
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Botón glow ── */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
        style={{
          background: "rgba(124,58,237,0.12)",
          border: "1px solid rgba(139,92,246,0.5)",
          color: "#C4B5FD",
          boxShadow: "0 0 10px rgba(139,92,246,0.1)",
        }}
        onMouseEnter={(e) => {
          if (isLoading) return;
          (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.20)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.8)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(139,92,246,0.2)";
          (e.currentTarget as HTMLElement).style.color = "#EDE9FE";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.12)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.5)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 0 10px rgba(139,92,246,0.1)";
          (e.currentTarget as HTMLElement).style.color = "#C4B5FD";
        }}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="animate-pulse-slow">{loadingMessage}</span>
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Generar Contenido
            {networks.length > 1 && (
              <span
                className="px-1.5 py-0.5 rounded-full text-xs"
                style={{ background: "rgba(139,92,246,0.3)", color: "#E9D5FF" }}
              >
                {networks.length} redes
              </span>
            )}
          </>
        )}
      </button>

      {!isLoading && (
        <p className="text-center text-xs" style={{ color: "#374151" }}>
          Presiona{" "}
          <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: "#13131A", border: "1px solid #2A2A35", color: "#6B7280", fontFamily: "var(--font-jetbrains)" }}>
            Enter
          </kbd>{" "}
          para generar
        </p>
      )}
    </div>
  );
}