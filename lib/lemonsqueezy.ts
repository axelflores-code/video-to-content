// lib/lemonsqueezy.ts
const LEMONSQUEEZY_API_URL = "https://api.lemonsqueezy.com/v1";

export async function createCheckoutUrl(
  userEmail: string,
  userId: string
): Promise<string> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Debug — aparecerá en los logs de Vercel
  console.log("[lemonsqueezy] Config:", {
    hasApiKey: !!apiKey,
    storeId,
    variantId,
    baseUrl,
  });

  if (!apiKey || !storeId || !variantId || !baseUrl) {
    throw new Error(
      `Variables de entorno faltantes: ${[
        !apiKey && "LEMONSQUEEZY_API_KEY",
        !storeId && "LEMONSQUEEZY_STORE_ID",
        !variantId && "LEMONSQUEEZY_VARIANT_ID",
        !baseUrl && "NEXT_PUBLIC_BASE_URL",
      ]
        .filter(Boolean)
        .join(", ")}`
    );
  }

  const body = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_data: {
          email: userEmail,
          custom: { user_id: userId },
        },
        product_options: {
          redirect_url: `${baseUrl}/profile?upgraded=true`,
        },
      },
      relationships: {
        store: {
          data: {
            type: "stores",
            id: String(storeId),
          },
        },
        variant: {
          data: {
            type: "variants",
            id: String(variantId),
          },
        },
      },
    },
  };

  console.log("[lemonsqueezy] Request body:", JSON.stringify(body, null, 2));

  const response = await fetch(`${LEMONSQUEEZY_API_URL}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("[lemonsqueezy] Error response:", JSON.stringify(data, null, 2));
    throw new Error(
      data.errors?.[0]?.detail ?? "Error al crear el checkout."
    );
  }

  console.log("[lemonsqueezy] Checkout creado:", data.data.attributes.url);
  return data.data.attributes.url as string;
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require("crypto");
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return hmac === signature;
}