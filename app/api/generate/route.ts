import { NextRequest, NextResponse } from "next/server";
import { getTranscript } from "@/lib/youtube";
import { generateContent } from "@/lib/ai";

export const maxDuration = 60;

const VALID_NETWORKS = ["linkedin", "instagram", "twitter"];
const VALID_TONES    = ["professional", "persuasive", "casual"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, networks, tone } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL requerida." }, { status: 400 });
    }
    if (!Array.isArray(networks) || networks.length === 0 || !networks.every((n: string) => VALID_NETWORKS.includes(n))) {
      return NextResponse.json({ error: "Selecciona al menos una red social válida." }, { status: 400 });
    }
    if (!tone || !VALID_TONES.includes(tone)) {
      return NextResponse.json({ error: "Tono de voz inválido." }, { status: 400 });
    }
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Error de configuración." }, { status: 500 });
    }

    // 1. Descarga la transcripción y ejecuta la limpieza económica (con Llama 8B)
    const transcript = await getTranscript(url.trim());
    
    // 2. ⏳ PAUSA DE CONTROL: Espera de 2.5 segundos para resetear el límite de tokens por minuto (TPM) en Groq
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // 3. Envía el texto ultra limpio a las llamadas en paralelo de generación (Llama 70B)
    const content    = await generateContent(transcript, networks, tone);

    return NextResponse.json(content, { status: 200 });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Error inesperado.";
    console.error("[generate] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}