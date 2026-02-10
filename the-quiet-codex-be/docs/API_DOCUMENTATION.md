# The Quiet Codex API (Backend)

This document describes the backend HTTP API for frontend consumption.

## Base URL

- Development default: `http://localhost:3000`
- OpenAPI docs: `GET /docs`

> The port is controlled by `PORT` (default 3000). CORS origin is controlled by `CORS_ORIGIN`.

## Authentication

- Access token: returned in response body as `accessToken`.
- Refresh token: stored in an HTTP-only cookie named `refreshToken`.
- Protected routes require header: `Authorization: Bearer <accessToken>`.

### Refresh Token Cookie

- Name: `refreshToken`
- HttpOnly: `true`
- SameSite: `strict`
- Secure: `true` in production
- Max-Age: 7 days
- Path: `/`

## Standard Error Response

All error responses use the following shape:

```json
{ "message": "Error description" }
```

Common status codes:

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 422 Validation Failed
- 500 Internal Server Error

## Health

### GET /health

Health check endpoint.

**Response 200**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Auth

### POST /auth/signup

Register a new user and receive an access token.

**Request body**

```json
{
  "username": "johndoe",
  "password": "securepass123"
}
```

**Response 200**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe"
  }
}
```

**Errors**: 409, 422

---

### POST /auth/signin

Authenticate a user and receive an access token.

**Request body**

```json
{
  "username": "johndoe",
  "password": "securepass123"
}
```

**Response 200**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe"
  }
}
```

**Errors**: 401, 422

---

### POST /auth/refresh

Issue a new access token using the refresh token cookie.

**Request**

- Requires `refreshToken` cookie

**Response 200**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe"
  }
}
```

**Errors**: 401

---

### POST /auth/logout

Invalidate user tokens and clear the refresh token cookie.

**Auth**: Bearer token

**Response 200**

```json
{ "message": "Logged out successfully" }
```

**Errors**: 401

## Users

All user endpoints are protected.

### GET /users/me

Get the current user's profile.

**Auth**: Bearer token

**Response 200**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe",
  "profilePictureUrl": "https://res.cloudinary.com/.../profile.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors**: 401

---

### PUT /users/me

Update current user profile.

**Auth**: Bearer token

**Request body**

```json
{
  "username": "newusername",
  "password": "newsecurepass123"
}
```

**Response 200**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "newusername",
  "profilePictureUrl": "https://res.cloudinary.com/.../profile.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors**: 401, 409, 422

---

### POST /users/me/profile-picture

Upload a profile picture for the current user.

**Auth**: Bearer token

**Content-Type**: `multipart/form-data`

**Form fields**

- `file`: image file (jpeg, png, gif, webp, avif), max size 5MB

**Response 200**

```json
{
  "message": "Profile picture uploaded successfully",
  "profilePictureUrl": "https://res.cloudinary.com/.../profile.jpg"
}
```

**Errors**: 400, 401, 404

---

### DELETE /users/me/profile-picture

Delete the current user's profile picture.

**Auth**: Bearer token

**Response 200**

```json
{ "message": "Profile picture deleted successfully" }
```

**Errors**: 401, 404

---

### DELETE /users/me

Delete the current user's account.

**Auth**: Bearer token

**Response 200**

```json
{ "message": "Account deleted successfully" }
```

**Errors**: 401

## Articles (Public)

### GET /articles

List published articles.

**Query params**

- `page` (optional, >= 1)
- `limit` (optional, 1..50)
- `authorId` (optional, UUID)

**Response 200**

```json
{
  "articles": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "slug": "my-awesome-article",
      "title": "My Awesome Article",
      "metaDescription": "A brief description of the article for SEO purposes.",
      "bannerImageUrl": "https://res.cloudinary.com/.../banner.jpg",
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "author": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "johndoe",
        "profilePictureUrl": "https://res.cloudinary.com/.../profile.jpg"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

---

### GET /articles/slug/:slug

Get a published article by slug.

**Response 200**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "my-awesome-article",
  "title": "My Awesome Article",
  "metaDescription": "A brief description of the article for SEO purposes.",
  "bannerImageUrl": "https://res.cloudinary.com/.../banner.jpg",
  "body": "<p>This is the article content with <strong>HTML</strong>.</p>",
  "publishedAt": "2024-01-01T00:00:00.000Z",
  "author": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "profilePictureUrl": "https://res.cloudinary.com/.../profile.jpg"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors**: 404

---

### GET /articles/slug/:slug/meta

Return Open Graph / SEO metadata for a published article.

**Response 200**

```json
{
  "title": "My Awesome Article",
  "description": "A brief description of the article for SEO purposes.",
  "image": "https://res.cloudinary.com/.../banner.jpg",
  "url": "https://the-quiet-codex.com/article/my-awesome-article",
  "author": "johndoe",
  "publishedAt": "2024-01-01T00:00:00.000Z",
  "type": "article"
}
```

**Errors**: 404

## Articles (Protected)

All protected article endpoints require a Bearer token.

### GET /articles/me

List the current user's articles (including drafts).

**Auth**: Bearer token

**Query params**

- `page` (optional, >= 1)
- `limit` (optional, 1..50)

**Response 200**

Same shape as `GET /articles`.

**Errors**: 401

---

### POST /articles

Create a new article.

**Auth**: Bearer token

**Request body**

```json
{
  "title": "My Awesome Article",
  "metaDescription": "A brief description of the article for SEO purposes.",
  "body": "<p>This is the article content with <strong>HTML</strong>.</p>",
  "slug": "my-custom-slug",
  "publish": true
}
```

**Response 200**

Same shape as `GET /articles/slug/:slug`.

**Errors**: 401, 409, 422

---

### GET /articles/:id

Get an article by ID (authors can view their own drafts).

**Auth**: Bearer token

**Response 200**

Same shape as `GET /articles/slug/:slug`.

**Errors**: 401, 404

---

### PUT /articles/:id

Update an existing article.

**Auth**: Bearer token

**Request body**

```json
{
  "title": "Updated Article Title",
  "metaDescription": "Updated description for SEO.",
  "body": "<p>Updated article content.</p>",
  "slug": "updated-custom-slug",
  "publish": true
}
```

**Response 200**

Same shape as `GET /articles/slug/:slug`.

**Errors**: 401, 403, 404, 409, 422

---

### DELETE /articles/:id

Delete an article.

**Auth**: Bearer token

**Response 200**

```json
{ "message": "Article deleted successfully" }
```

**Errors**: 401, 403, 404

---

### POST /articles/:id/banner

Upload a banner image for an article.

**Auth**: Bearer token

**Content-Type**: `multipart/form-data`

**Form fields**

- `file`: image file (jpeg, png, gif, webp, avif), max size 1MB

**Response 200**

```json
{
  "message": "Banner image uploaded successfully",
  "bannerImageUrl": "https://res.cloudinary.com/.../banner.jpg"
}
```

**Errors**: 400, 401, 403, 404

---

### DELETE /articles/:id/banner

Delete the banner image for an article.

**Auth**: Bearer token

**Response 200**

```json
{ "message": "Operation successful" }
```

**Errors**: 401, 403, 404
