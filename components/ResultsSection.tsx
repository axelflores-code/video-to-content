// components/ResultsSection.tsx
"use client";

import { RefreshCw } from "lucide-react";
import LinkedInPreview from "@/components/social/LinkedInPreview";
import InstagramPreview from "@/components/social/InstagramPreview";
import TwitterPreview from "@/components/social/TwitterPreview";
import HooksPreview from "@/components/social/HooksPreview";
import type { GeneratedContent, SocialNetwork, ToneOfVoice } from "@/components/GenerateForm";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface ResultsSectionProps {
  results: GeneratedContent;
  networks: SocialNetwork[];
  tone: ToneOfVoice;
  onReset: () => void;
}

const TONE_LABELS: Record<ToneOfVoice, string> = {
  professional: "🎯 Profesional",
  persuasive:   "⚡ Persuasivo",
  casual:       "🙌 Cercano",
};

const NETWORK_META: Record<SocialNetwork, { label: string; color: string; icon: string }> = {
  linkedin:  { label: "LinkedIn",    color: "#0A66C2", icon: "in" },
  instagram: { label: "Instagram",   color: "#E1306C", icon: "IG" },
  twitter:   { label: "X / Twitter", color: "#8B8BFF", icon: "𝕏" },
};

export default function ResultsSection({
  results,
  networks,
  tone,
  onReset,
}: ResultsSectionProps) {
  const [userEmail, setUserEmail] = useState<string | undefined>();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? undefined);
    });
  }, []);

  const networkPosts: { network: SocialNetwork; content: string }[] = networks
    .map((n) => ({
      network: n,
      content: (results[`${n}Post` as keyof GeneratedContent] as string) ?? "",
    }))
    .filter((p) => p.content.length > 0);

  const totalCards = networkPosts.length + 1; // +1 por hooks
  const gridCols =
    totalCards === 1 ? "grid-cols-1" :
    totalCards === 2 ? "grid-cols-1 lg:grid-cols-2" :
    "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3";

  return (
    <section
      id="results"
      className="relative z-10 pb-24 px-6"
      style={{ animation: "slideUp 0.5s ease-out both" }}
      aria-label="Contenido generado"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 space-y-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.25)",
              color: "#22c55e",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Contenido generado con éxito
          </div>

          <h2 className="text-3xl font-bold" style={{ color: "#F0F0FF" }}>
            Tu contenido está listo ✨
          </h2>

          {/* Chips de configuración */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {networks.map((n) => (
              <span
                key={n}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  background: `${NETWORK_META[n].color}18`,
                  color: NETWORK_META[n].color,
                  border: `1px solid ${NETWORK_META[n].color}40`,
                }}
              >
                {NETWORK_META[n].icon} {NETWORK_META[n].label}
              </span>
            ))}
            <span style={{ color: "#4B5563" }}>·</span>
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #2A2A35",
                color: "#9CA3AF",
              }}
            >
              {TONE_LABELS[tone]}
            </span>
          </div>
        </div>

        {/* Grid de previews */}
        <div className={`grid ${gridCols} gap-6`}>
          {networkPosts.map(({ network, content }) => {
            if (network === "linkedin") {
              return (
                <LinkedInPreview
                  key="linkedin"
                  content={content}
                  userEmail={userEmail}
                />
              );
            }
            if (network === "instagram") {
              return (
                <InstagramPreview
                  key="instagram"
                  content={content}
                  userEmail={userEmail}
                />
              );
            }
            if (network === "twitter") {
              return (
                <TwitterPreview
                  key="twitter"
                  content={content}
                  userEmail={userEmail}
                />
              );
            }
            return null;
          })}

          {/* Hooks siempre va último */}
          {results.hooks && (
            <HooksPreview content={results.hooks} />
          )}
        </div>

        {/* Reset */}
        <div className="flex justify-center mt-10">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid #2A2A35",
              color: "#6B7280",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)";
              e.currentTarget.style.color = "#F0F0FF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#2A2A35";
              e.currentTarget.style.color = "#6B7280";
            }}
          >
            <RefreshCw size={14} />
            Generar con otro video
          </button>
        </div>
      </div>
    </section>
  );
}