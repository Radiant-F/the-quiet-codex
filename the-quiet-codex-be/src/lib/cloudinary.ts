import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface CloudinaryError {
  message: string;
  http_code?: number;
}

/**
 * Upload an image to Cloudinary with automatic optimization
 * - Auto format selection (webp, avif, etc.)
 * - Auto quality optimization
 * - Resized to max 512x512 for profile pictures
 * - Cropped to fill with face detection
 */
export async function uploadProfileImage(
  fileBuffer: Buffer | ArrayBuffer,
  userId: string,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.isBuffer(fileBuffer)
      ? fileBuffer
      : Buffer.from(fileBuffer);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "the-quiet-codex/profiles",
        public_id: `user_${userId}_${String(Date.now())}`,
        resource_type: "image",
        // Auto optimization settings
        transformation: [
          {
            width: 512,
            height: 512,
            crop: "fill",
            gravity: "face", // Prioritize face detection for cropping
            quality: "auto:good", // Automatic quality optimization
            fetch_format: "auto", // Automatic format selection (webp, avif, etc.)
          },
        ],
        // Additional optimization
        eager: [
          // Generate a smaller thumbnail version as well
          {
            width: 128,
            height: 128,
            crop: "fill",
            gravity: "face",
            quality: "auto:good",
            fetch_format: "auto",
          },
        ],
        eager_async: true,
        // Overwrite if same public_id exists
        overwrite: true,
        // Only allow image types
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "avif"],
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload returned no result"));
          return;
        }

        resolve({
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      },
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by public ID
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = (await cloudinary.uploader.destroy(publicId)) as {
      result: string;
    };
    return result.result === "ok";
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
    return false;
  }
}

/**
 * Upload an image to Cloudinary without any transformations
 * Used for article banners where quality is handled on the frontend
 */
export async function uploadRawImage(
  fileBuffer: Buffer | ArrayBuffer,
  folder: string,
  publicId: string,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.isBuffer(fileBuffer)
      ? fileBuffer
      : Buffer.from(fileBuffer);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        // No transformations - upload as-is
        overwrite: true,
        // Only allow image types
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "avif"],
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload returned no result"));
          return;
        }

        resolve({
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      },
    );

    uploadStream.end(buffer);
  });
}

/**
 * Get optimized URL for a profile image
 * Uses Cloudinary's automatic format and quality optimization
 */
export function getOptimizedProfileUrl(
  publicId: string,
  options?: { width?: number; height?: number },
): string {
  const width = options?.width ?? 512;
  const height = options?.height ?? 512;

  return cloudinary.url(publicId, {
    transformation: [
      {
        width,
        height,
        crop: "fill",
        gravity: "face",
        quality: "auto:good",
        fetch_format: "auto",
      },
    ],
    secure: true,
  });
}

/**
 * Extract public ID from a Cloudinary URL
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Match the pattern: .../upload/v{version}/{folder}/{public_id}.{ext}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export { cloudinary };
