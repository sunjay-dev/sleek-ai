import { Context } from "hono";
import prisma from "../config/prisma.config.js";

export async function handleGetUserPreferences(c: Context) {
  const userId = c.get("user");

  const prefs = await prisma.userPreference.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  return c.json(prefs, 200);
}

export async function handleUpdateUserPreferences(c: Context) {
  const userId = c.get("user");
  const { nickname, occupation, about, customInstructions } = c.get("body");

  const prefs = await prisma.userPreference.upsert({
    where: { userId },
    update: { nickname, occupation, about, customInstructions },
    create: { userId, nickname, occupation, about, customInstructions },
  });

  return c.json(prefs, 200);
}
