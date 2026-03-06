import { getAuth } from "@hono/clerk-auth";
import type { Next, Context } from "hono";

export async function checkUser(c: Context, next: Next) {
  const auth = getAuth(c);
  if (!auth?.userId) return c.json({ message: "Please login to access the Sleek ai." }, 401);
  c.set("user", auth.userId);
  await next();
}

export async function prometheusAuth(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ message: "Missing or invalid Authorization header" }, 401);
  }

  const token = authHeader.split(" ")[1];

  if (token !== (process.env.PROMETHEUS_SECRET as string)) {
    return c.json({ message: "Unauthorized access to metrics" }, 403);
  }

  await next();
}
