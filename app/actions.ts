"use server";

import { uploadFileToGemini } from "@/lib/gemini";

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, error: "No file provided" };
  }
  return await uploadFileToGemini(file);
}
