import { t } from "elysia";

export const errorResponse = t.Object({
  message: t.String({ examples: ["Error description"] }),
});

export const userResponse = t.Object({
  id: t.String({ examples: ["550e8400-e29b-41d4-a716-446655440000"] }),
  username: t.String({ examples: ["johndoe"] }),
  profilePictureUrl: t.Optional(
    t.Nullable(
      t.String({
        examples: ["https://res.cloudinary.com/.../profile.jpg"],
      }),
    ),
  ),
  createdAt: t.String({ examples: ["2024-01-01T00:00:00.000Z"] }),
  updatedAt: t.String({ examples: ["2024-01-01T00:00:00.000Z"] }),
});

export const updateUserBody = t.Object({
  username: t.Optional(
    t.String({
      minLength: 3,
      maxLength: 32,
      examples: ["newusername"],
    }),
  ),
  password: t.Optional(
    t.String({
      minLength: 8,
      maxLength: 128,
      examples: ["newsecurepass123"],
    }),
  ),
});

export const messageResponse = t.Object({
  message: t.String({ examples: ["Operation successful"] }),
});

export const uploadProfilePictureResponse = t.Object({
  message: t.String({ examples: ["Profile picture uploaded successfully"] }),
  profilePictureUrl: t.String({
    examples: ["https://res.cloudinary.com/.../profile.jpg"],
  }),
});

export const deleteProfilePictureResponse = t.Object({
  message: t.String({ examples: ["Profile picture deleted successfully"] }),
});
