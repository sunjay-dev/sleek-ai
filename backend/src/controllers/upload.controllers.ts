import { type Context } from "hono";
import cloudinary from "../config/cloudinary.config.js";

export async function handleFileSignature(c: Context) {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "chatty-ai";
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, process.env.CLOUDINARY_API_SECRET!);

  return c.json(
    {
      signature,
      folder,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    },
    200,
  );
}
