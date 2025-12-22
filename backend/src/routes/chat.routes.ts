import { Hono } from "hono";
import {
  handleChatResponse,
  handleCreateUserChat,
  handleDeleteUserChat,
  handleGetChatMessages,
  handleGetUserChats,
} from "../controllers/chat.controllers.js";
import { clerkMiddleware } from "@hono/clerk-auth";
import { checkUser } from "../middlewares/auth.middlewares.js";
import { validate, validateParams } from "../middlewares/validate.middlewares.js";
import { chatIdParamSchema, chatResponseSchema, querySchema } from "../schemas/chat.schema.js";
const router = new Hono();

router.get("/", clerkMiddleware(), checkUser, handleGetUserChats);
router.get("/messages/:chatId", clerkMiddleware(), checkUser, validateParams(chatIdParamSchema), handleGetChatMessages);
router.post("/", clerkMiddleware(), checkUser, validate(querySchema), handleCreateUserChat);
router.put("/:chatId", clerkMiddleware(), checkUser, validateParams(chatIdParamSchema), validate(chatResponseSchema), handleChatResponse);
router.delete("/:chatId", clerkMiddleware(), checkUser, validateParams(chatIdParamSchema), handleDeleteUserChat);

export default router;
