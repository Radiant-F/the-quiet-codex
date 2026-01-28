import { describe, expect, it, beforeAll } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { app } from "../../index";

const api = treaty(app);

describe("User Module", () => {
  const testUser = {
    username: `usertest_${String(Date.now())}`,
    password: "securePassword123",
  };

  let accessToken: string;

  beforeAll(async () => {
    // Create a test user and get token
    const { data } = await api.auth.signup.post(testUser);
    if (data?.accessToken) {
      accessToken = data.accessToken;
    }
  });

  describe("GET /users/me", () => {
    it("should return 401 without token", async () => {
      const { error } = await api.users.me.get();
      expect(error?.status).toBe(401);
    });

    it("should return user profile with valid token", async () => {
      const { data, error } = await api.users.me.get({
        headers: { authorization: `Bearer ${accessToken}` },
      });

      expect(error).toBeNull();
      expect(data?.username).toBe(testUser.username);
      expect(data?.id).toBeDefined();
    });
  });

  describe("PUT /users/me", () => {
    it("should return 401 without token", async () => {
      const { error } = await api.users.me.put({ username: "newname" });
      expect(error?.status).toBe(401);
    });

    it("should update username with valid token", async () => {
      const newUsername = `updated_${String(Date.now())}`;
      const { data, error } = await api.users.me.put(
        { username: newUsername },
        { headers: { authorization: `Bearer ${accessToken}` } },
      );

      expect(error).toBeNull();
      expect(data?.username).toBe(newUsername);
    });

    it("should return 422 for invalid data", async () => {
      const { error } = await api.users.me.put(
        { username: "ab" }, // too short
        { headers: { authorization: `Bearer ${accessToken}` } },
      );
      expect(error?.status).toBe(422);
    });
  });

  describe("DELETE /users/me", () => {
    it("should return 401 without token", async () => {
      const { error } = await api.users.me.delete();
      expect(error?.status).toBe(401);
    });

    it("should delete account with valid token", async () => {
      // Create another user to delete with unique timestamp + random suffix
      const deleteUser = {
        username: `del_${String(Date.now())}_${String(Math.random()).slice(2, 8)}`,
        password: "securePassword123",
      };

      const signupRes = await api.auth.signup.post(deleteUser);

      // If signup fails, throw early
      if (signupRes.error) {
        throw new Error(
          `Signup failed with status ${String(signupRes.error.status)}`,
        );
      }

      if (!signupRes.data.accessToken) {
        throw new Error(
          `Signup succeeded but no accessToken: ${JSON.stringify(signupRes.data)}`,
        );
      }

      const deleteToken = signupRes.data.accessToken;

      // Use app.handle directly for DELETE as Eden Treaty has issues with headers on DELETE
      const response = await app.handle(
        new Request("http://localhost/users/me", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${deleteToken}`,
          },
        }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as { message: string };
      expect(data.message).toBe("Account deleted successfully");

      // Verify user is deleted by trying to sign in
      const signinRes = await api.auth.signin.post(deleteUser);
      expect(signinRes.error?.status).toBe(401);
    });
  });
});
