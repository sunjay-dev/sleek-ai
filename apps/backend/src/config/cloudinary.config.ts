import { v2 as cloudinary } from "cloudinary";
import { backendEnv } from "./env.config.js";
import logger from "@app/logger";

cloudinary.config({
  cloud_name: backendEnv.CLOUDINARY_CLOUD_NAME,
  api_key: backendEnv.CLOUDINARY_API_KEY,
  api_secret: backendEnv.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function ensureUploadPreset() {
  try {
    await cloudinary.api.create_upload_preset({
      name: "sleek-ai",
      max_file_size: MAX_FILE_SIZE,
      folder: "chatty-ai",
      unique_filename: false,
      overwrite: true,
    });
    logger.info({ message: "Upload preset created", preset: "sleek-ai", maxFileSize: MAX_FILE_SIZE });
  } catch (error: any) {
    if (error?.error?.http_code === 409 || error?.http_code === 409) {
      try {
        await cloudinary.api.update_upload_preset("sleek-ai", {
          max_file_size: MAX_FILE_SIZE,
        });
        logger.info({ message: "Upload preset updated", preset: "sleek-ai", maxFileSize: MAX_FILE_SIZE });
      } catch (updateError) {
        logger.error({ message: "Failed to update upload preset", error: updateError });
      }
    } else {
      logger.error({ message: "Failed to ensure upload preset", error });
    }
  }
}

export default cloudinary;
