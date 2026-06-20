// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutUrl } from "@/lib/lemonsqueezy";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: "No autenticado." },
        { status: 401 }
      );
    }

    const checkoutUrl = await createCheckoutUrl(
      user.email!,
      user.id
    );

    return NextResponse.json({ url: checkoutUrl }, { status: 200 });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Error inesperado.";
    console.error("[checkout] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}