import { userRepository } from "./user.repository";
import { NotFoundError, ConflictError } from "../../lib/errors";
import { uploadProfileImage, deleteImage } from "../../lib/cloudinary";

interface UpdateUserInput {
  username?: string;
  password?: string;
}

interface UserProfile {
  id: string;
  username: string;
  profilePictureUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UploadProfilePictureResult {
  message: string;
  profilePictureUrl: string;
}

export const userService = {
  async getProfile(userId: string): Promise<UserProfile> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return {
      id: user.id,
      username: user.username,
      profilePictureUrl: user.profilePictureUrl,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  },

  async updateProfile(
    userId: string,
    input: UpdateUserInput,
  ): Promise<UserProfile> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updateData: { username?: string; passwordHash?: string } = {};

    if (input.username && input.username !== user.username) {
      const existingUser = await userRepository.findByUsername(input.username);
      if (existingUser) {
        throw new ConflictError("Username already exists");
      }
      updateData.username = input.username;
    }

    if (input.password) {
      updateData.passwordHash = await Bun.password.hash(input.password);
    }

    if (Object.keys(updateData).length === 0) {
      return {
        id: user.id,
        username: user.username,
        profilePictureUrl: user.profilePictureUrl,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    }

    const updatedUser = await userRepository.update(userId, updateData);

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      profilePictureUrl: updatedUser.profilePictureUrl,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    };
  },

  async uploadProfilePicture(
    userId: string,
    file: File,
  ): Promise<UploadProfilePictureResult> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/avif",
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new ConflictError(
        "Invalid file type. Allowed types: JPEG, PNG, GIF, WebP, AVIF",
      );
    }

    // Validate file size (max 5MB before optimization)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new ConflictError("File size too large. Maximum size is 5MB");
    }

    // Delete old profile picture if exists
    if (user.profilePicturePublicId) {
      await deleteImage(user.profilePicturePublicId);
    }

    // Convert File to ArrayBuffer then to Buffer for Cloudinary
    const arrayBuffer = await file.arrayBuffer();

    // Upload to Cloudinary with optimization
    const uploadResult = await uploadProfileImage(arrayBuffer, userId);

    // Update user with new profile picture URL
    await userRepository.updateProfilePicture(userId, {
      profilePictureUrl: uploadResult.secureUrl,
      profilePicturePublicId: uploadResult.publicId,
    });

    return {
      message: "Profile picture uploaded successfully",
      profilePictureUrl: uploadResult.secureUrl,
    };
  },

  async deleteProfilePicture(userId: string): Promise<{ message: string }> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!user.profilePicturePublicId) {
      throw new NotFoundError("No profile picture to delete");
    }

    // Delete from Cloudinary
    await deleteImage(user.profilePicturePublicId);

    // Update user to remove profile picture
    await userRepository.updateProfilePicture(userId, {
      profilePictureUrl: null,
      profilePicturePublicId: null,
    });

    return { message: "Profile picture deleted successfully" };
  },

  async deleteAccount(userId: string): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Delete profile picture from Cloudinary if exists
    if (user.profilePicturePublicId) {
      await deleteImage(user.profilePicturePublicId);
    }

    await userRepository.delete(userId);
  },
};
