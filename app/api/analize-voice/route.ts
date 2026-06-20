// app/api/analyze-voice/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { samples } = body as { samples: string[] };

    if (!Array.isArray(samples) || samples.length < 2) {
      return NextResponse.json(
        { error: "Necesitas al menos 2 ejemplos de texto." },
        { status: 400 }
      );
    }

    const validSamples = samples.filter((s) => s && s.trim().length > 20);
    if (validSamples.length < 2) {
      return NextResponse.json(
        { error: "Los ejemplos deben tener al menos 20 caracteres cada uno." },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 600,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Eres un analista de estilo de escritura. Analizas textos y defines un perfil de tono técnico y conciso. Respondes SOLO con JSON.",
        },
        {
          role: "user",
          content: `Analiza estos ${validSamples.length} textos escritos por el mismo creador de contenido. Define su perfil de tono de voz.

ANALIZA:
1. Longitud de las frases (cortas y directas, o largas y explicativas)
2. Uso de emojis (muchos, pocos, solo al final, ninguno)
3. Nivel de formalidad (tutea, habla de "usted", usa jerga/slang)
4. Estructura (saltos de línea constantes, listas, párrafos bloque)
5. Palabras o expresiones recurrentes que usa el autor
6. Cómo abre y cómo cierra sus textos normalmente

TEXTOS DE EJEMPLO:
${validSamples.map((s, i) => `--- Texto ${i + 1} ---\n${s.trim()}`).join("\n\n")}

Responde SOLO con este JSON:
{
  "description": "Un párrafo técnico y conciso (80-120 palabras) describiendo el perfil de tono. Formato: 'Escribe con un tono [adjetivo]. Sus frases son [característica]. Usa [nivel de formalidad]. Suele [estructura]. Repite expresiones como [ejemplos si los hay]. Abre sus textos [patrón] y cierra con [patrón].'"
}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw);

    if (!parsed.description) {
      throw new Error("No se pudo generar el perfil.");
    }

    return NextResponse.json({ description: parsed.description }, { status: 200 });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al analizar el estilo.";
    console.error("[analyze-voice] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}