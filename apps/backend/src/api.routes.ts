import { Hono } from "hono";
import serverRoutes from "./routes/server.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import webHookRouter from "./routes/webHook.routes.js";
import userRouter from "./routes/user.routes.js";
import searchRouter from "./routes/search.routes.js";
import uploadRouter from "./routes/upload.routes.js";

const apiRouter = new Hono();

apiRouter.route("/", serverRoutes);
apiRouter.route("/chat", chatRouter);
apiRouter.route("/chat/:chatId/message", messageRouter);
apiRouter.route("/user", userRouter);
apiRouter.route("/upload", uploadRouter);
apiRouter.route("/search", searchRouter);
apiRouter.route("/webhook", webHookRouter);

export default apiRouter;
