import { Hono } from "hono";
import { handleClerkWebHook } from "../controllers/webHook.controllers.js";
import { verifyClerkWebhook } from "../middlewares/clerk.middlewares.js";
const router = new Hono();

router.post("/clerk", verifyClerkWebhook, handleClerkWebHook);

export default router;
