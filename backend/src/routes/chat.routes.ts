import { Hono } from "hono";
import { handleChatResponse, handleCreateUserChat, handleGetUserChats } from "../controllers/chat.controllers.js";
import { clerkMiddleware } from "@hono/clerk-auth";
import { checkUser } from "../middlewares/auth.middlewares.js";
const router = new Hono();

router.get("/", clerkMiddleware(), checkUser, handleGetUserChats);
router.post("/", clerkMiddleware(), checkUser, handleCreateUserChat);
router.put("/:chatId", clerkMiddleware(), checkUser, handleChatResponse);

export default router;
