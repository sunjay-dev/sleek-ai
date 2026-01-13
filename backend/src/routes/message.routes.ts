import { Hono } from "hono";
import { handleUserMessageResponse, handleGetAllChatMessages } from "../controllers/message.controllers.js";
import { clerkMiddleware } from "@hono/clerk-auth";
import { checkUser } from "../middlewares/auth.middlewares.js";
import { validate, validateParams } from "../middlewares/validate.middlewares.js";
import { chatIdParamSchema, chatResponseSchema } from "@app/shared/src/schemas/chat.schema.js";
const router = new Hono();

router.get("/", clerkMiddleware(), checkUser, validateParams(chatIdParamSchema), handleGetAllChatMessages);
router.post("/", clerkMiddleware(), checkUser, validateParams(chatIdParamSchema), validate(chatResponseSchema), handleUserMessageResponse);

export default router;
