// app/api/webhooks/lemonsqueezy/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyWebhookSignature } from "@/lib/lemonsqueezy";

// Cliente con service_role para bypasear RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") ?? "";
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;

    // Verificar que el webhook viene de Lemon Squeezy
    const isValid = verifyWebhookSignature(rawBody, signature, secret);
    if (!isValid) {
      console.error("[webhook] Firma inválida");
      return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;
    const userId = event.meta?.custom_data?.user_id;

    console.log(`[webhook] Evento recibido: ${eventName} para usuario: ${userId}`);

    if (!userId) {
      console.error("[webhook] user_id no encontrado en custom_data");
      return NextResponse.json({ error: "user_id faltante." }, { status: 400 });
    }

    // Eventos que activan premium
    const ACTIVATE_EVENTS = [
      "order_created",
      "subscription_created",
      "subscription_resumed",
      "subscription_unpaused",
    ];

    // Eventos que desactivan premium
    const DEACTIVATE_EVENTS = [
      "subscription_cancelled",
      "subscription_expired",
      "subscription_paused",
    ];

    if (ACTIVATE_EVENTS.includes(eventName)) {
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ is_premium: true })
        .eq("id", userId);

      if (error) {
        console.error("[webhook] Error activando premium:", error.message);
        return NextResponse.json({ error: "Error actualizando perfil." }, { status: 500 });
      }

      console.log(`[webhook] Premium activado para: ${userId}`);
    }

    if (DEACTIVATE_EVENTS.includes(eventName)) {
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ is_premium: false })
        .eq("id", userId);

      if (error) {
        console.error("[webhook] Error desactivando premium:", error.message);
        return NextResponse.json({ error: "Error actualizando perfil." }, { status: 500 });
      }

      console.log(`[webhook] Premium desactivado para: ${userId}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (err) {
    console.error("[webhook] Error:", err);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}