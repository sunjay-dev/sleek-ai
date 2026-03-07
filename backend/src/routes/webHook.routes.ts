import { Hono } from "hono";
import { handleClerkWebHook, handleRagWebhook } from "../controllers/webHook.controllers.js";
import { verifyClerkWebhook } from "../middlewares/clerk.middlewares.js";
const router = new Hono();

router.post("/clerk", verifyClerkWebhook, handleClerkWebHook);
router.post("/rag-status", handleRagWebhook);

export default router;
