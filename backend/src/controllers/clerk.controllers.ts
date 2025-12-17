import { type Context } from "hono";
import prisma from "../config/prisma.config.js";
import { InternalServerError } from "../utils/appError.utils.js";

export async function handleClerkWebHook(c: Context) {
  const evt = c.get("clerkEvent");
  const eventType = evt.type;
  const user = evt.data;

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      await prisma.user.upsert({
        where: { clerkId: user.id },
        update: {
          firstName: user.first_name,
          lastName: user.last_name,
          imageUrl: user.profile_image_url,
        },
        create: {
          clerkId: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          imageUrl: user.profile_image_url,
        },
      });
    } else if (eventType === "user.deleted") {
      await prisma.user.deleteMany({
        where: { clerkId: user.id },
      });
    } else {
      return c.json({ ok: false }, 400);
    }

    return c.json({ ok: true }, 200);
  } catch {
    throw new InternalServerError("Error occured while handling Clerk webhook", { ok: false });
  }
}
