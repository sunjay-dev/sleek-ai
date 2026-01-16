type Props = {
  file: File;
  getToken: () => Promise<string | null>;
};

import { apiRequest } from "@/utils/api";

export const uploadToCloudinary = async ({ file, getToken }: Props) => {
  const token = await getToken();
  if (!token) throw new Error("Authentication required");

  const signRes = await apiRequest(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const { signature, timestamp, apiKey, cloudName, folder } = signRes;

  const resourceType = file.type.startsWith("image/") ? "image" : "raw";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("resource_type", resourceType);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("quality", "auto");
  formData.append("folder", folder);

  const data = await apiRequest(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: formData,
  });

  return {
    fileUrl: data.secure_url,
    fileName: data.original_filename,
    fileType: file.type || `${resourceType}/${data.format}`,
  };
};
