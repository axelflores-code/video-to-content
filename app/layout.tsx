// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://videotocontent.app";

export const viewport: Viewport = {
  themeColor: "#7C3AED",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "VideoToContent — Transforma tus videos de YouTube en contenido que vende",
    template: "%s | VideoToContent",
  },
  description:
    "Pega la URL de tu video de YouTube y genera al instante posts de LinkedIn, carruseles y ganchos para redes sociales usando Inteligencia Artificial. Ideal para infoproductores y creadores de contenido.",
  keywords: [
    "infoproductos",
    "contenido para redes sociales",
    "IA para creadores",
    "LinkedIn posts",
    "carruseles Instagram",
    "YouTube a texto",
    "marketing de contenido",
    "inteligencia artificial",
  ],
  authors: [{ name: "VideoToContent" }],
  creator: "VideoToContent",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: BASE_URL,
    siteName: "VideoToContent",
    title: "VideoToContent — Transforma tus videos en clientes",
    description:
      "Genera posts de LinkedIn, carruseles y ganchos desde cualquier video de YouTube en segundos.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VideoToContent — IA para infoproductores",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VideoToContent — Transforma tus videos en clientes",
    description:
      "Genera posts de LinkedIn, carruseles y ganchos desde cualquier video de YouTube en segundos.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-[var(--color-background)] text-[var(--color-text-primary)] min-h-screen font-[var(--font-inter)] antialiased">
        {children}
      </body>
    </html>
  );
}