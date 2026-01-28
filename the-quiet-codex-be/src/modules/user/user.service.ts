import { userRepository } from "./user.repository";
import { NotFoundError, ConflictError } from "../../lib/errors";

interface UpdateUserInput {
  username?: string;
  password?: string;
}

interface UserProfile {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
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
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    }

    const updatedUser = await userRepository.update(userId, updateData);

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    };
  },

  async deleteAccount(userId: string): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await userRepository.delete(userId);
  },
};
