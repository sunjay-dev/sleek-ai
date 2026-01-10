import { type Context } from "hono";
import prisma from "../config/prisma.config.js";

export async function handleClerkWebHook(c: Context) {
  const evt = c.get("clerkEvent");
  const eventType = evt.type;
  const user = evt.data;

  if (eventType === "user.created" || eventType === "user.updated") {
    const firstName = user.first_name ?? "";
    const lastName = user.last_name ?? "";
    const imageUrl = user.profile_image_url || user.image_url;
    const email = user.email_addresses?.[0]?.email_address;

    await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        firstName,
        lastName,
        imageUrl,
      },
      create: {
        email,
        clerkId: user.id,
        firstName,
        lastName,
        imageUrl,
      },
    });
  } else if (eventType === "user.deleted") {
    await prisma.user.deleteMany({
      where: { clerkId: user.id },
    });

    return c.json({ message: "User deleted" }, 200);
  }
  return c.json({ ok: true }, 200);
}
