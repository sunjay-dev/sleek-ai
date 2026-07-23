import { Hono } from "hono";
import {
  handleDeleteAllMemories,
  handleDeleteUserMemory,
  handleGetUserMemories,
  handleGetUserPreferences,
  handleUpdateUserPreferences,
} from "../controllers/user.controllers.js";
import { clerkMiddleware } from "@hono/clerk-auth";
import { checkUser } from "../middlewares/auth.middlewares.js";
import { validate, validateParams } from "../middlewares/validate.middlewares.js";
import { userPreferencesSchema } from "@app/shared/src/schemas/user.schema.js";
import { memoryIdParamSchema } from "@app/shared/src/schemas/memory.schema.js";

const router = new Hono();

router.get("/preferences", clerkMiddleware(), checkUser, handleGetUserPreferences);
router.put("/preferences", clerkMiddleware(), checkUser, validate(userPreferencesSchema), handleUpdateUserPreferences);

router.get("/memories", clerkMiddleware(), checkUser, handleGetUserMemories);
router.delete("/memories", clerkMiddleware(), checkUser, handleDeleteAllMemories);
router.delete("/memories/:memoryId", clerkMiddleware(), checkUser, validateParams(memoryIdParamSchema), handleDeleteUserMemory);

export default router;
