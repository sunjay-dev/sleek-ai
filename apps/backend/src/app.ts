import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { backendEnv } from "./config/env.config.js";
import { Hono } from "hono";
import { cors } from "hono/cors";
import logger from "./utils/logger.utils.js";

import serverRoutes from "./routes/server.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import webHookRouter from "./routes/webHook.routes.js";
import userRouter from "./routes/user.routes.js";
import searchRouter from "./routes/search.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middlewares.js";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: backendEnv.CLIENT_URL,
    allowHeaders: ["x-client-timezone", "Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.route("/api/", serverRoutes);
app.route("/api/chat", chatRouter);
app.route("/api/chat/:chatId/message", messageRouter);
app.route("/api/user", userRouter);
app.route("/api/upload", uploadRouter);
app.route("/api/search", searchRouter);
app.route("/api/webhooks", webHookRouter);

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
