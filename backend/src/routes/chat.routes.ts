import { Hono } from "hono";
import { handleStreamAIResponse, handleListModels, handleAIResponse } from "../controllers/chat.controllers.js";
import { clerkMiddleware } from "@hono/clerk-auth";
import { checkUser } from "../middlewares/auth.middlewares.js";
const router = new Hono();

router.post("/", clerkMiddleware(), checkUser, handleAIResponse);
router.post("/stream", clerkMiddleware(), checkUser, handleStreamAIResponse);

router.get("/listModels", handleListModels);

export default router;
