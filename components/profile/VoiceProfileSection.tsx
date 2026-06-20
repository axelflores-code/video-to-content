// components/profile/VoiceProfileSection.tsx
"use client";

import { useState, useEffect } from "react";
import { Sparkles, Check, Trash2, Lock, Mic2 } from "lucide-react";
import { getProfile, saveVoiceProfile, clearVoiceProfile } from "@/lib/profile";
import type { Profile } from "@/types/database";

export default function VoiceProfileSection() {
  const [samples, setSamples] = useState(["", "", ""]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p);
      setIsLoading(false);
    });
  }, []);

  const handleAnalyze = async () => {
    setError("");
    const filled = samples.filter((s) => s.trim().length > 20);

    if (filled.length < 2) {
      setError("Pega al menos 2 ejemplos de tus textos (mínimo 20 caracteres cada uno).");
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ samples: filled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al analizar.");

      const saved = await saveVoiceProfile(data.description, filled.length);
      if (!saved) throw new Error("Error al guardar el perfil.");

      const updated = await getProfile();
      setProfile(updated);
      setSamples(["", "", ""]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = async () => {
    await clearVoiceProfile();
    const updated = await getProfile();
    setProfile(updated);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <div className="h-6 w-48 rounded animate-pulse" style={{ background: "#1A1A24" }} />
        <div className="h-32 rounded-2xl animate-pulse" style={{ background: "#1A1A24" }} />
      </div>
    );
  }

  const isPremium = profile?.is_premium ?? false;

  // ── Bloqueo para usuarios no premium ──
  if (!isPremium) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#F0F0FF" }}>
            <Mic2 size={18} style={{ color: "#A78BFA" }} />
            Mi Estilo de Voz
          </h2>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Enséñale a la IA cómo escribes para que cada post suene a ti
          </p>
        </div>

        <div
          className="rounded-2xl p-8 flex flex-col items-center text-center gap-4"
          style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(139,92,246,0.25)" }}
        >
          <div
            className="p-3 rounded-full"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(139,92,246,0.35)" }}
          >
            <Lock size={20} style={{ color: "#A78BFA" }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#F0F0FF" }}>
              Función exclusiva para Premium
            </p>
            <p className="text-xs mt-1.5 max-w-sm" style={{ color: "#9CA3AF" }}>
              Desbloquea el análisis de tu estilo de escritura y genera contenido que suena 100% a ti, no a una IA genérica.
            </p>
          </div>
          <button
            className="text-sm px-5 py-2.5 rounded-xl font-medium cursor-pointer transition-all"
            style={{ background: "#7C3AED", color: "#fff" }}
          >
            Mejorar a Premium
          </button>
        </div>
      </div>
    );
  }

  // ── Vista normal para usuarios premium ──
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#F0F0FF" }}>
            <Mic2 size={18} style={{ color: "#A78BFA" }} />
            Mi Estilo de Voz
          </h2>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Enséñale a la IA cómo escribes para que cada post suene a ti
          </p>
        </div>
        <span
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full shrink-0"
          style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}
        >
          <Check size={10} /> Premium
        </span>
      </div>

      {profile?.voice_profile_description ? (
        <div
          className="rounded-2xl p-5 space-y-3"
          style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)" }}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#22c55e" }}>
              <Check size={14} /> Perfil activo
            </span>
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-xs cursor-pointer transition-colors"
              style={{ color: "#F87171" }}
            >
              <Trash2 size={12} /> Eliminar perfil
            </button>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#D1D5DB" }}>
            {profile.voice_profile_description}
          </p>
          <p className="text-xs" style={{ color: "#4B5563" }}>
            Generado a partir de {profile.voice_profile_sample_count} ejemplo{profile.voice_profile_sample_count > 1 ? "s" : ""}
            {profile.voice_profile_created_at &&
              ` · ${new Date(profile.voice_profile_created_at).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}`}
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed #2A2A35" }}
        >
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Aún no tienes un perfil de voz. Pega tus ejemplos abajo y analízalos.
          </p>
        </div>
      )}

      <div
        className="rounded-2xl p-5 space-y-4"
        style={{ background: "#16161f", border: "1px solid #2A2A35" }}
      >
        <h3 className="text-sm font-medium" style={{ color: "#D1D5DB" }}>
          {profile?.voice_profile_description ? "Actualizar con nuevos ejemplos" : "Pega tus ejemplos"}
        </h3>

        <div className="space-y-3">
          {samples.map((sample, i) => (
            <div key={i} className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "#6B7280" }}>
                Ejemplo {i + 1} {i === 2 && "(opcional)"}
              </label>
              <textarea
                value={sample}
                onChange={(e) => {
                  const next = [...samples];
                  next[i] = e.target.value;
                  setSamples(next);
                }}
                placeholder="Pega aquí un post o caption que hayas escrito antes..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none transition-all"
                style={{ background: "#13131A", border: "1px solid #2A2A35", color: "#F0F0FF" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#7C3AED")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#2A2A35")}
              />
            </div>
          ))}
        </div>

        {error && <p className="text-sm" style={{ color: "#F87171" }}>{error}</p>}

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(139,92,246,0.5)", color: "#C4B5FD" }}
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analizando tu estilo...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              {profile?.voice_profile_description ? "Volver a analizar" : "Analizar mi estilo"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}