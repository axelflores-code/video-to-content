"use client";
import Link from "next/link";// ← añade User al import existente de lucide-react
import { useState } from "react";
import { Zap } from "lucide-react";
import GenerateForm, {
  type GeneratedContent,
  type SocialNetwork,
  type ToneOfVoice,
} from "@/components/GenerateForm";
import ResultsSection from "@/components/ResultsSection";
import AuthStatus from "@/components/AuthStatus";

const STATS = [
  { value: "3", label: "formatos por video" },
  { value: "<30s", label: "tiempo de generación" },
  { value: "100%", label: "listo para publicar" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "VideoToContent",
  description:
    "Genera posts, carruseles y ganchos desde cualquier video de YouTube usando IA.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

interface ResultState {
  data: GeneratedContent;
  networks: SocialNetwork[];
  tone: ToneOfVoice;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultState | null>(null);

 const handleResults = (
  data: GeneratedContent,
  networks: SocialNetwork[],
  tone: ToneOfVoice
) => {
  setResult({ data, networks, tone });
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen" style={{ background: "var(--color-background)" }}>

        {/* Glow decorativo */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, #7C3AED18, transparent)",
          }}
          aria-hidden="true"
        />

        {/* Header */}
        <header
          className="relative z-10 sticky top-0 backdrop-blur-sm"
          style={{
            borderBottom: "1px solid color-mix(in srgb, var(--color-border) 60%, transparent)",
            background: "color-mix(in srgb, var(--color-background) 80%, transparent)",
          }}
        >
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-2">
            <div
              className="p-1.5 rounded-lg"
              style={{
                background:
                  "color-mix(in srgb, var(--color-accent) 10%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)",
              }}
            >
              <Zap size={15} style={{ color: "var(--color-accent)" }} />
            </div>
            <span
              className="text-sm font-semibold"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-jetbrains)",
              }}
            >
              VideoToContent
            </span>
            <span
  className="text-xs px-2 py-0.5 rounded-full"
  style={{
    background: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text-muted)",
    fontFamily: "var(--font-jetbrains)",
  }}
>
  beta
</span>

<AuthStatus />
          </div>
        </header>

        {/* Hero */}
        <section className="relative z-10 pt-20 pb-16 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background:
                  "color-mix(in srgb, var(--color-accent) 10%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "var(--color-accent)" }}
              />
              <span
                className="text-xs font-medium"
                style={{
                  color: "var(--color-accent)",
                  fontFamily: "var(--font-jetbrains)",
                }}
              >
                Hecho especialmente para infoproductores
              </span>
            </div>

            {/* Título */}
            <div className="space-y-4">
              <h1
                className="text-5xl md:text-6xl font-bold leading-tight text-balance"
                style={{ color: "var(--color-text-primary)" }}
              >
                Transforma tus videos{" "}
               <span
  style={{
    color: "#a78bfa",
  }}
>
  en clientes
</span>
              </h1>
              <p
                className="text-lg max-w-xl mx-auto text-balance leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                Pega la URL de tu video, elige tu red social y tono — y obtén
                posts, carruseles y ganchos listos para publicar en segundos.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-10">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="font-bold text-xl"
                    style={{
                      color: "var(--color-accent)",
                      fontFamily: "var(--font-jetbrains)",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "var(--color-text-subtle)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Formulario */}
            <GenerateForm
              onResults={handleResults}
              onLoading={setIsLoading}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* Resultados */}
        {result && (
          <ResultsSection
            results={result.data}
            networks={result.networks}
            tone={result.tone}
            onReset={() => setResult(null)}
          />
        )}

        {/* Footer */}
        <footer
          className="relative z-10 py-8 px-6"
          style={{
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Zap size={13} style={{ color: "var(--color-accent)" }} />
              <span
                className="text-xs font-medium"
                style={{
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-jetbrains)",
                }}
              >
                VideoToContent
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
              Hecho para infoproductores que no tienen tiempo que perder.
            </p>
            <p
              className="text-xs"
              style={{
                color: "var(--color-text-subtle)",
                fontFamily: "var(--font-jetbrains)",
              }}
            >
              v1.0.0-beta
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}