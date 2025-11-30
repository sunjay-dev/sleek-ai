import { Hono } from "hono";
import { handleClerkWebHook } from "../controllers/clerk.controllers.js";
import { verifyClerkWebhook } from "../middlewares/clerk.middlewares.js";
const router = new Hono();

router.post("/webhook", verifyClerkWebhook, handleClerkWebHook);

export default router;