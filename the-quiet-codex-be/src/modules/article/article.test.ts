import { describe, expect, it, beforeAll } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { app } from "../../index";

const api = treaty(app);

describe("Article Module", () => {
  const testUser = {
    username: `articletest_${String(Date.now())}`,
    password: "securePassword123",
  };

  let accessToken: string;
  let createdArticleId: string;
  let createdArticleSlug: string;

  beforeAll(async () => {
    // Create a test user and get token
    const { data } = await api.auth.signup.post(testUser);
    if (data?.accessToken) {
      accessToken = data.accessToken;
    }
  });

  describe("POST /articles - Create Article", () => {
    it("should return 401 without token", async () => {
      const response = await app.handle(
        new Request("http://localhost/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Test Article",
            metaDescription: "A test article description",
            body: "<p>Test body</p>",
          }),
        }),
      );
      expect(response.status).toBe(401);
    });

    it("should create article with auto-generated slug", async () => {
      const response = await app.handle(
        new Request("http://localhost/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: "My First Amazing Article",
            metaDescription: "This is a test article for SEO purposes.",
            body: "<p>This is the article <strong>body</strong> with HTML.</p>",
            publish: true,
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as {
        id: string;
        slug: string;
        title: string;
        author: { username: string };
        publishedAt: string | null;
      };
      expect(data.title).toBe("My First Amazing Article");
      expect(data.slug).toBe("my-first-amazing-article");
      expect(data.author.username).toBe(testUser.username);
      expect(data.publishedAt).not.toBeNull();

      createdArticleId = data.id;
      createdArticleSlug = data.slug;
    });

    it("should create article with custom slug", async () => {
      const response = await app.handle(
        new Request("http://localhost/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: "Another Article Title",
            metaDescription: "Another test article.",
            body: "<p>Body content</p>",
            slug: "custom-slug-here",
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as { slug: string };
      expect(data.slug).toBe("custom-slug-here");
    });

    it("should reject duplicate custom slug", async () => {
      const response = await app.handle(
        new Request("http://localhost/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: "Duplicate Slug Test",
            metaDescription: "Testing duplicate slug.",
            body: "<p>Body</p>",
            slug: "custom-slug-here", // Already exists
          }),
        }),
      );

      expect(response.status).toBe(409);
    });

    it("should auto-increment slug on title collision", async () => {
      const response = await app.handle(
        new Request("http://localhost/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: "My First Amazing Article", // Same title as first article
            metaDescription: "Another article with same title.",
            body: "<p>Body</p>",
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as { slug: string };
      expect(data.slug).toBe("my-first-amazing-article-1");
    });

    it("should sanitize HTML in body", async () => {
      const response = await app.handle(
        new Request("http://localhost/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: "XSS Test Article",
            metaDescription: "Testing XSS prevention.",
            body: '<p>Safe content</p><script>alert("xss")</script>',
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as { body: string };
      expect(data.body).not.toContain("<script>");
      expect(data.body).toContain("<p>Safe content</p>");
    });

    it("should create unpublished draft when publish is false", async () => {
      const response = await app.handle(
        new Request("http://localhost/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: "Draft Article",
            metaDescription: "This is a draft.",
            body: "<p>Draft content</p>",
            publish: false,
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as { publishedAt: string | null };
      expect(data.publishedAt).toBeNull();
    });
  });

  describe("GET /articles - List Published Articles", () => {
    it("should return paginated published articles", async () => {
      const response = await app.handle(
        new Request("http://localhost/articles"),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as {
        articles: unknown[];
        total: number;
        page: number;
      };
      expect(data.articles).toBeInstanceOf(Array);
      expect(data.total).toBeGreaterThan(0);
      expect(data.page).toBe(1);
    });

    it("should support pagination", async () => {
      const response = await app.handle(
        new Request("http://localhost/articles?page=1&limit=2"),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as { limit: number };
      expect(data.limit).toBe(2);
    });
  });

  describe("GET /articles/slug/:slug - Get Published Article", () => {
    it("should return article by slug", async () => {
      const response = await app.handle(
        new Request(`http://localhost/articles/slug/${createdArticleSlug}`),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as { slug: string; title: string };
      expect(data.slug).toBe(createdArticleSlug);
      expect(data.title).toBe("My First Amazing Article");
    });

    it("should return 404 for non-existent slug", async () => {
      const response = await app.handle(
        new Request("http://localhost/articles/slug/non-existent-slug-12345"),
      );
      expect(response.status).toBe(404);
    });

    it("should return 404 for unpublished article via public endpoint", async () => {
      const response = await app.handle(
        new Request("http://localhost/articles/slug/draft-article"),
      );
      expect(response.status).toBe(404);
    });
  });

  describe("GET /articles/slug/:slug/meta - Get Article Meta", () => {
    it("should return Open Graph meta data", async () => {
      const response = await app.handle(
        new Request(
          `http://localhost/articles/slug/${createdArticleSlug}/meta`,
        ),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as {
        title: string;
        description: string;
        type: string;
        url: string;
      };
      expect(data.title).toBe("My First Amazing Article");
      expect(data.description).toBe("This is a test article for SEO purposes.");
      expect(data.type).toBe("article");
      expect(data.url).toContain(createdArticleSlug);
    });
  });

  describe("GET /articles/me - List My Articles", () => {
    it("should return 401 without token", async () => {
      const response = await app.handle(
        new Request("http://localhost/articles/me"),
      );
      expect(response.status).toBe(401);
    });

    it("should return all user's articles including drafts", async () => {
      const response = await app.handle(
        new Request("http://localhost/articles/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as {
        articles: unknown[];
        total: number;
      };
      expect(data.articles).toBeInstanceOf(Array);
      expect(data.total).toBeGreaterThanOrEqual(1);
    });
  });

  describe("PUT /articles/:id - Update Article", () => {
    it("should return 401 without token", async () => {
      const response = await app.handle(
        new Request(`http://localhost/articles/${createdArticleId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "Updated Title" }),
        }),
      );
      expect(response.status).toBe(401);
    });

    it("should update article title", async () => {
      const response = await app.handle(
        new Request(`http://localhost/articles/${createdArticleId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ title: "Updated Article Title" }),
        }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as { title: string };
      expect(data.title).toBe("Updated Article Title");
    });

    it("should update article slug", async () => {
      const response = await app.handle(
        new Request(`http://localhost/articles/${createdArticleId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ slug: "updated-custom-slug" }),
        }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as { slug: string };
      expect(data.slug).toBe("updated-custom-slug");
      createdArticleSlug = "updated-custom-slug";
    });

    it("should unpublish article with publish: false", async () => {
      const response = await app.handle(
        new Request(`http://localhost/articles/${createdArticleId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ publish: false }),
        }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as { publishedAt: string | null };
      expect(data.publishedAt).toBeNull();
    });

    it("should re-publish article", async () => {
      const response = await app.handle(
        new Request(`http://localhost/articles/${createdArticleId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ publish: true }),
        }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as { publishedAt: string | null };
      expect(data.publishedAt).not.toBeNull();
    });
  });

  describe("GET /articles/:id - Get Article by ID (Auth)", () => {
    it("should return article by ID for author", async () => {
      const response = await app.handle(
        new Request(`http://localhost/articles/${createdArticleId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as { id: string };
      expect(data.id).toBe(createdArticleId);
    });
  });

  describe("DELETE /articles/:id - Delete Article", () => {
    it("should return 401 without token", async () => {
      const response = await app.handle(
        new Request(`http://localhost/articles/${createdArticleId}`, {
          method: "DELETE",
        }),
      );
      expect(response.status).toBe(401);
    });

    it("should delete article", async () => {
      // Create an article to delete
      const createRes = await app.handle(
        new Request("http://localhost/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: "Article to Delete",
            metaDescription: "This will be deleted.",
            body: "<p>Delete me</p>",
          }),
        }),
      );

      const createData = (await createRes.json()) as { id: string };
      const articleToDeleteId = createData.id;

      const response = await app.handle(
        new Request(`http://localhost/articles/${articleToDeleteId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      expect(response.status).toBe(200);

      // Verify it's deleted
      const verifyRes = await app.handle(
        new Request(`http://localhost/articles/${articleToDeleteId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      expect(verifyRes.status).toBe(404);
    });
  });

  describe("Ownership Validation", () => {
    it("should not allow updating another user's article", async () => {
      // Create another user
      const anotherUser = {
        username: `another_${String(Date.now())}`,
        password: "securePassword123",
      };
      const signupRes = await api.auth.signup.post(anotherUser);
      const anotherToken = signupRes.data?.accessToken ?? "";

      // Try to update the first user's article
      const response = await app.handle(
        new Request(`http://localhost/articles/${createdArticleId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${anotherToken}`,
          },
          body: JSON.stringify({ title: "Hacked Title" }),
        }),
      );

      expect(response.status).toBe(403);
    });
  });
});
