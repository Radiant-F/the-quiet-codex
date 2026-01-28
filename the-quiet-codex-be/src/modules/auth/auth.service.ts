import { authRepository } from "./auth.repository";
import { ConflictError, UnauthorizedError } from "../../lib/errors";

interface SignupInput {
  username: string;
  password: string;
}

interface SigninInput {
  username: string;
  password: string;
}

interface AuthResult {
  user: {
    id: string;
    username: string;
    tokenVersion: number;
  };
}

export const authService = {
  async signup(input: SignupInput): Promise<AuthResult> {
    const existingUser = await authRepository.findByUsername(input.username);
    if (existingUser) {
      throw new ConflictError("Username already exists");
    }

    const passwordHash = await Bun.password.hash(input.password);

    const user = await authRepository.create({
      username: input.username,
      passwordHash,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        tokenVersion: user.tokenVersion,
      },
    };
  },

  async signin(input: SigninInput): Promise<AuthResult> {
    const user = await authRepository.findByUsername(input.username);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isValidPassword = await Bun.password.verify(
      input.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid credentials");
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        tokenVersion: user.tokenVersion,
      },
    };
  },

  async logout(userId: string): Promise<void> {
    await authRepository.incrementTokenVersion(userId);
  },

  async getUserById(
    userId: string,
  ): Promise<{ id: string; username: string; tokenVersion: number } | null> {
    const user = await authRepository.findById(userId);
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      username: user.username,
      tokenVersion: user.tokenVersion,
    };
  },
};
