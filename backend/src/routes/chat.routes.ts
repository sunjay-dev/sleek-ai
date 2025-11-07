import { Hono } from "hono";
import { handleStreamAIResponse, handleListModels, handleAIResponse } from "../controllers/chat.controllers";
import { clerkMiddleware } from '@hono/clerk-auth'
import { checkUser } from "../middlewares/auth.middlewares";
const router = new Hono();

router.post("/",  clerkMiddleware(), checkUser, handleAIResponse);
router.post("/stream", clerkMiddleware(), checkUser, handleStreamAIResponse);

router.get("/listModels", handleListModels);

export default router;