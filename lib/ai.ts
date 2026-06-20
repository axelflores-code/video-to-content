import Groq from "groq-sdk";
import type { GeneratedContent } from "@/types";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

function cleanTranscriptLocally(text: string): string {
  return text
    .replace(/\[música\]|\[aplausos\]|\[risas\]/gi, "")
    .replace(/\b(eh|umm|mmm|o sea|digamos|básicamente|literalmente|pues)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .substring(0, 10000);
}

const TONE_VOICE: Record<string, string> = {
  professional: "Autoridad ganada. Frases cortas. Datos concretos. Sin adornos.",
  persuasive:   "Urgencia real. Contraste antes/después. El lector debe actuar YA.",
  casual:       "Como un amigo que comparte un descubrimiento. Natural, no forzado.",
};

// Reglas de formato que cambian según el tono
const TONE_FORMAT: Record<string, {
  maxWords: number;
  emojis: string;
  hashtags: string;
  style: string;
}> = {
  professional: {
    maxWords: 280,
    emojis: "CERO emojis. Ninguno. El peso lo lleva el texto.",
    hashtags: "Máximo 3 hashtags técnicos y relevantes al final. Sin línea extra.",
    style: "Párrafos cortos. Lenguaje directo. Datos y ejemplos concretos. Sin frases de relleno.",
  },
  persuasive: {
    maxWords: 260,
    emojis: "Máximo 2 emojis estratégicos que refuercen el mensaje, no decorativos.",
    hashtags: "2-4 hashtags relevantes al final separados del texto con una línea en blanco.",
    style: "Contraste claro. Frases de impacto. Urgencia real sin manipulación. CTA directo.",
  },
  casual: {
    maxWords: 220,
    emojis: "1-3 emojis naturales dentro del texto donde aporten contexto emocional real. Nada de 🚀🔥💎.",
    hashtags: "1-3 hashtags conversacionales al final separados con línea en blanco.",
    style: "Voz conversacional. Como si escribieras un mensaje largo a un amigo. Contracciones naturales. Humor sutil si surge del contenido.",
  },
};

// PASO 1: ANALISTA 
async function extractGold(transcript: string): Promise<string> {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 2000,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Eres un Analista de Contenido experto. Tu único trabajo es leer transcripciones y extraer las ideas más valiosas. Respondes SOLO con JSON: {"ideas": [...]}`,
      },
      {
        role: "user",
        content: `Lee esta transcripción y extrae las 5 ideas, estrategias o consejos más valiosos y accionables.
        
TRANSCRIPCIÓN:
"""
${transcript}
"""

Responde SOLO con este JSON:
{
  "ideas": [
    {
      "titulo": "Título de la idea",
      "desarrollo": "Explicación completa con contexto. Mínimo 60 palabras.",
      "frase_clave": "La frase más poderosa del autor relacionada."
    }
  ]
}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  try {
    const parsed = JSON.parse(raw);
    return parsed.ideas
      .map((idea: any, i: number) => `IDEA ${i + 1}: ${idea.titulo}\n${idea.desarrollo}\nFrase clave: "${idea.frase_clave}"`)
      .join("\n\n---\n\n");
  } catch {
    throw new Error("Error al analizar el video.");
  }
}

// PASO 2: COPYWRITER MAESTRO (Optimizado para evitar el texto plano)
async function generateAllFormats(ideas: string, tone: string): Promise<any> {
  // Extraemos tus reglas configuradas arriba
  const rules = TONE_FORMAT[tone] || TONE_FORMAT.professional;

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 3000,
    temperature: 0.55, // Subimos un pelín la temperatura para que sea más natural y menos robótico
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Eres un Copywriter de Élite especializado en redes sociales. Tu trabajo es transformar insights de un video en piezas de contenido nativas y magnéticas.
        
REGLAS ESPECÍFICAS DE TONO Y ESTILO:
- Tono General: ${TONE_VOICE[tone]}
- Formato y Redacción: ${rules.style}
- Emojis: ${rules.emojis}
- Hashtags: ${rules.hashtags}
- Límite: Intenta no superar las ${rules.maxWords} palabras por post para mantenerlo ultra legible.

REGLAS DE DISEÑO VISUAL (CRUCIAL):
1. CERO BLOQUES DE TEXTO: Usa frases cortas. Separa CADA párrafo con un doble salto de línea (espacio en blanco). El texto debe "respirar" y ser fácil de leer en móviles.
2. FIDELIDAD: Usa SOLO los datos reales del video proporcionado. No inventes conceptos externos.
3. No uses clichés aburridos de IA al inicio. Ve directo al grano.`,
      },
      {
        role: "user",
        content: `IDEAS EXTRAÍDAS DEL VIDEO:
"""
${ideas}
"""

Genera exactamente estos 4 formatos en la respuesta JSON:

1. linkedin: Post de alto valor. Si el tono es "Cercano", hazlo empático, usando historias y algunos emojis sutiles. Si es "Profesional", mantén la autoridad. Usa párrafos de máximo 3 líneas y la estructura PAS (Problema -> Agitación -> Solución). Incluye los hashtags correspondientes al final del texto.

2. instagram: Post dinámico y visual para la descripción (caption). Usa viñetas (bullet points) para listar los puntos clave de forma escaneable. Integra los emojis estratégicos permitidos a lo largo del texto para romper la monotonía visual. Incluye un bloque de hashtags al final separado por una línea en blanco.

3. twitter: Hilo de exactamente 5 tweets. Cada tweet debe numerarse ("1/", "2/", etc.), ser corto, directo y dejar gancho para leer el siguiente.

4. hooks: Lista de 5 ganchos de impacto cortos (del 1 al 5) para usar como alternativas de primera línea.

Responde ÚNICAMENTE con este formato JSON:
{
  "linkedin": "Cuerpo del post para LinkedIn...",
  "instagram": "Cuerpo del post para Instagram...",
  "twitter": "Estructura del hilo de Twitter...",
  "hooks": "1. [Gancho 1]\\n2. [Gancho 2]..."
}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Error generando los formatos.");
  }
}

// ─── FUNCIÓN PRINCIPAL (Aquí ves los resultados claramente) ───
export async function generateContent(
  transcript: string,
  _networks: string[],
  tone: string
): Promise<GeneratedContent> {
  
  const clean = cleanTranscriptLocally(transcript);

  // 1. Extraemos el oro
  const ideas = await extractGold(clean);
  
  await new Promise(r => setTimeout(r, 2000));

  // 2. Generamos todo en una sola llamada
  const rawContent = await generateAllFormats(ideas, tone);

  // 3. Mapeo explícito para que veas dónde va cada red social
  const linkedinPost  = rawContent.linkedin;
  const instagramPost = rawContent.instagram;
  const twitterPost   = rawContent.twitter;
  const hooks         = rawContent.hooks;

  console.log("[ai] Contenido para LinkedIn, IG y X empaquetado con éxito.");

  return {
    linkedinPost,
    instagramPost,
    twitterPost,
    hooks,
  };
}