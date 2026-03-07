import { Hono } from "hono";
import { cors } from "hono/cors";
const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: process.env.CLIENT_URL as string,
    allowHeaders: ["x-client-timezone", "Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

import serverRoutes from "./routes/server.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import webHookRouter from "./routes/webHook.routes.js";
import userRouter from "./routes/user.routes.js";
import searchRouter from "./routes/search.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middlewares.js";

app.route("/", serverRoutes);
app.route("/api/chat", chatRouter);
app.route("/api/chat/:chatId/message", messageRouter);
app.route("/api/user", userRouter);
app.route("/api/upload", uploadRouter);
app.route("/api/search", searchRouter);
app.route("/api/webhooks", webHookRouter);

app.onError(errorHandler);

export default {
  port: process.env.PORT as string,
  idleTimeout: 30,
  fetch: app.fetch,
};
