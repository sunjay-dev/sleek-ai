import { Hono } from "hono";
import { handleFileSignature } from "../controllers/upload.controllers.js";
import { clerkMiddleware } from "@hono/clerk-auth";
import { checkUser } from "../middlewares/auth.middlewares.js";
const router = new Hono();

router.get("/", clerkMiddleware(), checkUser, handleFileSignature);

export default router;
