import { Hono } from "hono";
import { handleGetUserPreferences, handleUpdateUserPreferences } from "../controllers/userPreferences.controllers.js";
import { clerkMiddleware } from "@hono/clerk-auth";
import { checkUser } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { userPreferencesSchema } from "../schemas/user.schema.js";

const router = new Hono();

router.get("/", clerkMiddleware(), checkUser, handleGetUserPreferences);
router.put("/", clerkMiddleware(), checkUser, validate(userPreferencesSchema), handleUpdateUserPreferences);

export default router;
