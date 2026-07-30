import { serve } from "@hono/node-server";
import { backendEnv } from "./config/env.config.js";
import { Hono } from "hono";
import logger from "@app/logger";
import apiRouter from "./api.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middlewares.js";
import { serveFrontend } from "./static/serveFrontend.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono();
app.use("*", secureHeaders());

app.route("/api/v1", apiRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "../../frontend/dist");
serveFrontend(app, frontendRoot);

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
