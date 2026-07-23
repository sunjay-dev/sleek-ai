import { verifyWebhook } from "@clerk/backend/webhooks";
import type { Context, Next } from "hono";
import { BadRequestError } from "../utils/appError.utils.js";
import { backendEnv } from "../config/env.config.js";

export async function verifyClerkWebhook(c: Context, next: Next) {
  try {
    const evt = await verifyWebhook(c.req.raw, {
      signingSecret: backendEnv.CLERK_WEBHOOK_SIGNING_SECRET,
    });

    c.set("clerkEvent", evt);

    await next();
  } catch {
    throw new BadRequestError("Webhook verification failed");
  }
}
