// lib/lemonsqueezy.ts
const LEMONSQUEEZY_API_URL = "https://api.lemonsqueezy.com/v1";

const headers = {
  Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
  Accept: "application/vnd.api+json",
  "Content-Type": "application/vnd.api+json",
};

export async function createCheckoutUrl(userEmail: string, userId: string): Promise<string> {
  const response = await fetch(`${LEMONSQUEEZY_API_URL}/checkouts`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: userEmail,
            custom: { user_id: userId },
          },
          product_options: {
            redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?upgraded=true`,
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMONSQUEEZY_STORE_ID,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: process.env.LEMONSQUEEZY_VARIANT_ID,
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[lemonsqueezy] Error creating checkout:", error);
    throw new Error("No se pudo crear el checkout.");
  }

  const data = await response.json();
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