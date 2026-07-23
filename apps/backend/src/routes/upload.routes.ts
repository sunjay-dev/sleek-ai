import { Hono } from "hono";
import { handleFileSignature, handleStartRag } from "../controllers/upload.controllers.js";
import { clerkMiddleware } from "@hono/clerk-auth";
import { checkUser } from "../middlewares/auth.middlewares.js";
const router = new Hono();

router.get("/", clerkMiddleware(), checkUser, handleFileSignature);
router.post("/rag", clerkMiddleware(), checkUser, handleStartRag);

export default router;
