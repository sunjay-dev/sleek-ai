import { Hono } from "hono";
import {
  handleCreateUserChat,
  handleDeleteUserChat,
  handleGetUserChats,
  handleRenameUserChat,
  handleDeleteAllUserChat,
} from "../controllers/chat.controllers.js";
import { clerkMiddleware } from "@hono/clerk-auth";
import { checkUser } from "../middlewares/auth.middlewares.js";
import { validate, validateParams } from "../middlewares/validate.middlewares.js";
import { chatIdParamSchema, chatRenameSchema, querySchema } from "../schemas/chat.schema.js";
const router = new Hono();

router.get("/", clerkMiddleware(), checkUser, handleGetUserChats);
router.post("/", clerkMiddleware(), checkUser, validate(querySchema), handleCreateUserChat);
router.patch("/:chatId", clerkMiddleware(), checkUser, validateParams(chatIdParamSchema), validate(chatRenameSchema), handleRenameUserChat);
router.delete("/:chatId", clerkMiddleware(), checkUser, validateParams(chatIdParamSchema), handleDeleteUserChat);
router.delete("/", clerkMiddleware(), checkUser, handleDeleteAllUserChat);

export default router;
