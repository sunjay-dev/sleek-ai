import { type Context } from "hono";
import cloudinary from "../config/cloudinary.config.js";
import { backendEnv } from "../config/env.config.js";

export async function handleFileSignature(c: Context) {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "chatty-ai";
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, backendEnv.CLOUDINARY_API_SECRET);

  return c.json(
    {
      signature,
      folder,
      timestamp,
      apiKey: backendEnv.CLOUDINARY_API_KEY,
      cloudName: backendEnv.CLOUDINARY_CLOUD_NAME,
    },
    200,
  );
}
