import { describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { app } from "../../index";

const api = treaty(app);

describe("Auth Module", () => {
  const testUser = {
    username: `testuser_${String(Date.now())}`,
    password: "securePassword123",
  };

  describe("POST /auth/signup", () => {
    it("should register a new user with valid data", async () => {
      const { data, error } = await api.auth.signup.post(testUser);

      expect(error).toBeNull();
      expect(data?.accessToken).toBeDefined();
      expect(data?.user.username).toBe(testUser.username);
    });

    it("should return 409 for duplicate username", async () => {
      const { error } = await api.auth.signup.post(testUser);
      expect(error?.status).toBe(409);
    });

    it("should return 422 for validation error", async () => {
      const { error } = await api.auth.signup.post({
        username: "ab",
        password: "short",
      });
      expect(error?.status).toBe(422);
    });
  });

  describe("POST /auth/signin", () => {
    it("should sign in with valid credentials", async () => {
      const { data, error } = await api.auth.signin.post(testUser);

      expect(error).toBeNull();
      expect(data?.accessToken).toBeDefined();
      expect(data?.user.username).toBe(testUser.username);
    });

    it("should return 401 for wrong password", async () => {
      const { error } = await api.auth.signin.post({
        username: testUser.username,
        password: "wrongpassword123",
      });
      expect(error?.status).toBe(401);
    });

    it("should return 401 for non-existent user", async () => {
      const { error } = await api.auth.signin.post({
        username: "nonexistentuser",
        password: "password123",
      });
      expect(error?.status).toBe(401);
    });
  });

  describe("POST /auth/logout", () => {
    it("should return 401 without token", async () => {
      const { error } = await api.auth.logout.post({});
      expect(error?.status).toBe(401);
    });

    it("should logout with valid token", async () => {
      // First sign in to get a fresh token
      const signinRes = await api.auth.signin.post(testUser);
      const token = signinRes.data?.accessToken ?? "";

      const { data, error } = await api.auth.logout.post(
        {},
        { headers: { authorization: `Bearer ${token}` } },
      );

      expect(error).toBeNull();
      expect(data?.message).toBe("Logged out successfully");
    });

    it("should return 401 for revoked token after logout", async () => {
      // Sign in again
      const signinRes = await api.auth.signin.post(testUser);
      const token = signinRes.data?.accessToken ?? "";

      // Logout
      await api.auth.logout.post(
        {},
        { headers: { authorization: `Bearer ${token}` } },
      );

      // Try to use the old token
      const { error } = await api.auth.logout.post(
        {},
        { headers: { authorization: `Bearer ${token}` } },
      );
      expect(error?.status).toBe(401);
    });
  });
});
