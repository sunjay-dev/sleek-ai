import { Hono } from "hono";
import { handleClerkWebHook } from "../controllers/clerk.controllers";
import { verifyClerkWebhook } from "../middlewares/clerk.middlewares";
const router = new Hono();

router.post("/webhook", verifyClerkWebhook, handleClerkWebHook);

export default router;