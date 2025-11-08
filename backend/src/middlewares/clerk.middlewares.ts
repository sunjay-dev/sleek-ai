import { verifyWebhook } from "@clerk/backend/webhooks";
import type { Context, Next } from "hono";

export async function verifyClerkWebhook(c: Context, next: Next) {
  try {
    const evt = await verifyWebhook(c.req.raw, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });

    c.set("clerkEvent", evt);

    await next();
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return c.json({ ok: false, error: "Webhook verification failed" }, 400);
  }
}