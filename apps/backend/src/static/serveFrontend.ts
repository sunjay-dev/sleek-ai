import { serveStatic } from "@hono/node-server/serve-static";
import path from "node:path";
import type { Hono } from "hono";

export function serveFrontend(app: Hono, frontendRoot: string) {
  app.use(
    "/*",
    serveStatic({
      root: frontendRoot,

      onFound(filePath, c) {
        const name = path.basename(filePath);

        if (name === "index.html") {
          c.header("Cache-Control", "public, max-age=0, must-revalidate");
          return;
        }

        if (name === "sw.js" || name === "registerSW.js" || name === "manifest.webmanifest") {
          c.header("Cache-Control", "no-cache");
          return;
        }

        const isHashed = /[-.][A-Za-z0-9]{8,}(?=\.)/.test(name);

        c.header("Cache-Control", isHashed ? "public, max-age=31536000, immutable" : "public, max-age=86400");
      },
    }),
  );

  const spaFallback = serveStatic({
    root: frontendRoot,
    rewriteRequestPath: () => "/index.html",
  });

  app.get("*", (c, next) => {
    return spaFallback(c, next);
  });
}
