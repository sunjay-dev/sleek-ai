import { type Context } from "hono";
import prisma from "../config/prisma.config.js";
import { createSnippet } from "../utils/search.utils.js";

export async function handleSearchMessages(c: Context) {
  const userId = c.get("user");
  const { q: query } = c.get("query");

  const formattedQuery = query.trim().split(/\s+/).join(" & ");

  const messages = await prisma.message.findMany({
    where: {
      text: {
        search: formattedQuery,
      },
      chat: {
        userId: userId,
      },
    },
    distinct: ["chatId"],
    take: 10,
    orderBy: [{ createdAt: "desc" }],
    select: {
      text: true,
      createdAt: true,
      chatId: true,
      chat: {
        select: { title: true },
      },
    },
  });

  const results = messages.map((msg) => ({
    ...msg,
    text: createSnippet(msg.text, query),
  }));

  return c.json(results, 200);
}
