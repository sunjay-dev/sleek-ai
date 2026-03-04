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
import searchRouter from "./routes/search.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middlewares.js";

app.route("/", serverRoutes);
app.route("/api/chat", chatRouter);
app.route("/api/chat/:chatId/message", messageRouter);
app.route("/api/user", userRouter);
app.route("/api/upload", uploadRouter);
app.route("/api/search", searchRouter);
app.route("/api/clerk", clerkRouter);

app.onError(errorHandler);

// import { Queue } from "bullmq";

// const fileIngestQueue = new Queue("file-ingest", {
//   connection: {
//     url: process.env.REDIS_URL!,
//   },
//   defaultJobOptions: {
//     attempts: 3,
//     backoff: {
//       type: "exponential",
//       delay: 3000,
//     },
//     removeOnComplete: true,
//     removeOnFail: false,
//   },
// });

// fileIngestQueue.add("ingest", {
//   fileUrl: "https://res.cloudinary.com/dzxcifimr/raw/upload/v1768761888/chatty-ai/qytcyksxdqadx2xa4nen.txt",
//   userId: "user_38KrOBnsnDtO35wpRPwMvdfPhQU",
//   chatId: "1e4efe47-424f-4fa0-9824-57a518ad089d",
//   fileId: "57ae0bf3-8ad8-4c14-abd0-f1eec0c60eed",
// });

export default {
  port: process.env.PORT as string,
  idleTimeout: 30,
  fetch: app.fetch,
};
