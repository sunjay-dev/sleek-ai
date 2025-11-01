import { Hono } from "hono";
import {handleAskAI, handleListModels} from "../controllers/chat.controllers";

const router = new Hono();

router.post("/", handleAskAI);

router.get("/listModels", handleListModels);

export default router;