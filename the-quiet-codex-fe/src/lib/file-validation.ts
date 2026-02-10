const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
];

export const MAX_BANNER_SIZE = 1 * 1024 * 1024; // 1 MB
export const MAX_PROFILE_PIC_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateImageFile(
  file: File,
  maxSizeBytes: number,
): { valid: true } | { valid: false; error: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type "${file.type}". Allowed: JPEG, PNG, GIF, WebP, AVIF.`,
    };
  }

  if (file.size > maxSizeBytes) {
    const limitMB = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    const fileMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File is ${fileMB} MB. Maximum allowed is ${limitMB} MB.`,
    };
  }

  return { valid: true };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
