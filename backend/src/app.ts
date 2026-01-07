import { Hono } from "hono";
import { cors } from "hono/cors";
const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: process.env.CLIENT_URL!,
    allowHeaders: ["x-client-timezone", "Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

import serverRoutes from "./routes/server.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import clerkRouter from "./routes/clerk.routes.js";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middlewares.js";

app.route("/", serverRoutes);
app.route("/api/chat", chatRouter);
app.route("/api/chat/:chatId/message", messageRouter);
app.route("/api/user", userRouter);
app.route("/api/clerk", clerkRouter);

app.onError(errorHandler);

export default {
  port: 3000,
  idleTimeout: 30,
  fetch: app.fetch,
};
