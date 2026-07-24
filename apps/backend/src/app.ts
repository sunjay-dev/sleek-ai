import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { backendEnv } from "./config/env.config.js";
import { Hono } from "hono";
import logger from "./utils/logger.utils.js";
import apiRouter from "./api.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middlewares.js";

const app = new Hono();

app.route("/api/v1", apiRouter);

app.use("/*", serveStatic({ root: "../frontend/dist" }));
app.use("/*", serveStatic({ root: "../frontend/dist", rewriteRequestPath: () => "/index.html" }));

app.onError(errorHandler);

serve(
  {
    fetch: app.fetch,
    port: Number(backendEnv.PORT),
  },
  (info) => {
    logger.info(`Server running on http://localhost:${info.port}`);
  },
);
