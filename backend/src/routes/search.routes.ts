import { Hono } from "hono";
import { handleSearchMessages } from "../controllers/search.controllers.js";
import { clerkMiddleware } from "@hono/clerk-auth";
import { checkUser } from "../middlewares/auth.middlewares.js";
import { validateQuery } from "../middlewares/validate.middlewares.js";
import { searchQuerySchema } from "@app/shared/src/schemas/search.schema.js";
const router = new Hono();

router.get("/", clerkMiddleware(), checkUser, validateQuery(searchQuerySchema), handleSearchMessages);

export default router;
