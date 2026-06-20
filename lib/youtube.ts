import { YoutubeTranscript } from "youtube-transcript";
import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export function extractVideoId(url: string): string | null {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

// 💥 NUEVA OPTIMIZACIÓN LOCAL (Costo $0 tokens)
function preCleanTextWithRegex(text: string): string {
  if (!text) return "";
  return text
    // Elimina marcas de tiempo si existieran en el texto
    .replace(/\[\d{2}:\d{2}(:\d{2})?\]/g, "")
    .replace(/\b\d{2}:\d{2}(:\d{2})?\b/g, "")
    // Barre muletillas comunes en español de forma masiva
    .replace(/\b(eh|ehh|ehhh|em|mmm|o sea|es decir|bueno|nada|digamos)\b/gi, "")
    // Elimina espacios múltiples generados por los reemplazos
    .replace(/\s+/g, " ")
    .trim();
}

async function cleanTranscript(rawText: string): Promise<string> {
  const compressedText = preCleanTextWithRegex(rawText);

  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    max_tokens: 2048, // ← Bajamos esto también para asegurar que no se pase del output diario
    temperature: 0.1, 
    messages: [
      {
        role: "system",
        content: "Corrige ortografía, puntuación y añade párrafos lógicos a esta transcripción de YouTube. Elimina muletillas y repeticiones. NO resumas ni cambies el significado. Devuelve SOLO el texto corregido, sin introducciones ni comentarios."
      },
      {
        role: "user",
        content: compressedText,
      },
    ],
  });

  return completion.choices[0]?.message?.content ?? compressedText;
}

export async function getTranscript(url: string): Promise<string> {
  const videoId = extractVideoId(url);

  if (!videoId) {
    throw new Error("No se pudo extraer el ID del video. Verifica la URL.");
  }

  try {
    let transcript;
    try {
      transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang: "es" });
    } catch {
      transcript = await YoutubeTranscript.fetchTranscript(videoId);
    }

    if (!transcript || transcript.length === 0) {
      throw new Error("Este video no tiene transcripción disponible.");
    }

    // Une todos los fragmentos
    const rawText = transcript
      .map((chunk) => chunk.text.trim())
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    // ✂️ BAJAMOS EL LÍMITE DE PALABRAS PARA PROTEGER TU CUENTA FREE
    const words = rawText.split(" ");
    const trimmed = words.length > 2000
      ? words.slice(0, 2000).join(" ") + "..."
      : rawText;

    // Corrige ortografía y puntuación con IA
    console.log("[youtube] Limpiando transcripción...");
    const cleaned = await cleanTranscript(trimmed);
    console.log(`[youtube] Transcripción lista: ${cleaned.length} chars`);

    return cleaned;

  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("Transcript is disabled")) {
        throw new Error("Las transcripciones están desactivadas en este video.");
      }
      if (err.message.includes("Could not find")) {
        throw new Error("No se encontró transcripción. Intenta con otro video.");
      }
      throw err;
    }
    throw new Error("Error al obtener la transcripción del video.");
  }
}