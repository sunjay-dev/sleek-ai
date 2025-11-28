import { Context } from "hono";
import register from "../config/prometheus.config";

export function handleHomeRoute(c: Context) {
    return c.text('Hello, Hono!', 200);
}

export function handleHealthRoute(c: Context) {
    return c.text('ok', 200);
}

export async function handlePrometheusMatrics(c: Context) {
    return c.text(await register.metrics(), 200, {
    'Content-Type': register.contentType
  });
}