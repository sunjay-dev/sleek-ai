import { v2 as cloudinary } from "cloudinary";
import { backendEnv } from "./env.config.js";

cloudinary.config({
  cloud_name: backendEnv.CLOUDINARY_CLOUD_NAME,
  api_key: backendEnv.CLOUDINARY_API_KEY,
  api_secret: backendEnv.CLOUDINARY_API_SECRET,
});

export default cloudinary;
